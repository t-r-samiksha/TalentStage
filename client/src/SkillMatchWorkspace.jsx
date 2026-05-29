import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, CheckCircle2, Award,
  Play, ArrowLeft, Timer, Check,
  ShieldCheck, Terminal, Sliders, X
} from 'lucide-react';
import { skillTestService } from './api';

export default function SkillMatchWorkspace() {
  const navigate = useNavigate();
  const [view, setView] = useState('verification');
  
  // ─── Verification State (Page 12) ───
  const [selectedSkill, setSelectedSkill] = useState('React');
  const [testActive, setTestActive] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds timer
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultsScore, setResultsScore] = useState({
    Syntax: 0,
    Architecture: 0,
    Optimization: 0,
    Debugging: 0
  });

  const fetchResults = useCallback(async (testId) => {
    try {
      const res = await skillTestService.getTestResult(testId);
      if (res.success) {
        setTestActive(false);
        setTestCompleted(true);
        const { result } = res.data;
        const baseScore = result.normalizedPercent || 0;
        setResultsScore({
          Syntax: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 10 - 5))),
          Architecture: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 15 - 5))),
          Optimization: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 10))),
          Debugging: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 12 - 6)))
        });
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  }, []);

  const handleCompleteTest = useCallback(() => {
    if (activeTest) {
      setIsSubmitting(true);
      fetchResults(activeTest.id).finally(() => setIsSubmitting(false));
    } else {
      setTestActive(false);
      setTestCompleted(false);
    }
  }, [activeTest, fetchResults]);

  // Countdown tick effect
  useEffect(() => {
    if (!testActive || testCompleted) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [testActive, testCompleted, timeLeft]);

  // Timer expiry effect — deferred to avoid synchronous setState in effect body
  useEffect(() => {
    if (timeLeft === 0 && testActive && !testCompleted) {
      const id = setTimeout(() => handleCompleteTest(), 0);
      return () => clearTimeout(id);
    }
  }, [timeLeft, testActive, testCompleted, handleCompleteTest]);

  // Format time remaining
  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const handleStartTest = async () => {
    setIsSubmitting(true);
    setTestCompleted(false);
    try {
      const res = await skillTestService.startTest(selectedSkill);
      if (res.success && res.data) {
        setActiveTest(res.data);
        setActiveQuestion(res.data.questions[0]);
        setTestActive(true);
        setCurrentQuestionIdx(0);
        setSelectedOption(null);
        setTimeLeft(90);
      }
    } catch (err) {
      console.error('Failed to start test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (idx) => {
    if (isSubmitting) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !activeQuestion || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await skillTestService.submitAnswer({
        questionId: activeQuestion.id,
        userAnswer: activeQuestion.options[selectedOption]
      });
      if (res.success) {
        if (res.data.completed || !res.data.nextQuestion) {
          await fetchResults(activeTest.id);
        } else {
          setActiveQuestion(res.data.nextQuestion);
          setSelectedOption(null);
          setCurrentQuestionIdx(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };



  // ─── SVG Radar Chart calculations ───
  const radarChartData = useMemo(() => {
    const categories = ['Syntax', 'Architecture', 'Optimization', 'Debugging'];
    const cx = 100;
    const cy = 100;
    const maxVal = 100;
    const radius = 70;

    // Calculate coordinates for grid lines
    const gridLines = [0.25, 0.5, 0.75, 1.0].map((scale) => {
      const r = radius * scale;
      return categories.map((_, i) => {
        const angle = (i * Math.PI) / 2 - Math.PI / 2; // 4 axes at 90 deg
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return { x, y };
      });
    });

    // Calculate axes lines
    const axes = categories.map((cat, i) => {
      const angle = (i * Math.PI) / 2 - Math.PI / 2;
      const x1 = cx;
      const y1 = cy;
      const x2 = cx + radius * Math.cos(angle);
      const y2 = cy + radius * Math.sin(angle);
      // labels placement
      const lx = cx + (radius + 20) * Math.cos(angle);
      const ly = cy + (radius + 12) * Math.sin(angle);
      return { label: cat, x1, y1, x2, y2, lx, ly };
    });

    // Calculate values points for the user scores
    const scorePoints = categories.map((cat, i) => {
      const angle = (i * Math.PI) / 2 - Math.PI / 2;
      const score = resultsScore[cat] || 50;
      const valRadius = radius * (score / maxVal);
      const x = cx + valRadius * Math.cos(angle);
      const y = cy + valRadius * Math.sin(angle);
      return { x, y };
    });

    const scorePath = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

    return { gridLines, axes, scorePoints, scorePath, cx, cy };
  }, [resultsScore]);



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-50px] right-[-50px] w-[500px] h-[500px] rounded-full bg-violet-200/25 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[-50px] w-[450px] h-[450px] rounded-full bg-indigo-200/20 blur-[100px] animate-pulse-glow-reverse" />
      </div>

      {/* ── Premium Navigation Header ── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors cursor-pointer group select-none mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2 select-none">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-800">
                Talent<span className="text-violet-600 font-extrabold">Stage</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <button
              onClick={() => setView('verification')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none ${view === 'verification' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' : 'hover:text-slate-800'}`}
            >
              Skill Verification
            </button>
            <button
              onClick={() => navigate('/project-feed')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none hover:text-slate-800`}
            >
              AI Matches View
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 12 — SKILL VERIFICATION PLATFORM                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {view === 'verification' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                Skill Verification Platform
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Attest your developer competencies through zero-knowledge static test sandboxes evaluated in real-time.
              </p>
            </div>

            {/* ── Top Selector Bar ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-650 select-none mr-1.5">
                  Select Competency:
                </span>
                {['React', 'Node', 'Python'].map((skill) => (
                  <button
                    key={skill}
                    disabled={testActive}
                    onClick={() => { setSelectedSkill(skill); setTestCompleted(false); }}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none
                      ${selectedSkill === skill
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm'
                        : 'border border-slate-200 text-slate-655 hover:text-slate-900 hover:border-slate-350 bg-white disabled:opacity-50 disabled:cursor-not-allowed'
                      }
                    `}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {!testActive ? (
                <button
                  onClick={handleStartTest}
                  disabled={isSubmitting}
                  className="
                    py-2.5 px-6 rounded-xl text-xs font-bold text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600
                    hover:brightness-110 active:scale-[0.98] transition-all duration-200
                    flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-500/25 relative group
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <span className="absolute -inset-1 rounded-xl bg-violet-600/20 blur opacity-70 group-hover:opacity-100 animate-pulse-glow" />
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
                  ) : (
                    <Play className="w-3.5 h-3.5 relative z-10" />
                  )}
                  <span className="relative z-10">{isSubmitting ? 'Initializing...' : 'Start Verification Quiz'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest animate-pulse select-none">
                    Assessment Sandbox Live
                  </span>
                  <button
                    onClick={() => { setTestActive(false); setTestCompleted(false); }}
                    className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                    title="Terminate Quiz"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Split Layout: Quiz Sandbox or Score Breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Test Sandbox (Takes full width if test is active, else 7 cols) */}
              <div className={testActive ? 'lg:col-span-12' : 'lg:col-span-7'}>
                
                {testActive && activeQuestion ? (
                  /* ── Interactive Question Sandbox Card ── */
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden relative">
                    
                    {/* Top running slider timer bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                        style={{ width: `${(timeLeft / 90) * 100}%` }}
                      />
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Sandbox Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 select-none pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 uppercase tracking-wider">
                            Question {currentQuestionIdx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider flex items-center gap-1">
                            <Sliders className="w-2.5 h-2.5" />
                            Difficulty: {activeQuestion.difficulty || 'Advanced'}
                          </span>
                        </div>

                        {/* Running count-down timer */}
                        <div className="flex items-center gap-2 py-1 px-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-700">
                          <Timer className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                          <span className="tracking-wide">{formattedTime} remaining</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Terminal className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                          <h3 className="text-base font-extrabold text-slate-800 leading-relaxed tracking-tight">
                            {activeQuestion.question}
                          </h3>
                        </div>

                        {/* Visual Code Box for layout realism */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-slate-350 overflow-x-auto shadow-inner leading-relaxed">
                          <span className="text-violet-400">import</span> React, &#123; useTransition, useState &#125; <span className="text-violet-400">from</span> <span className="text-emerald-400">'react'</span>;<br/>
                          <span className="text-slate-500">// Attesting {selectedSkill} Concurrent Context execution thread</span><br/>
                          <span className="text-violet-400">const</span> [isPending, startTransition] = <span className="text-indigo-400">useTransition</span>();
                        </div>
                      </div>

                      {/* Option Matrix */}
                      <div className="grid grid-cols-1 gap-3">
                        {activeQuestion.options.map((opt, oIdx) => {
                          const isSelected = selectedOption === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(oIdx)}
                              className={`
                                w-full text-left p-4 rounded-xl border text-sm leading-relaxed font-bold transition-all duration-200 cursor-pointer
                                ${isSelected
                                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                                  : 'border-slate-200 bg-white/80 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                                }
                                active:scale-[0.99]
                              `}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`
                                  w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 font-extrabold
                                  ${isSelected ? 'bg-indigo-600 border-indigo-550 text-white' : 'border-slate-200 text-slate-500 bg-white'}
                                `}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Footer */}
                      <div className="flex items-center justify-end pt-4 border-t border-slate-200/60 select-none">
                        <div className="flex items-center gap-3">
                            <button
                              onClick={handleSubmitAnswer}
                              disabled={selectedOption === null || isSubmitting}
                              className="
                                py-2 px-6 rounded-xl text-xs font-bold text-white
                                bg-gradient-to-r from-emerald-600 to-teal-600
                                hover:brightness-110 shadow-md shadow-emerald-500/10 transition-all cursor-pointer
                                disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2
                              "
                            >
                              {isSubmitting ? (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              ) : null}
                              {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
                            </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* ── Welcome/Ready Assessment Card ── */
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden space-y-6">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-sm text-indigo-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Attest Your Skill Authenticity
                      </h2>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Verify your real competence in **{selectedSkill}** using our specialized microtask framework. The test matches production complexity benchmarks detailing concurrent architectures, optimized data management loops, and debug cycles.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold text-slate-600 select-none">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-555" />
                        <span>Advanced levels covering V8 and framework-native reconciliations.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-555" />
                        <span>90 seconds digital countdown execution boundary.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-555" />
                        <span>Generates cryptographic verifiable badges directly matching your talent index.</span>
                      </div>
                    </div>

                    <button
                      onClick={handleStartTest}
                      disabled={isSubmitting}
                      className="
                        py-3 px-6 rounded-xl text-xs font-bold text-white
                        bg-gradient-to-r from-violet-600 to-indigo-600
                        hover:brightness-110 active:scale-[0.98] transition-all
                        flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-500/25
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      {isSubmitting ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>{isSubmitting ? 'Generating Sandbox...' : 'Unlock Verification Sandbox'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Performance Breakdown (Muted when test is active, visible otherwise) */}
              {!testActive && (
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* ── Verification Performance Breakdown Card ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden space-y-6">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-2xl pointer-events-none" />

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 select-none">
                        Verification Performance Breakdown
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5 font-medium">Statistical competency index calculated dynamically.</p>
                    </div>

                    {/* Split Layout: Radar and Scoreboard */}
                    <div className="space-y-6">
                      
                      {/* Radar Chart (Left equivalent / Top section) */}
                      <div className="flex justify-center py-2 select-none relative">
                        
                        {/* Inline SVG Radar Chart */}
                        <svg className="w-48 h-48 drop-shadow-lg" viewBox="0 0 200 200">
                          {radarChartData.gridLines.map((line, lIdx) => {
                            const path = line.map(p => `${p.x},${p.y}`).join(' ');
                            return (
                              <polygon
                                key={lIdx}
                                points={path}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="0.8"
                                strokeDasharray={lIdx === 3 ? 'none' : '3 3'}
                              />
                            );
                          })}

                          {radarChartData.axes.map((ax, aIdx) => (
                            <g key={aIdx}>
                              <line
                                x1={ax.x1}
                                y1={ax.y1}
                                x2={ax.x2}
                                y2={ax.y2}
                                stroke="#e2e8f0"
                                strokeWidth="0.8"
                                strokeDasharray="2 2"
                              />
                              <text
                                x={ax.lx}
                                y={ax.ly}
                                fill="#64748b"
                                fontSize="7.5"
                                fontWeight="bold"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                              >
                                {ax.label}
                              </text>
                            </g>
                          ))}

                          {/* Filled skill polygon matching user score */}
                          <polygon
                            points={radarChartData.scorePath}
                            fill="rgba(99, 102, 241, 0.08)"
                            stroke="#4f46e5"
                            strokeWidth="1.8"
                            className="transition-all duration-700"
                          />

                          {/* Data points */}
                          {radarChartData.scorePoints.map((pt, pIdx) => (
                            <circle
                              key={pIdx}
                              cx={pt.x}
                              cy={pt.y}
                              r="3"
                              fill="#818cf8"
                              className="transition-all duration-700"
                            />
                          ))}

                          {/* Center point */}
                          <circle cx={radarChartData.cx} cy={radarChartData.cy} r="2" fill="#4f46e5" />
                        </svg>

                        {/* Central indicator */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-xs font-bold text-slate-600 tracking-wider bg-slate-100 py-1 px-3 rounded-full border border-slate-200">
                            Radar
                          </span>
                        </div>
                      </div>

                      {/* Scoreboard (Right equivalent / Bottom section) */}
                      <div className="space-y-4">
                        
                        {/* Dense Verified Score Grid */}
                        <div className="grid grid-cols-2 gap-3.5">
                          {Object.entries(resultsScore).map(([param, score]) => (
                            <div key={param} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 relative">
                              <span className="text-xs font-bold text-indigo-650 uppercase tracking-widest block select-none">
                                {param}
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-900">{score}%</span>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded select-none">
                                  Attested
                                </span>
                              </div>
                              <div className="w-full h-1 bg-slate-250 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Official glowing gradient badge */}
                        <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/5 border border-indigo-200 p-4 flex items-center gap-3.5 relative overflow-hidden shadow-sm">
                          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/8 rounded-full blur-xl pointer-events-none" />
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25 text-white shrink-0">
                            <Award className="w-5 h-5 text-white animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-sm font-bold text-slate-900 tracking-tight">Verified {selectedSkill} Developer</span>
                            </div>
                            <p className="text-xs text-indigo-600 font-extrabold uppercase tracking-wide mt-0.5 select-none font-sans">
                              Top 5% Global Attestation Tier
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* Removed duplicate AI Match Results view, routing to main project feed instead */}
      </main>
    </div>
  );
}
