import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { username });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  const COLORS = ['#00f2fe', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

  return (
    <div className="app">
      <div className="stars-bg"></div> {/* Cosmic background effect */}
      
      <header>
        <h1>🌌 GitChronicle</h1>
        <p>Unveil the story behind the commits</p>
      </header>

      <form onSubmit={handleAnalyze} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scanning Galaxy...' : 'Launch Analysis'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {data && (
        <motion.div 
          className="dashboard"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid stats-grid">
            <div className="stat-card glass">
              <span>🚀 Repositories</span>
              <h2>{data.totalRepos}</h2>
            </div>
            <div className="stat-card glass">
              <span>📝 Commits</span>
              <h2>{data.totalCommits}</h2>
            </div>
            <div className="stat-card glass">
              <span>⭐ Primary Language</span>
              <h2>{data.topLanguage}</h2>
            </div>
            <div className="stat-card glass">
              <span>📅 Avg Commits/Day</span>
              <h2>{data.avgCommitsPerDay}</h2>
            </div>
          </div>

          <div className="narrative-box glass">
            <h3>📡 Mission Log</h3>
            <p>{data.narrative}</p>
          </div>

          <div className="chart-box glass">
            <h3>📊 Language Constellation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.languageData}>
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #00f2fe' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {data.languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;