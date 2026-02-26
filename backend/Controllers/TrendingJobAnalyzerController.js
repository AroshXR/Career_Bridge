import axios from 'axios';
import process from 'process';
import { GoogleGenerativeAI } from "@google/generative-ai";
import SavedJob from '../Models/SavedJobModel.js';
import User from '../Models/User.js';
import ResponseGenerator from '../utils/ResponseGenerator.js';

console.log("[TrendingController] Module LOADED at", new Date().toISOString());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple In-Memory Cache for Trending Jobs
const trendingCache = {
    data: {},
    lastUpdatedDate: null
};

export const getTrendingJobs = async (req, res) => {
    try {
        const queryCategory = req.query.category;
        let category = (queryCategory && queryCategory.trim()) ? queryCategory : null;

        // If no category provided, fetch from user profile
        if (!category && req.user) {
            try {
                const user = await User.findById(req.user.id);
                if (user && user.industrialPreference && user.industrialPreference.length > 0) {
                    category = user.industrialPreference[0];
                    console.log(`[TrendingController] Using user preference category: "${category}"`);
                }
            } catch (userErr) {
                console.warn("[TrendingController] Failed to fetch user preferences:", userErr.message);
            }
        }

        // Fallback to default
        if (!category) {
            category = 'Information Technology';
            console.log(`[TrendingController] Using fallback category: "${category}"`);
        }

        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const adzunaAppId = process.env.ADZUNA_APP_ID;
        const adzunaAppKey = process.env.ADZUNA_APP_KEY;

        // Use current date
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // --- Cache Logic ---
        if (trendingCache.lastUpdatedDate !== currentDate) {
            trendingCache.data = {};
            trendingCache.lastUpdatedDate = currentDate;
        }

        if (trendingCache.data[category]) {
            console.log(`[TrendingController] Serving cached data for: ${category}`);
            return res.json(ResponseGenerator.sendSuccess({
                meta: { category, timestamp: new Date().toISOString(), cached: true },
                ...trendingCache.data[category]
            }));
        }

        console.log(`[TrendingController] Cache miss. Fetching signals for: ${category}`);

        // Clean category for search queries
        const searchKeyword = category.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ').replace(/\s+/g, ' ').trim();

        // 1. JSearch API Configuration
        const jSearchOptions = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: `Trending ${searchKeyword} jobs globally`,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        // 2. Adzuna Fetch Logic
        const fetchAdzuna = async () => {
            if (!adzunaAppId || !adzunaAppKey) return [];
            try {
                const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1`;
                const response = await axios.get(url, {
                    params: {
                        app_id: adzunaAppId,
                        app_key: adzunaAppKey,
                        what: searchKeyword,
                        results_per_page: 15
                    }
                });
                return (response.data.results || []).map(job => ({
                    title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
                    description: job.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100)
                }));
            } catch (err) {
                console.error("[TrendingController] Adzuna Error:", err.message);
                return [];
            }
        };

        // Signals Fetching (Externalized below in final version, or kept inline for simplicity as requested)

        // Concurrent Fetching
        console.log(`[TrendingController] Fetching signals for: ${searchKeyword}`);

        let jSearchJobs = []; // Declare jSearchJobs here
        let adzunaJobs = [];

        try {
            const results = await Promise.allSettled([
                axios.request(jSearchOptions),
                fetchAdzuna()
            ]);

            if (results[0].status === 'fulfilled') {
                jSearchJobs = (results[0].value.data.data || []).slice(0, 15).map(job => ({
                    t: job.job_title,
                    d: job.job_description?.substring(0, 100)
                }));
            }
            if (results[1].status === 'fulfilled') {
                adzunaJobs = results[1].value;
            }
        } catch (signalErr) {
            console.error("[TrendingController] Signal Fetch Warning:", signalErr.message);
        }

        console.log(`[TrendingController] Signals Found - JSearch: ${jSearchJobs.length}, Adzuna: ${adzunaJobs.length}`);

        // 4. Stabilized Single Gemini Analysis (with Retry Logic for 429)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `
            Sector: "${category}" as of ${currentDate}.
            Market Signals (Current Job Openings): JSearch Results: ${JSON.stringify(jSearchJobs)}, Adzuna: ${JSON.stringify(adzunaJobs)}.
            Task: Using these market signals AND your internal specialized market knowledge, suggest exactly 50 unique high-growth roles for this sector for the year 2026.
            Note: If market signals are sparse or empty, focus heavily on your internal knowledge of the "${category}" industry to predict emerging roles.
            Return ONLY a valid JSON array of objects: [{ "title": string, "description": string, "key_skills": [string], "demand_level": "High"|"Moderate", "average_salary": string, "growth_factor": string }]
        `;

        const generateWithRetry = async (prompt, maxRetries = 4) => {
            let lastError;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    console.log(`[TrendingController] Gemini Request attempt ${i + 1} for: ${category}...`);
                    const result = await model.generateContent(prompt);
                    return await result.response.text();
                } catch (err) {
                    lastError = err;
                    // Check for 429 (Rate Limit) or 503 (High Demand/Overloaded)
                    if (err.status === 429 || err.status === 503 || err.message?.includes('429') || err.message?.includes('503') || err.message?.includes('Quota exceeded')) {
                        const waitTime = Math.pow(2, i) * 2000 + Math.random() * 1000;
                        console.warn(`[TrendingController] API Busy (${err.status || 'Error'}). Retrying in ${Math.round(waitTime / 1000)}s...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }
                    throw err; // Re-throw other errors
                }
            }
            throw lastError;
        };

        const responseText = await generateWithRetry(prompt);

        let trendingRoles = [];
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            const rawData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
            trendingRoles = Array.isArray(rawData) ? rawData : [];
        } catch (parseErr) {
            console.error("[TrendingController] Gemini Parse Error. Response was not valid JSON.");
            throw new Error("AI returned invalid data format");
        }

        console.log(`[TrendingController] Total roles generated for ${category}: ${trendingRoles.length}`);

        // Store results in cache
        const finalResponse = {
            stats: {
                totalMarketSignals: jSearchJobs.length + adzunaJobs.length,
                analyzedRoles: trendingRoles.length
            },
            roles: trendingRoles
        };
        trendingCache.data[category] = finalResponse;

        res.json(ResponseGenerator.sendSuccess({
            meta: { category, timestamp: new Date().toISOString(), cached: false },
            ...finalResponse
        }));

    } catch (error) {
        console.error("Critical Controller Error:", error);
        res.status(500).json(ResponseGenerator.sendError(
            "5000",
            error.message || "Failed to process trending roles"
        ));
    }
};

export const saveJob = async (req, res) => {
    try {
        const { jobId, title, description, company, location } = req.body;
        const userEmail = req.user.email; // Use email from token as username identifier

        if (!jobId) {
            return res.status(400).json(ResponseGenerator.sendError(
                "4001",
                "jobId is required"
            ));
        }

        const newSavedJob = new SavedJob({ 
            jobId, 
            title, 
            description, 
            username: userEmail, 
            company, 
            location 
        });
        await newSavedJob.save();
        res.status(201).json(ResponseGenerator.sendSuccess(
            { savedJob: newSavedJob, message: "Job saved successfully" }
        ));
    } catch (error) {
        const isDuplicate = error.code === 11000;
        res.status(isDuplicate ? 400 : 500).json(ResponseGenerator.sendError(
            isDuplicate ? "4002" : "5000",
            isDuplicate ? "Job already saved" : error.message
        ));
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const savedJobs = await SavedJob.find({ username: userEmail }).sort({ savedAt: -1 });
        res.status(200).json(ResponseGenerator.sendSuccess(
            { jobs: savedJobs, count: savedJobs.length }
        ));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError("5000", error.message));
    }
};

export const updateSavedJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const updatedJob = await SavedJob.findOneAndUpdate(
            { _id: id, username: req.user.email },
            { $set: { notes } },
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(404).json(ResponseGenerator.sendError(
                "4041",
                "Saved job not found or unauthorized"
            ));
        }

        res.status(200).json(ResponseGenerator.sendSuccess(
            { updatedJob, message: "Job updated successfully" }
        ));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError("5000", error.message));
    }
};

export const deleteSavedJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await SavedJob.findOneAndDelete({ _id: id, username: req.user.email });

        if (!deletedJob) {
            return res.status(404).json(ResponseGenerator.sendError(
                "4041",
                "Saved job not found or unauthorized"
            ));
        }

        res.status(200).json(ResponseGenerator.sendSuccess(
            { message: "Job deleted successfully" }
        ));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError("5000", error.message));
    }
};
