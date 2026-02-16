const axios = require('axios');

// Dummy Data for User
const dummyUser = {
    id: 1,
    name: "Aroshana Sandeep",
    age: 22,
    preferredField: "Software Engineering"
};

const getTrendingJobs = async (req, res) => {
    try {
        const user = dummyUser;
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;
        const country = 'gb'; // Using 'gb' as default, can be changed to 'us', 'in', etc.
        const resultsPerPage = 10;

        // Log for debugging
        console.log(`Fetching jobs for field: ${user.preferredField}`);

        // Construct the Adzuna API URL
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(user.preferredField)}&content-type=application/json`;

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
                preferredField: user.preferredField
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
        }

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getTrendingJobs
};
