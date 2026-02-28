import axios from "axios";
import process from "process";
import SkillModel from "../Models/SkillModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

const MOCK_JOBS = [
  {
    success: true,
    user: {
      name: "Aroshana Sandeep",
      preferredField: "Software Engineering",
    },
    count: 10,
    jobs: [
      {
        id: "3",
        title: "Software Engineer",
        company: "Rolls Royce",
        field: "Engineering Jobs",
        location: "Pear Tree, Derby",
        description:
          "Job Description Software Engineer Derby or Solihull 37 hours per week Permanent We are looking for Software Engineers to join our Software Systems Capability function in Derby or Solihull Why join Rolls-Royce? At Rolls-Royce we are proud to be a business that has truly helped to shape the modern world and are committed to always being a force for progress; powering, protecting and connecting people everywhere. By joining Rolls-Royce, you'll have the opportunity to work on world-class solutions,…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 39514.05,
        salary_max: 39514.05,
        created: "2026-02-19T22:30:19Z",
      },
      {
        id: "5603018176",
        title: "Software Engineer",
        company: "WALLACE HIND SELECTION LIMITED",
        field: "IT Jobs",
        location: "Wrexham Technology Park, Wrexham",
        description:
          "Based in North Wales, join a leading European manufacturing organisation renowned for innovative technologies and award-winning operations. As our Software Engineer, you will support and develop OT applications, integrate automation systems, and play a key role in driving smart factory and Industry 4.0 digital transformation initiatives. BASIC SALARY: £35,000 - £40,000 BENEFITS: · Early finish on Fridays – circa 20 Fridays off per year · Enhanced employer pension contributions · Reduced gym mem…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 0,
        salary_max: 40000,
        created: "2026-01-28T09:22:39Z",
      },
      {
        id: "5604684284",
        title: "Software Engineer",
        company: "WALLACE HIND SELECTION LIMITED",
        field: "IT Jobs",
        location: "Hoole, Chester",
        description:
          "Based in North Wales, join a leading European manufacturing organisation renowned for innovative technologies and award-winning operations. As our Software Engineer, you will support and develop OT applications, integrate automation systems, and play a key role in driving smart factory and Industry 4.0 digital transformation initiatives. BASIC SALARY: £35,000 - £40,000 BENEFITS: · Early finish on Fridays – circa 20 Fridays off per year · Enhanced employer pension contributions · Reduced gym mem…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 0,
        salary_max: 40000,
        created: "2026-01-29T13:25:58Z",
      },
      {
        id: "5608586973",
        title: "Software Engineer",
        company: "Anson Mccade",
        field: "IT Jobs",
        location: "Gloucester, Gloucestershire",
        description:
          "Day Rate: £650  (Inside IR35) Contract Length: 12 months Clearance Required: UKIC DV An opportunity is available for an experienced Software Engineer to support a high-profile national security programme, delivering solutions that have real-world impact across UK Government environments. This is a long-term day-rate contract with a strong on-site requirement, predominantly based at a Cheltenham customer site , with some travel to Gloucester . The Role You will join a growing engineering team wo…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 66584.93,
        salary_max: 66584.93,
        created: "2026-02-01T11:22:05Z",
      },
      {
        id: "5639752920",
        title: "Software Engineer",
        company: "Chroma Recruitment Ltd",
        field: "IT Jobs",
        location: "Wolverham, Ellesmere Port",
        description:
          "Chroma are working with a nationally recognised engineering services provider who are searching for a Control Systems Software Engineer to join their team due to investments increasing the scale of their projects. We're looking for a versatile and experienced Control Systems Software Engineer who is highly skilled in the design and coding of PLC software. Your role will involve designing, developing, and maintaining new control systems as well as reworking the existing code. Control Systems Sof…",
        url: "https://www.google.com/search?q=control+systems+engineer+jobs",
        salary_min: 42058.6,
        salary_max: 42058.6,
        created: "2026-02-21T11:39:11Z",
      },
      {
        id: "5590275043",
        title: "Software Engineer",
        company: "WALLACE HIND SELECTION LIMITED",
        field: "IT Jobs",
        location: "Halton, Runcorn",
        description:
          "Based in North Wales, join a leading European manufacturing organisation renowned for innovative technologies and award-winning operations. As our Software Engineer, you will support and develop OT applications, integrate automation systems, and play a key role in driving smart factory and Industry 4.0 digital transformation initiatives. BASIC SALARY: £35,000 - £40,000 BENEFITS: · Early finish on Fridays – circa 20 Fridays off per year · Enhanced employer pension contributions · Reduced gym mem…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 0,
        salary_max: 40000,
        created: "2026-01-18T07:12:42Z",
      },
      {
        id: "5610466362",
        title: "Software Engineer",
        company: "Broadwood Resources Limited",
        field: "IT Jobs",
        location: "Buckie, Moray",
        description:
          "Benefits: Competitive salary  bonus Full-time position A great place to work within a supportive team Opportunity to work with one of the hottest new connected accounting systems globally Building competency jointly with the MD, with the opportunity to move into a management position Mileage allowance Pension Company Overview: This is an exciting opportunity to join an established IT solutions provider who is looking to appoint a motivated and focused Software Engineer for its Head Office in Cu…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 30000,
        salary_max: 30000,
        created: "2026-02-02T17:07:19Z",
      },
      {
        id: "5615157456",
        title: "Software Engineer",
        company: "Thales UK Limited",
        field: "IT Jobs",
        location: "Belfast, Northern Ireland",
        description:
          "Location: Belfast, United Kingdom Thales people architect solutions that are relied upon to deliver operational advantage at every decisive moment throughout the mission. Defence and armed forces customers rely on us to deliver the full range of defensive systems for land, sea, and air. From early warning, to threat neutralisation, our platforms cover all levels from very short-range systems, to extended protection across the entire battle-space including Airspace Mobility Solutions, Vehicles a…",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 55787.12,
        salary_max: 55787.12,
        created: "2026-02-05T04:07:51Z",
      },
      {
        id: "5607334840",
        title: "Software Engineer",
        company: "JAM Recruitment Ltd",
        field: "IT Jobs",
        location: "Cheltenham, Gloucestershire",
        description:
          "DV Cleared Software Engineer (DBA / Data-Focused) Contract: 12 months Location: Cheltenham (5 days per week onsite, occasional travel to Gloucester) Rate: £500 - £570 per day (Umbrella, Inside IR35) Must hold live UKIC DV clearance About the Role An exciting opportunity has arisen for an experienced Software Engineer with a strong DBA background to support a growing national security programme based in Cheltenham. This role sits within a high-performing technical team delivering solutions that …",
        url: "https://www.google.com/search?q=software+engineer+jobs",
        salary_min: 130000,
        salary_max: 148200,
        created: "2026-01-31T09:00:44Z",
      },
      {
        id: "1",
        title: "Frontend UI Developer",
        company: "Bennett & Game Recruitment",
        field: "IT Jobs",
        location: "Slough, Berkshire",
        description:
          "Position: Software EngineerLocation: Bristol or SloughSalary: £40,000-£45,000 My client is a long-established Engineering Services company supporting clients across the UK within the pharmaceutical and food processing sectors. They are looking to employ a junior software project engineer based in either Slough or Bristol although a significant amount of working from home can be expected once fully inducted. A clean driving licence and a willingness to travel to project sites is essential. As a …",
        url: "https://www.google.com/search?q=frontend+developer+jobs",
        salary_min: 40000,
        salary_max: 45000,
        created: "2026-02-11T23:09:45Z",
      },
    ],
  },
];

// --- CREATE: Analyze and Save ---
export const analyzeAndSaveSkills = async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.body; // Expecting userId from frontend

  try {
    let existingSkillDoc = await SkillModel.findOne({ jobId, userId });
    if (existingSkillDoc) return res.status(200).json(ResponseGenerator.sendSuccess(existingSkillDoc, "Skill analysis already exists"));

    const jobsArray = MOCK_JOBS[0].jobs;
    const selectedJob = jobsArray.find((j) => j.id === jobId);
    if (!selectedJob) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Job not found", "Skill analysis failed"));

    const { essential, optional } = await fetchSkillsFromEsco(selectedJob.title);

    const enrichData = async (list) => await Promise.all(
      list.map(async (skill) => ({
        ...skill,
        ...(await fetchSkillResourceDetails(skill.uri)),
        userNote: ""
      }))
    );

    const newSkillDoc = await SkillModel.create({
      userId,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      skills: [...(await enrichData(essential)), ...(await enrichData(optional))],
    });

    res.status(201).json(ResponseGenerator.sendSuccess(newSkillDoc, "Skills analyzed and saved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Skill analysis failed", error.message));
  }
};

// --- READ: Get User Dashboard ---
export const getMySavedSkills = async (req, res) => {
  const { userId } = req.params;
  try {
    const mySkills = await SkillModel.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(ResponseGenerator.sendSuccess(mySkills, "User skills retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch failed", error.message));
  }
};

// --- UPDATE: Edit Skill/Note ---
export const updateSkillDetails = async (req, res) => {
  const { jobId, skillId } = req.params;
  const { userNote, importance, userId } = req.body;

  if (!userId) {
    return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "userId is required", "Update failed"));
  }

  try {
    const updatedDoc = await SkillModel.findOneAndUpdate(
      { jobId, userId, "skills._id": skillId },
      {
        $set: {
          "skills.$.userNote": userNote,
          "skills.$.importance": importance
        }
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Skill not found for this user and job", "Update failed"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(updatedDoc, "Skill details updated successfully"));

  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Update failed", error.message));
  }
};

//Remove One Skill from List
export const removeSkillFromList = async (req, res) => {
  const { jobId, skillId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "userId is required", "Delete skill failed"));
  }

  try {
    const updatedDoc = await SkillModel.findOneAndUpdate(
      { jobId, userId },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Skill not found or unauthorized", "Delete skill failed"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(updatedDoc, "Skill removed from list successfully"));

  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete skill failed", error.message));
  }
};
// --- DELETE: Delete Full Analysis ---
export const deleteFullAnalysis = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "userId is required", "Delete analysis failed"));
  }

  try {
    const deletedDoc = await SkillModel.findOneAndDelete({ jobId, userId });

    if (!deletedDoc) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Analysis not found or unauthorized", "Delete analysis failed"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(null, "Analysis removed successfully"));

  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete analysis failed", error.message));
  }
};/**
 * Helper: Fetches and categorizes Essential vs Optional
 */
const fetchSkillsFromEsco = async (jobTitle) => {
  const searchUrl = `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(jobTitle)}&type=occupation&language=en`;
  const searchRes = await axios.get(searchUrl);
  const occupation = searchRes.data?._embedded?.results?.[0];

  if (!occupation) return { essential: [], optional: [] };

  const profileRes = await axios.get(occupation._links.self.href);
  const links = profileRes.data._links;

  const process = (list, importance) =>
    list?.map((s) => ({
      name: s.title,
      uri: s.uri,
      importance: importance,
    })) || [];

  const allEssential = [
    ...process(links.hasEssentialSkill, "Essential"),
    ...process(links.hasEssentialKnowledge, "Essential"),
  ];

  const allOptional = [
    ...process(links.hasOptionalSkill, "Optional"),
    ...process(links.hasOptionalKnowledge, "Optional"),
  ];

  return {
    essential: allEssential.slice(0, 10),
    optional: allOptional.slice(0, 10),
  };
};

/**
 * Helper: Fetches Description, AltLabels, and ReuseLevel
 */
const fetchSkillResourceDetails = async (uri) => {
  try {
    const resourceUrl = `https://ec.europa.eu/esco/api/resource/skill?uri=${encodeURIComponent(uri)}&language=en`;
    const res = await axios.get(resourceUrl);
    const data = res.data;

    return {
      description: data.description?.en?.literal || "No description available.",
      altLabels: data.alternativeLabel?.en || [],
      reuseLevel: data.reuseLevel || "sector-specific"
    };
  } catch (error) {
    return { description: "Details unavailable.", altLabels: [], reuseLevel: "unknown" };
  }
};