import axios from 'axios';
import process from 'process';
import SavedJob from '../Models/SavedJobModel.js';

// Dummy Data for User
const dummyUser = {
    id: 1,
    name: "Aroshana Sandeep",
    age: 22,
    preferredSkills: ["React", "Node.js", "MongoDB"],
    preferredArea: "Software Engineer"
};

export const getTrendingJobs = async (req, res) => {
    try {
        const user = dummyUser;
        const rapidApiKey = process.env.RAPIDAPI_KEY;

        // Construct a query based on user's preferred skills and job area (role)
        const skillsQuery = user.preferredSkills.join(' ');
        const searchQuery = `Trending ${user.preferredArea} jobs with ${skillsQuery}`;

        console.log(`Fetching trending jobs for role: "${user.preferredArea}" and skills: "${skillsQuery}" using JSearch`);

        const options = {
            method: 'GET',
            url: process.env.BASE_URL,
            params: {
                query: searchQuery,
                page: '1',
                num_pages: '1',
                date_posted: 'all'
            },
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const rawData = response.data;

        let jobList = [];
        if (rawData.data && Array.isArray(rawData.data)) {
            jobList = rawData.data;
        }

        const formattedJobs = jobList.map(job => ({
            id: job.job_id || Math.random().toString(36).substr(2, 9),
            title: job.job_title || 'Untitled Job',
            company: job.employer_name || 'Hidden Company',
            field: job.job_category || user.preferredSkills[0] || 'Jobs',
            location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : (job.job_location || user.preferredArea),
            description: job.job_description || "View full details on the job site.",
            url: job.job_apply_link || job.job_google_link,
            salary_min: job.job_min_salary || null,
            salary_max: job.job_max_salary || null,
            created: job.job_posted_at_datetime_utc || new Date().toISOString()
        }));

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                preferredSkills: user.preferredSkills,
                preferredArea: user.preferredArea,
                provider: "JSearch"
            },
            count: formattedJobs.length,
            jobs: formattedJobs
        });

    } catch (error) {
        console.error("Error fetching jobs from JSearch:", error.message);

        res.status(500).json({
            success: false,
            message: "Server Error while fetching trending jobs.",
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
