import axios from 'axios';
import process from 'process';
import SavedJob from '../Models/SavedJobModel.js';

// Dummy Data for User
const dummyUser = {
    id: 1,
    name: "Aroshana Sandeep",
    age: 22,
    preferredField: "Software Engineering"
};

export const getTrendingJobs = async (req, res) => {
    try {
        const user = dummyUser;
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        // Take all parameters dynamically from the frontend query
        const { country, limit, what } = req.query;

        // Use frontend values, falling back to user preferences only if not provided
        const targetCountry = country || 'gb';
        const resultsPerPage = limit || 10;
        const searchTerm = what || user.preferredField;

        // Log for debugging
        console.log(`Fetching jobs: "${searchTerm}" in ${targetCountry} (Count: ${resultsPerPage})`);

        // Construct the Adzuna API URL using dynamic parameters from frontend
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/${targetCountry}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(searchTerm)}&content-type=application/json`;

        // Fetch jobs from Adzuna API
        const response = await axios.get(apiUrl);
        const jobs = response.data.results;

        // Map the API response to our custom format
        const formattedJobs = jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company.display_name,
            field: job.category.label,
            location: job.location.display_name,
            description: job.description,
            url: job.redirect_url,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            created: job.created
        }));

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                preferredField: user.preferredField,
                currentCountry: country
            },
            count: formattedJobs.length,
            jobs: formattedJobs
        });

    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        // Handle specific API errors if needed
        if (error.response) {
            console.error("API Response Data:", error.response.data);
            console.error("API Response Status:", error.response.status);

            // If Adzuna returns 404 for a country, handle it gracefully
            if (error.response.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: "Country not supported by the job provider."
                });
            }
        }

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
export const saveJob = async (req, res) => {
    try {
        const { jobId, title, company, location, description, url, username } = req.body;

        if (!jobId || !username) {
            return res.status(400).json({ success: false, message: "jobId and username are required" });
        }

        const newSavedJob = new SavedJob({
            jobId,
            title,
            company,
            location,
            description,
            url,
            username
        });

        await newSavedJob.save();

        res.status(201).json({
            success: true,
            message: "Job saved successfully",
            savedJob: newSavedJob
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Job already saved by this user" });
        }
        res.status(500).json({ success: false, message: "Error saving job", error: error.message });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }

        const savedJobs = await SavedJob.find({ username }).sort({ savedAt: -1 });

        res.status(200).json({
            success: true,
            count: savedJobs.length,
            savedJobs
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching saved jobs", error: error.message });
    }
};
