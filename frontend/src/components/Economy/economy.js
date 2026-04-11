import React, { useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './economy.css';
import API_BASE_URL from '../../apiConfig';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IN', name: 'India' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' }
];

const Economy = () => {
  const [countryCode, setCountryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [economyData, setEconomyData] = useState(null);
  const [error, setError] = useState('');

  const fetchEconomyData = async (e) => {
    e.preventDefault();
    if (!countryCode) return;
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/economy/economyDetails/${countryCode}`,
        config
      );
      setEconomyData(response.data.data);
    } catch (err) {
      const apiErrorMsg = err.response?.data?.error?.errorDescription || err.response?.data?.message;
      setError(apiErrorMsg ? `Failed to fetch: ${apiErrorMsg}` : 'Failed to fetch economy trends.');
      setEconomyData(null);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${Number(value).toFixed(2)}%`;
  };

  const metrics = economyData ? [
    {
      label: 'GDP Growth',
      value: fmt(economyData.latest.economy?.gdp_growth),
      icon: 'trending_up',
      color: 'green_eco'
    },
    {
      label: 'Unemployment',
      value: fmt(economyData.latest.job_market?.unemployment),
      icon: 'trending_down',
      color: 'red_eco'
    },
    {
      label: 'Labor Force',
      value: fmt(economyData.latest.job_market?.labor_force),
      icon: 'groups',
      color: 'cyan_eco'
    },
    {
      label: 'Employment Ratio',
      value: fmt(economyData.latest.job_market?.employment_ratio),
      icon: 'work',
      color: 'purple_eco'
    }
  ] : [];

  return (
    <div className="page-wrapper_eco">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="hero_eco">
        <div className="hero-text_eco">
          <span className="hero-eyebrow_eco">World Bank Data</span>
          <h1>Country<br /><strong>Economy</strong> Insights</h1>
          <p>
            Explore 10 years of economic transformation — GDP growth, unemployment,
            labour force trends and more, powered by live World Bank data.
          </p>
        </div>

        {/* Country Selector + Analyze */}
        <form className="hero-controls_eco" onSubmit={fetchEconomyData}>
          <div className="select-wrap_eco">
            <select
              id="country-select_eco"
              className="country-select_eco"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="" disabled>Choose a Country</option>
              {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <span className="material-icons-round select-icon_eco">expand_more</span>
          </div>
          <button
            type="submit"
            id="analyze-btn_eco"
            className="analyze-btn_eco"
            disabled={loading || !countryCode}
          >
            <span className="material-icons-round">
              {loading ? 'hourglass_top' : 'bar_chart'}
            </span>
            {loading ? 'Analyzing...' : 'Analyze Country'}
          </button>
        </form>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content_eco">

        {/* Error */}
        {error && (
          <div className="error-bar_eco">
            <span className="material-icons-round">error_outline</span>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-area_eco">
            <div className="orb-wrap_eco">
              <div className="orb-ring_eco"></div>
              <div className="orb-ring_eco"></div>
              <div className="orb-glow_eco"></div>
            </div>
            <span className="loading-text_eco">Syncing Historical Trends...</span>
          </div>
        )}

        {/* Welcome state */}
        {!loading && !economyData && !error && (
          <div className="welcome-state_eco">
            <span className="material-icons-round welcome-icon_eco">public</span>
            <h2>Select a Country to Begin</h2>
            <p>
              Analysing the last 10 years of economic transformation,
              powered by The World Bank API.
            </p>
          </div>
        )}

        {/* Data View */}
        {economyData && !loading && (
          <div className="data-view_eco">

            {/* Country heading */}
            <div className="data-heading_eco">
              <h2 className="country-name_eco">{economyData.country}</h2>
              <span className="year-badge_eco">
                <span className="material-icons-round">calendar_today</span>
                {economyData.year}
              </span>
            </div>

            {/* Metric cards */}
            <span className="section-label_eco">Latest Snapshot</span>
            <div className="metric-cards_eco">
              {metrics.map((m, i) => (
                <div key={i} className={`metric-card_eco ${m.color}`}>
                  <div className="metric-icon_eco">
                    <span className="material-icons-round">{m.icon}</span>
                  </div>
                  <div className="metric-info_eco">
                    <p className="metric-label_eco">{m.label}</p>
                    <h3 className="metric-value_eco">{m.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="chart-panel_eco">
              <span className="section-label_eco">Historical Trend Lines</span>
              <div className="chart-glass_eco">
                <div className="chart-header_eco">
                  <span className="material-icons-round">show_chart</span>
                  <h3 className="chart-title_eco">10-Year Economic Evolution</h3>
                </div>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart
                    data={economyData.trends}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="year"
                      stroke="#334155"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Outfit' }}
                    />
                    <YAxis
                      stroke="#334155"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Outfit' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.96)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                        fontFamily: 'Outfit'
                      }}
                      itemStyle={{ fontSize: '13px' }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '24px', fontFamily: 'Outfit' }}
                    />
                    <Line
                      name="GDP Growth"
                      type="monotone"
                      dataKey="gdp_growth"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: '#10b981', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#10b981' }}
                      animationDuration={1400}
                    />
                    <Line
                      name="Unemployment"
                      type="monotone"
                      dataKey="unemployment"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: '#f43f5e', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#f43f5e' }}
                      animationDuration={1400}
                    />
                    <Line
                      name="Labor Force"
                      type="monotone"
                      dataKey="labor_force"
                      stroke="#00f2fe"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: '#00f2fe', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#00f2fe' }}
                      animationDuration={1400}
                    />
                    <Line
                      name="Employment Ratio"
                      type="monotone"
                      dataKey="employment_ratio"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: '#8b5cf6', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#8b5cf6' }}
                      animationDuration={1400}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Economy;