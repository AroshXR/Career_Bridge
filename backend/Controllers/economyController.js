import axios from "axios";
import ResponseGenerator from "../utils/ResponseGenerator.js";

export const showEconomyDetails = async (req, res) => {
  try {
    const { countryCode } = req.params;

    // Indicators
    const indicators = {
      gdp_growth: "NY.GDP.MKTP.KD.ZG",
      unemployment: "SL.UEM.TOTL.ZS",
      labor_force: "SL.TLF.CACT.ZS",
      employment_ratio: "SL.EMP.TOTL.SP.ZS"
    };

    // Fetch last 10 years for all indicators in parallel
    const requests = Object.entries(indicators).map(
      async ([key, indicatorCode]) => {
        // Request 10 years of data
        const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=10`;

        const response = await axios.get(url);
        const data = response.data[1];

        if (!data || !Array.isArray(data)) {
          return { key, history: [] };
        }

        return {
          key,
          history: data.map(item => ({
            value: item.value,
            year: item.date
          }))
        };
      }
    );

    const results = await Promise.all(requests);

    // Build structured time-series response
    // Map year -> { year, gdp, unemp, labor, emp }
    const timelineMap = {};

    results.forEach(result => {
      result.history.forEach(point => {
        if (!timelineMap[point.year]) {
          timelineMap[point.year] = { year: point.year };
        }
        timelineMap[point.year][result.key] = point.value;
      });
    });

    // Convert map to sorted array (Chronological: oldest first for chart)
    const trends = Object.values(timelineMap)
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .filter(entry => entry.gdp_growth !== undefined || entry.unemployment !== undefined); // Ensure we have data

    if (trends.length === 0) {
      return res.status(404).json(
        ResponseGenerator.sendError(
          ResponseGenerator.NOT_FOUND,
          "Can't find Economy Trends for specified Country",
          "Failed Find Economy Data"
        )
      );
    }

    // Still include the "latest" summary for the cards
    const latestEntry = [...trends].reverse().find(e => e.gdp_growth != null || e.unemployment != null);

    return res.json(
      ResponseGenerator.sendSuccess({
        country: countryCode,
        year: latestEntry.year,
        latest: {
          economy: { gdp_growth: latestEntry.gdp_growth },
          job_market: {
            unemployment: latestEntry.unemployment,
            labor_force: latestEntry.labor_force,
            employment_ratio: latestEntry.employment_ratio
          }
        },
        trends: trends // Full history for the graph
      })
    );

  } catch (error) {
    console.log(error, "Error Occur while getting Economy details");

    return res.status(500).json(
      ResponseGenerator.sendError(
        ResponseGenerator.INTERNAL_SERVER_ERROR,
        "Error fetching economy data",
        error.message
      )
    );
  }
};