import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const testTrendingJobs = async () => {
    try {
        console.log("Testing Trending Job Analyzer Controller...");
        const response = await axios.get('http://localhost:5000/api/v1/jobs/trending?category=Information%20Technology');

        if (response.data.success) {
            console.log("Success!");
            console.log(`Analyzed Roles: ${response.data.stats.analyzedRoles}`);
            console.log(`First Role: ${response.data.roles[0]?.title}`);
            console.log(`Last Role: ${response.data.roles[response.data.roles.length - 1]?.title}`);
            if (response.data.roles.length === 50) {
                console.log("Verified: Exactly 50 roles returned.");
            } else {
                console.warn(`Warning: Returned ${response.data.roles.length} roles instead of 50.`);
            }
        } else {
            console.error("Failed:", response.data.message);
        }
    } catch (error) {
        console.error("Error during test:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
};

testTrendingJobs();
