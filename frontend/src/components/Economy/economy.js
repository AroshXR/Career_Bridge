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
import { useNavigate } from 'react-router-dom';
import './economy.css';

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
  const navigate = useNavigate();
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
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      const response = await axios.get(`http://localhost:5000/api/v1/economy/economyDetails/${countryCode}`, config);

      // Expected data structure: { country, year, latest: { economy, job_market }, trends: [] }
      setEconomyData(response.data.data);

    } catch (err) {
      const apiErrorMsg = err.response?.data?.error?.errorDescription || err.response?.data?.message;
      setError(apiErrorMsg ? `Failed to fetch: ${apiErrorMsg}` : 'Failed to fetch economy trends.');
      setEconomyData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatMetrics = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${Number(value).toFixed(2)}%`;
  };

  return (
    <div className="eco-hub_eco">
      <div className="eco-nav-bar_eco">
        <div className="eco-nav-inner_eco">
          <div className="eco-nav-brand_eco">
            <span className="eco-brand-glow_eco"></span>
            <h2 className="eco-brand-name_eco">Economy Hub</h2>
          </div>

          <form onSubmit={fetchEconomyData} className="eco-nav-form_eco">
            <div className="eco-select-wrapper_eco">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="eco-nav-select_eco"
              >
                <option value="" disabled>Choose Country</option>
                {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <span className="eco-select-arrow_eco"></span>
            </div>
            <button type="submit" disabled={loading || !countryCode} className="eco-nav-btn_eco">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          <button className="eco-back-btn_eco" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="eco-main-stage_eco">
        {error && <div className="eco-toast-error_eco">{error}</div>}

        {loading && (
          <div className="eco-hero-loader_eco">
            <div className="eco-orb-container_eco">
              <div className="eco-orb_eco"></div>
              <div className="eco-orb-inner_eco"></div>
            </div>
            <p className="eco-loading-msg_eco">Syncing Historical Trends...</p>
          </div>
        )}

        {!loading && !economyData && !error && (
          <div className="eco-welcome-stage_eco">
            <div className="eco-welcome-card_eco">
              <h1>Select a datastream to begin.</h1>
              <p>Analyzing the last 10 years of economic transformation, powered by The World Bank.</p>
            </div>
          </div>
        )}

        {economyData && (
          <div className={`eco-view-container_eco ${loading ? 'eco-fade-out_eco' : 'eco-fade-in_eco'}`}>
            <div className="eco-summary-header_eco">
              <h1 className="eco-stage-title_eco">
                {economyData.country} <span className="eco-stage-year_eco">[{economyData.year}]</span>
              </h1>
            </div>

            {/* Multi-Line Historical Trend Chart */}
            <div className="eco-chart-stage_eco">
              <div className="eco-chart-glass_eco">
                <h3 className="eco-chart-header_eco">Historical Evolution [Trend Lines]</h3>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={economyData.trends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      stroke="#64748b"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
                      }}
                      itemStyle={{ fontSize: '13px' }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '30px' }}
                    />
                    <Line
                      name="GDP Growth"
                      type="monotone"
                      dataKey="gdp_growth"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                    <Line
                      name="Unemployment"
                      type="monotone"
                      dataKey="unemployment"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#f43f5e', strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                    <Line
                      name="Labor Force"
                      type="monotone"
                      dataKey="labor_force"
                      stroke="#00f2fe"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#00f2fe', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#00f2fe', strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                    <Line
                      name="Employment Ratio"
                      type="monotone"
                      dataKey="employment_ratio"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Snapshot Grid */}
            <div className="eco-insight-grid_eco">
              <div className="eco-insight-card_eco">
                <span className="eco-insight-icon_eco eco-icon-green_eco">📈</span>
                <div className="eco-insight-info_eco">
                  <p className="eco-insight-label_eco">GDP Growth</p>
                  <h3 className="eco-insight-value_eco">{formatMetrics(economyData.latest.economy?.gdp_growth)}</h3>
                </div>
              </div>
              <div className="eco-insight-card_eco">
                <span className="eco-insight-icon_eco eco-icon-red_eco">📉</span>
                <div className="eco-insight-info_eco">
                  <p className="eco-insight-label_eco">Unemployment</p>
                  <h3 className="eco-insight-value_eco">{formatMetrics(economyData.latest.job_market?.unemployment)}</h3>
                </div>
              </div>
              <div className="eco-insight-card_eco">
                <span className="eco-insight-icon_eco eco-icon-cyan_eco">👥</span>
                <div className="eco-insight-info_eco">
                  <p className="eco-insight-label_eco">Labor Force</p>
                  <h3 className="eco-insight-value_eco">{formatMetrics(economyData.latest.job_market?.labor_force)}</h3>
                </div>
              </div>
              <div className="eco-insight-card_eco">
                <span className="eco-insight-icon_eco eco-icon-purple_eco">💼</span>
                <div className="eco-insight-info_eco">
                  <p className="eco-insight-label_eco">Employment Ratio</p>
                  <h3 className="eco-insight-value_eco">{formatMetrics(economyData.latest.job_market?.employment_ratio)}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Economy;