import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  Code,
  Layers,
  ArrowUpRight,
  GitBranch
} from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { username: username.trim() });
      setData(response.data);
      // Scroll to results after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please check the username.');
    }
    setLoading(false);
  };

  const COLORS = ['#00d4ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  // Chart data formatting
  const getLanguageData = () => {
    if (!data?.languageData) return [];
    return data.languageData.map(item => ({
      name: item.name,
      value: item.value,
    }));
  };

  // Prepare commit activity data (simulated from available data)
  const getCommitActivity = () => {
    if (!data) return [];

    const weeks = 12;
    const avgPerWeek = Math.max(
      1,
      Math.round((data.totalCommits || 0) / weeks)
    );

    const pattern = [0.5, 1.2, 0.8, 1.5, 0.9, 1.1];

    return Array.from({ length: weeks }, (_, i) => ({
      week: `W${i + 1}`,
      commits: Math.max(
        0,
        Math.round(avgPerWeek * pattern[i % pattern.length])
      ),
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#020812] flex flex-col">
      {/* Background Effects */}
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        {/* Base grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        {/* Blue glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] bg-cyan-500/10"
          style={{ top: '-20%', left: '10%' }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Purple glow */}
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full blur-[140px] bg-purple-600/10"
          style={{ top: '-10%', right: '5%' }}
          animate={{
            x: [0, -70, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Pink glow */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[130px] bg-pink-500/5"
          style={{ top: '20%', left: '45%' }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Moving light */}
        <motion.div
          className="absolute w-[2px] h-[180px] bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
          style={{ left: '20%', top: '-200px' }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute w-[2px] h-[140px] bg-gradient-to-b from-transparent via-purple-400/40 to-transparent"
          style={{ right: '25%', top: '-150px' }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
            delay: 3,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
            <Sparkles className="w-4 h-4 text-cosmic-blue" />
            <span className="text-xs font-medium text-cosmic-blue tracking-wider uppercase">GitHub Analytics</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none mb-5">
            <span className="text-gradient">GitChronicle</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto px-4">
            Unveil the story behind your commits with AI-powered GitHub analytics in a stunning dashboard
          </p>
        </motion.div>

        {/* Search / Workspace Area — like the image upscaler UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            glass
            rounded-3xl
            p-6 sm:p-8 md:p-10
            w-full
            max-w-4xl
            mx-auto
            glow-blue
          "
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-blue/20 to-cosmic-purple/20 flex items-center justify-center mb-4 border border-white/10">
              <Code className="w-8 h-8 text-cosmic-blue" />
            </div>
            <h2 className="text-2xl font-semibold">Analyze any GitHub profile</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter a username and launch the analysis</p>
          </div>

          <form
            onSubmit={handleAnalyze}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  search-input
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  text-white
                  placeholder:text-muted-foreground
                  focus:outline-none
                "
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="
                launch-button
                h-14
                px-7
                rounded-2xl
                bg-gradient-to-r
                from-cosmic-blue
                to-cosmic-purple
                text-white
                font-semibold
                shadow-lg
                shadow-cosmic-blue/20
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
                sm:min-w-[170px]
              "
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span> Scanning...
                </>
              ) : (
                <>
                  Launch Analysis <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Results Section — Bento Grid */}
        {hasSearched && (
          <div ref={resultsRef} className="mt-16">
            {!data && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">Enter a username above to see the results</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-cosmic-blue/20 border-t-cosmic-blue rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground mt-4">Fetching data from the GitHub galaxy...</p>
              </motion.div>
            )}

            {data && (
              <motion.div
                key={username}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Stats Row — 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'Repositories', value: data.totalRepos, icon: Layers, color: 'text-cosmic-blue' },
                    { label: 'Total Commits', value: data.totalCommits, icon: GitBranch, color: 'text-cosmic-purple' },
                    { label: 'Primary Language', value: data.topLanguage || 'N/A', icon: Code, color: 'text-pink-500' },
                    { label: 'Avg Commits/Day', value: data.avgCommitsPerDay || '0', icon: Clock, color: 'text-amber-400' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="
                        glass
                        rounded-2xl
                        p-5
                        sm:p-6
                        stat-card-hover
                      "
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                          <stat.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.12em] font-semibold leading-tight">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate">
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bento Grid — 2 columns on desktop, 1 on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  
                  {/* AI Narrative — spans 2 columns on desktop */}
                  <motion.div
                    variants={itemVariants}
                    className="
                      lg:col-span-2
                      glass
                      rounded-2xl
                      p-5
                      sm:p-6
                      min-h-[280px]
                    "
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-cosmic-blue" />
                      <h3 className="font-semibold text-white">📡 Mission Log</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {data.narrative || 'No narrative generated. Try again with a different username.'}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full glass-light">AI Generated</span>
                      <span>•</span>
                      <span>Based on {data.totalCommits} commits</span>
                    </div>
                  </motion.div>

                  {/* Language Pie Chart */}
                  <motion.div
                    variants={itemVariants}
                    className="
                      glass
                      rounded-2xl
                      p-5
                      sm:p-6
                      flex
                      flex-col
                    "
                  >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📊 Languages</span>
                    </h3>
                    {data.languageData?.length > 0 ? (
                      <div className="w-full min-w-0">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={getLanguageData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {getLanguageData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: 'rgba(2, 8, 18, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#e8edf5',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-8">No language data</p>
                    )}
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {getLanguageData().slice(0, 4).map((item, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full glass-light text-muted-foreground">
                          <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS[i % COLORS.length] }} />
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Row — Commit Activity Chart (spans full width) */}
                <motion.div
                  variants={itemVariants}
                  className="
                    glass
                    rounded-2xl
                    p-5
                    sm:p-6
                  "
                >
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cosmic-blue" />
                    <span>Commit Activity</span>
                    <span className="text-xs text-muted-foreground font-normal ml-2">(weekly estimate)</span>
                  </h3>
                  <div className="w-full min-w-0">
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={getCommitActivity()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="week" stroke="#6b7a8f" fontSize={11} />
                        <YAxis stroke="#6b7a8f" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(2, 8, 18, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#e8edf5',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="commits"
                          stroke="#00d4ff"
                          strokeWidth={2}
                          dot={{ fill: '#00d4ff', r: 4 }}
                          activeDot={{ r: 6, fill: '#7c3aed' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <motion.div
          variants={itemVariants}
          className="text-center py-8"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-gradient font-semibold">GitChronicle</span>
            <span className="mx-2 text-white/20">•</span>
            Your code journey, told through data. 🌌
          </p>
        </motion.div>
      </footer>

    </div>
  );
}

export default App;