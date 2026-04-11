/**
 * AUTH MOCKS
 * Standard responses for Login and Registration
 */
export const mockLoginResponse = {
  status: "00",
  data: {
    token: "mock-jwt-token",
    user: {
      _id: "65d1f1234567890123456789",
      userId: "001",
      name: "Test User",
      email: "test@example.com",
      role: "user"
    }
  },
  description: "Login successful",
  error: { errorCode: "0000", errorDescription: "Success." }
};

/**
 * JOB ANALYZER MOCKS
 * Standard responses for Trending Jobs
 */
export const mockTrendingJobs = {
  status: "00",
  data: {
    meta: { category: "Information Technology", timestamp: new Date().toISOString(), cached: false },
    stats: { totalMarketSignals: 50, analyzedRoles: 2 },
    roles: [
      {
        title: "Full Stack Developer",
        description: "Develops both client and server software.",
        key_skills: ["React", "Node.js", "MongoDB"],
        demand_level: "High",
        average_salary: "$100k - $120k",
        growth_factor: "15% Yearly"
      },
      {
        title: "Cloud Architect",
        description: "Designs and manages cloud infrastructure.",
        key_skills: ["AWS", "Azure", "Docker"],
        demand_level: "High",
        average_salary: "$130k - $160k",
        growth_factor: "20% Yearly"
      }
    ]
  },
  description: "SUCCESS",
  error: { errorCode: "0000", errorDescription: "Success." }
};
