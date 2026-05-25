import { useState, useEffect, useMemo } from 'react';
import {
  Cpu, Clock, Sparkles, CheckCircle2, Award, ArrowRight,
  MessageSquare, Zap, Star, Play, ArrowLeft, Timer, Check,
  ShieldCheck, Terminal, Sliders, X, Activity, RefreshCw, AlertCircle
} from 'lucide-react';

// ─── Technical Questions Database (Page 12) ──────────────────────────────
const QUESTIONS = {
  React: [
    {
      id: 'react-1',
      question: 'Which of the following describes how the event loop interacts with React 18\'s concurrent features when running under a useTransition hook?',
      options: [
        'React pauses the JavaScript execution thread and yields execution to the main thread event loop during the render phase, allowing paint events to occur.',
        'React schedules state updates as high-priority microtasks that bypass the event loop entirely to ensure instantaneous DOM reconciliation.',
        'React splits the tree-rendering work into chunked fiber segments, scheduling them via scheduler priorities that yield to the user input paint loop.',
        'React executes render phases synchronously inside a worker thread and transfers the serialized virtual DOM node structure using standard postMessage.'
      ],
      correctAnswer: 2,
      difficulty: 'Advanced',
      points: { Syntax: 85, Architecture: 92, Optimization: 95, Debugging: 80 }
    },
    {
      id: 'react-2',
      question: 'To prevent unnecessary re-renders of list items while ensuring compatibility with dynamic content resizing, what is the optimal design pattern?',
      options: [
        'Memoize components using React.memo with a deep comparative custom props comparator that serializes elements as JSON strings.',
        'Utilize useMemo to cache children arrays, key list elements by stable IDs, and apply absolute CSS layout containers for dynamic heights.',
        'Inject inline style nodes to manipulate element height properties directly, bypassing the React reconciliation engine entirely.',
        'Wrap individual elements in key-dependent custom ref nodes and manually trigger dynamic updates through document.getElementById.'
      ],
      correctAnswer: 1,
      difficulty: 'Advanced',
      points: { Syntax: 90, Architecture: 88, Optimization: 92, Debugging: 85 }
    }
  ],
  Node: [
    {
      id: 'node-1',
      question: 'In the Node.js event loop architecture, what is the precise difference between process.nextTick() and setImmediate()?',
      options: [
        'process.nextTick() schedules callbacks to execute immediately after the current phase finishes (before the event loop continues), whereas setImmediate() executes callbacks during the check phase of the loop.',
        'setImmediate() bypasses the V8 microtask queue entirely, while process.nextTick() registers tasks in the main macroscopic OS process scheduler thread.',
        'process.nextTick() executes in parallel thread pools, while setImmediate() blocks the main event loop until the execution stack returns 0.',
        'setImmediate() callbacks run in the poll phase before raw network sockets receive data packets, while process.nextTick() is limited to file system events.'
      ],
      correctAnswer: 0,
      difficulty: 'Advanced',
      points: { Syntax: 80, Architecture: 95, Optimization: 90, Debugging: 92 }
    },
    {
      id: 'node-2',
      question: 'When implementing a clustering model in Node.js, how do worker threads communicate and handle high-throughput IPC channels?',
      options: [
        'Through an in-memory shared ArrayBuffer mapped across virtual machines, utilizing manual semaphore blocks.',
        'Through internal JSON-serialized messaging pipelines handled by the cluster master module using Unix domain sockets.',
        'Through external TCP socket relay loops establishing HTTP handshakes on port 8000.',
        'Workers are strictly isolated and must write task payloads to local /tmp log structures for the master thread to monitor.'
      ],
      correctAnswer: 1,
      difficulty: 'Advanced',
      points: { Syntax: 88, Architecture: 90, Optimization: 85, Debugging: 90 }
    }
  ],
  Python: [
    {
      id: 'python-1',
      question: 'How does Python\'s Global Interpreter Lock (GIL) affect performance optimizations in multi-threaded CPU-bound workflows compared to I/O-bound workflows?',
      options: [
        'The GIL disables multi-threaded speedups for I/O-bound routines, while allowing full parallel execution on multi-core systems for CPU-bound routines.',
        'The GIL forces all file reads to execute on a single physical core, while memory tasks are distributed across available hyper-threads.',
        'The GIL prevents multiple native threads from executing Python bytecodes at once, rendering multi-threading useless for CPU-bound tasks, whereas I/O-bound tasks release the GIL during blocking calls.',
        'The GIL executes CPU-bound routines via separate native processes, bypassing the V8 virtual compiler stack completely.'
      ],
      correctAnswer: 2,
      difficulty: 'Advanced',
      points: { Syntax: 85, Architecture: 90, Optimization: 94, Debugging: 88 }
    },
    {
      id: 'python-2',
      question: 'What is the runtime execution sequence of tasks and microtasks inside an active asyncio event loop when utilizing gather()?',
      options: [
        'asyncio forces synchronous execution inside a thread pool, invoking callbacks on thread termination.',
        'asyncio yields execution control at await keywords, allowing the loop to dispatch other ready tasks concurrently through a non-blocking poll mechanism.',
        'Tasks are converted into generator objects that write data directly to system queues, bypassing execution frames.',
        'Tasks run sequentially in alphabetical order of their function names, ignoring sleep timers.'
      ],
      correctAnswer: 1,
      difficulty: 'Advanced',
      points: { Syntax: 90, Architecture: 92, Optimization: 88, Debugging: 82 }
    }
  ]
};

// ─── AI Engine Matches Database (Page 13) ──────────────────────────────
const MATCHED_CANDIDATES = [
  {
    id: 'candidate-1',
    name: 'Dr. Evelyn Vance',
    role: 'Principal Smart Contract Architect',
    initials: 'EV',
    rating: 5.0,
    confidence: 98.6,
    hourlyRate: 3400,
    matchReason: 'Exceptional structural overlap with ERC-4337 specification. Possesses 8 verified Solidity attestations, custom security audit portfolio records on Polygon zkEVM, and top 1% score in Smart Contract Optimization tests.',
    tags: ['Solidity', 'ERC-4337', 'Hardhat', 'Polygon zkEVM', 'Auditing'],
    gradient: 'from-violet-600/40 to-indigo-500/30',
    borderColor: 'border-violet-500/30'
  },
  {
    id: 'candidate-2',
    name: 'Elena Rostova',
    role: 'Senior Rust & Web3 Protocol Specialist',
    initials: 'ER',
    rating: 4.95,
    confidence: 96.4,
    hourlyRate: 2800,
    matchReason: 'Highly optimized match for cross-chain infrastructure. Scored 94% in systems engineering metrics. Strong experience in LayerZero architectures, zero-knowledge proofs, and secure Rust memory management frameworks.',
    tags: ['Rust', 'Solidity', 'LayerZero', 'Go', 'Chainlink'],
    gradient: 'from-indigo-600/40 to-violet-500/30',
    borderColor: 'border-indigo-500/30'
  },
  {
    id: 'candidate-3',
    name: 'Marcus Chen',
    role: 'Distributed Systems & ML Pipeline Lead',
    initials: 'MC',
    rating: 4.8,
    confidence: 91.2,
    hourlyRate: 2500,
    matchReason: 'Optimal profile for scalable pipeline execution. Expert in containerized FastAPI deployments, real-time message queuing (Celery/Redis), and high-throughput vector storage databases.',
    tags: ['Python', 'FastAPI', 'LangChain', 'Docker', 'Celery'],
    gradient: 'from-fuchsia-600/30 to-indigo-650/20',
    borderColor: 'border-fuchsia-500/30'
  }
];

export default function SkillMatchWorkspace({ onNavigate }) {
  const [view, setView] = useState('verification'); // 'verification' | 'match-results'
  
  // ─── Verification State (Page 12) ───
  const [selectedSkill, setSelectedSkill] = useState('React');
  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultsScore, setResultsScore] = useState({
    Syntax: 82,
    Architecture: 78,
    Optimization: 85,
    Debugging: 72
  });

  // ─── Match Matrix Action States ───
  const [hiredCandidate, setHiredCandidate] = useState(null);
  const [hiringLoader, setHiringLoader] = useState(null);
  const [messageCandidate, setMessageCandidate] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // ─── Question Navigation ───
  const activeQuestions = useMemo(() => QUESTIONS[selectedSkill] || [], [selectedSkill]);
  const activeQuestion = activeQuestions[currentQuestionIdx];

  // Digital countdown timer effect
  useEffect(() => {
    let timer;
    if (testActive && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive && !testCompleted) {
      handleCompleteTest();
    }
    return () => clearInterval(timer);
  }, [testActive, timeLeft, testCompleted]);

  // Format time remaining
  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const handleStartTest = () => {
    setTestActive(true);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setTimeLeft(90); // 90 seconds for advanced quiz
    setTestCompleted(false);
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: idx
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      const nextId = activeQuestions[currentQuestionIdx + 1].id;
      setSelectedOption(answers[nextId] !== undefined ? answers[nextId] : null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
      const prevId = activeQuestions[currentQuestionIdx - 1].id;
      setSelectedOption(answers[prevId] !== undefined ? answers[prevId] : null);
    }
  };

  const handleCompleteTest = () => {
    setTestActive(false);
    setTestCompleted(true);
    
    // Dynamically calculate score breakdown based on selected options vs correct options
    let correctCount = 0;
    let syntax = 0, arch = 0, opt = 0, dbg = 0;

    activeQuestions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctAnswer) {
        correctCount += 1;
        syntax += q.points.Syntax;
        arch += q.points.Architecture;
        opt += q.points.Optimization;
        dbg += q.points.Debugging;
      } else {
        // partial credit for attempt
        syntax += Math.floor(q.points.Syntax * 0.4);
        arch += Math.floor(q.points.Architecture * 0.3);
        opt += Math.floor(q.points.Optimization * 0.4);
        dbg += Math.floor(q.points.Debugging * 0.5);
      }
    });

    const totalQs = activeQuestions.length;
    const finalSyntax = Math.min(100, Math.floor(syntax / totalQs));
    const finalArch = Math.min(100, Math.floor(arch / totalQs));
    const finalOpt = Math.min(100, Math.floor(opt / totalQs));
    const finalDbg = Math.min(100, Math.floor(dbg / totalQs));

    setResultsScore({
      Syntax: finalSyntax,
      Architecture: finalArch,
      Optimization: finalOpt,
      Debugging: finalDbg
    });
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

  // ─── Actions for Candidates Match Table ───
  const handleHire = (candidate) => {
    setHiringLoader(candidate.id);
    setTimeout(() => {
      setHiringLoader(null);
      setHiredCandidate(candidate.id);
    }, 1500);
  };

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageCandidate(null);
      setMessageSent(false);
      setMessageText('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-50px] right-[-50px] w-[500px] h-[500px] rounded-full bg-violet-700/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[-50px] w-[450px] h-[450px] rounded-full bg-indigo-700/5 blur-[100px] animate-pulse-glow-reverse" />
      </div>

      {/* ── Premium Navigation Header ── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer group select-none mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2 select-none">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Talent<span className="text-violet-400 font-extrabold">Stage</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <button
              onClick={() => setView('verification')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none ${view === 'verification' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 shadow-sm' : 'hover:text-slate-200'}`}
            >
              Skill Verification
            </button>
            <button
              onClick={() => setView('match-results')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none ${view === 'match-results' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 shadow-sm' : 'hover:text-slate-200'}`}
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
              <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                Skill Verification Platform
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Attest your developer competencies through zero-knowledge static test sandboxes evaluated in real-time.
              </p>
            </div>

            {/* ── Top Selector Bar ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 select-none mr-1.5">
                  Select Competency:
                </span>
                {['React', 'Node', 'Python'].map((skill) => (
                  <button
                    key={skill}
                    disabled={testActive}
                    onClick={() => { setSelectedSkill(skill); setTestCompleted(false); }}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                      ${selectedSkill === skill
                        ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-500/5'
                        : 'border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  className="
                    py-2.5 px-6 rounded-xl text-xs font-bold text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600
                    hover:brightness-110 active:scale-[0.98] transition-all duration-200
                    flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-500/25 relative group
                  "
                >
                  <span className="absolute -inset-1 rounded-xl bg-violet-600/20 blur opacity-70 group-hover:opacity-100 animate-pulse-glow" />
                  <Play className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Start Verification Quiz</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse select-none">
                    Assessment Sandbox Live
                  </span>
                  <button
                    onClick={() => { setTestActive(false); setTestCompleted(false); }}
                    className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
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
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden relative">
                    
                    {/* Top running slider timer bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                        style={{ width: `${(timeLeft / 90) * 100}%` }}
                      />
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Sandbox Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 select-none pb-4 border-b border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-650/20 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                            Question {currentQuestionIdx + 1} of {activeQuestions.length}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Sliders className="w-2.5 h-2.5" />
                            Difficulty: Advanced
                          </span>
                        </div>

                        {/* Running count-down timer */}
                        <div className="flex items-center gap-2 py-1 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400">
                          <Timer className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                          <span className="font-mono tracking-wider">{formattedTime} remaining</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Terminal className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                          <h3 className="text-base font-extrabold text-white leading-relaxed tracking-tight">
                            {activeQuestion.question}
                          </h3>
                        </div>

                        {/* Visual Code Box for layout realism */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-[11px] text-slate-400 overflow-x-auto shadow-inner leading-relaxed">
                          <span className="text-violet-400">import</span> React, &#123; useTransition, useState &#125; <span className="text-violet-400">from</span> <span className="text-emerald-400">'react'</span>;<br/>
                          <span className="text-slate-600">// Attesting {selectedSkill} Concurrent Context execution thread</span><br/>
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
                                w-full text-left p-4 rounded-xl border text-xs leading-relaxed font-bold transition-all duration-200 cursor-pointer
                                ${isSelected
                                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-200 shadow-md shadow-indigo-500/5'
                                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/30'
                                }
                                active:scale-[0.99]
                              `}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`
                                  w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-extrabold
                                  ${isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-800 text-slate-500 bg-slate-950'}
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
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 select-none">
                        <button
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIdx === 0}
                          className="px-4 py-2 text-xs font-extrabold text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-3">
                          {currentQuestionIdx < activeQuestions.length - 1 ? (
                            <button
                              onClick={handleNextQuestion}
                              disabled={selectedOption === null}
                              className="
                                py-2 px-5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300
                                hover:bg-slate-800/50 hover:border-slate-600 hover:text-white transition-all cursor-pointer
                                disabled:opacity-40 disabled:cursor-not-allowed
                              "
                            >
                              Next Question
                            </button>
                          ) : (
                            <button
                              onClick={handleCompleteTest}
                              disabled={selectedOption === null}
                              className="
                                py-2.5 px-6 rounded-xl text-xs font-bold text-white
                                bg-gradient-to-r from-emerald-600 to-teal-600
                                hover:brightness-110 shadow-md shadow-emerald-500/10 transition-all cursor-pointer
                                disabled:opacity-40 disabled:cursor-not-allowed
                              "
                            >
                              Submit Assessment
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* ── Welcome/Ready Assessment Card ── */
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-xl shadow-lg relative overflow-hidden space-y-6">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-lg text-indigo-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-extrabold text-white tracking-tight">
                        Attest Your Skill Authenticity
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Verify your real competence in **{selectedSkill}** using our specialized microtask framework. The test matches production complexity benchmarks detailing concurrent architectures, optimized data management loops, and debug cycles.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2 text-xs font-semibold text-slate-500 select-none">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Advanced levels covering V8 and framework-native reconciliations.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>90 seconds digital countdown execution boundary.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Generates cryptographic verifiable badges directly matching your talent index.</span>
                      </div>
                    </div>

                    <button
                      onClick={handleStartTest}
                      className="
                        py-3 px-6 rounded-xl text-xs font-bold text-white
                        bg-gradient-to-r from-violet-600 to-indigo-600
                        hover:brightness-110 active:scale-[0.98] transition-all
                        flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-500/25
                      "
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Unlock Verification Sandbox</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Performance Breakdown (Muted when test is active, visible otherwise) */}
              {!testActive && (
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* ── Verification Performance Breakdown Card ── */}
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden space-y-6">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-2xl pointer-events-none" />

                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 select-none">
                        Verification Performance Breakdown
                      </h3>
                      <p className="text-[10px] text-slate-600 mt-0.5">Statistical competency index calculated dynamically.</p>
                    </div>

                    {/* Split Layout: Radar and Scoreboard */}
                    <div className="space-y-6">
                      
                      {/* Radar Chart (Left equivalent / Top section) */}
                      <div className="flex justify-center py-2 select-none relative">
                        
                        {/* Inline SVG Radar Chart */}
                        <svg className="w-48 h-48 drop-shadow-lg" viewBox="0 0 200 200">
                          {/* Inner grid concentric diamonds */}
                          {radarChartData.gridLines.map((line, lIdx) => {
                            const path = line.map(p => `${p.x},${p.y}`).join(' ');
                            return (
                              <polygon
                                key={lIdx}
                                points={path}
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth="0.8"
                                strokeDasharray={lIdx === 3 ? 'none' : '3 3'}
                              />
                            );
                          })}

                          {/* Radar axes lines */}
                          {radarChartData.axes.map((ax, aIdx) => (
                            <g key={aIdx}>
                              <line
                                x1={ax.x1}
                                y1={ax.y1}
                                x2={ax.x2}
                                y2={ax.y2}
                                stroke="#1e293b"
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
                            fill="rgba(99, 102, 241, 0.15)"
                            stroke="#6366f1"
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
                          <span className="text-[10px] font-black text-white/40 font-mono tracking-widest bg-slate-950/60 py-0.5 px-2.5 rounded-full border border-slate-900">
                            Radar
                          </span>
                        </div>
                      </div>

                      {/* Scoreboard (Right equivalent / Bottom section) */}
                      <div className="space-y-4">
                        
                        {/* Dense Verified Score Grid */}
                        <div className="grid grid-cols-2 gap-3.5">
                          {Object.entries(resultsScore).map(([param, score]) => (
                            <div key={param} className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 space-y-1 relative">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block select-none">
                                {param}
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-white">{score}%</span>
                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-1 py-0.2 rounded select-none">
                                  Attested
                                </span>
                              </div>
                              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Official glowing gradient badge */}
                        <div className="rounded-2xl bg-gradient-to-r from-violet-650/15 via-indigo-650/15 to-violet-650/10 border border-indigo-500/25 p-4 flex items-center gap-3.5 relative overflow-hidden shadow-lg shadow-indigo-950/20">
                          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/8 rounded-full blur-xl pointer-events-none" />
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25 text-white shrink-0">
                            <Award className="w-5 h-5 text-white animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-black text-white tracking-tight">Verified {selectedSkill} Developer</span>
                            </div>
                            <p className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-wide mt-0.5 select-none">
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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 13 — AI MATCH RESULT PERFORMANCE VIEW                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {view === 'match-results' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                  AI Match Results Performance
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Live optimization vector comparisons ranking optimal freelancers according to semantic scope overlays.
                </p>
              </div>
              <div className="flex items-center gap-2 py-1 px-3.5 rounded-full bg-indigo-950/20 border border-indigo-500/20 text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest animate-pulse select-none">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Reranking Optimization</span>
              </div>
            </div>

            {/* ── High-Tech Telemetry Banner ── */}
            <div className="bg-slate-950 border border-indigo-500/20 rounded-2xl p-5 text-xs font-mono relative overflow-hidden space-y-4 shadow-xl select-none">
              {/* Corner tech indicators */}
              <div className="absolute top-3 right-4 text-[9px] text-slate-700 font-bold tracking-widest uppercase">
                SYSTEM TELEMETRY ENGINE v4.12
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-extrabold tracking-tight">INDEX PIPELINE SYNC SUCCESSFUL</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">Query Embedding Size: 1536 (Ada-002)</span>
              </div>

              {/* Latency ribbon grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900/60 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vector Search</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-indigo-400">Embedding Grid Matrix</span>
                    <span className="text-white font-extrabold text-xs">15ms</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full w-[25%] bg-indigo-500" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900/60 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cross-Encoder AI</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-violet-400">Rerank Pipeline</span>
                    <span className="text-white font-extrabold text-xs">870ms</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-violet-500 animate-pulse" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900/60 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">L2 Cosine Similarity</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-emerald-400">Confidence Threshold</span>
                    <span className="text-white font-extrabold text-xs">0.894 min</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Candidate Match Card Matrix ── */}
            <div className="space-y-4">
              {MATCHED_CANDIDATES.map((candidate) => {
                const isHired = hiredCandidate === candidate.id;
                const isLoading = hiringLoader === candidate.id;
                return (
                  <div
                    key={candidate.id}
                    className={`
                      relative overflow-hidden rounded-2xl border bg-slate-900/40 backdrop-blur-xl p-6 transition-all duration-300 group
                      ${isHired ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 hover:border-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/5'}
                    `}
                  >
                    {/* Top ambient sheen */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.012] to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left Column: Micro-profile section */}
                      <div className="lg:col-span-3 flex items-center gap-4 border-r-none lg:border-r border-slate-800/80 pr-2 select-none">
                        {/* Avatar container */}
                        <div className={`w-12 h-12 rounded-2xl border ${candidate.borderColor} overflow-hidden bg-slate-950 shrink-0`}>
                          <div className={`w-full h-full bg-gradient-to-tr ${candidate.gradient} flex items-center justify-center text-sm font-black text-white`}>
                            {candidate.initials}
                          </div>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h4 className="text-sm font-black text-white tracking-tight leading-none truncate">
                            {candidate.name}
                          </h4>
                          <p className="text-[10.5px] text-slate-500 leading-none truncate">{candidate.role}</p>
                          
                          {/* Star Rating & AI Confidence Badge */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-wide">
                              {candidate.confidence}% Match
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Center Column: Skill breakdown, rate, reason */}
                      <div className="lg:col-span-6 space-y-3.5">
                        
                        {/* Tags list */}
                        <div className="flex flex-wrap items-center gap-2 select-none">
                          {candidate.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-[10px] font-black text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-2.5 py-0.5 rounded-full">
                            ₹{candidate.hourlyRate.toLocaleString('en-IN')} / Hr
                          </span>
                        </div>

                        {/* Explicit Reasoning Description */}
                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                          {candidate.matchReason}
                        </p>
                      </div>

                      {/* Right Column: Action matrix */}
                      <div className="lg:col-span-3 flex lg:flex-col gap-3 shrink-0 lg:pl-4">
                        
                        {isHired ? (
                          <div className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5 select-none">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Escrow Assigned</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleHire(candidate)}
                            disabled={isLoading}
                            className="
                              flex-1 lg:flex-none py-2.5 px-5 rounded-xl text-xs font-bold text-white
                              bg-gradient-to-r from-violet-600 to-indigo-600
                              hover:brightness-110 active:scale-[0.98] transition-all duration-200
                              disabled:opacity-75 disabled:cursor-not-allowed
                              shadow-md shadow-violet-500/15 flex items-center justify-center gap-1.5 cursor-pointer select-none
                            "
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Securing Escrow…</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>Hire Talent</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => { setMessageCandidate(candidate); setMessageSent(false); }}
                          className="
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300
                            hover:bg-slate-800/50 hover:border-slate-600 hover:text-white
                            active:scale-[0.98] transition-all duration-200 cursor-pointer select-none
                            flex items-center justify-center gap-1.5
                          "
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* ── Interactive Messaging micro-modal ── */}
      {messageCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 select-none">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white">Direct Chat — {messageCandidate.name}</h3>
              </div>
              <button
                onClick={() => setMessageCandidate(null)}
                className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </div>
                <p className="text-xs font-bold text-white">Message Dispatched</p>
                <p className="text-[10px] text-slate-500">Transferred via live AI messaging relays.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 select-none">
                    Write Message Scope:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your project deliverables, milestones, or rate alignments..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="
                      w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-700
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 hover:border-slate-800 transition-all
                    "
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="
                    w-full py-2.5 rounded-xl text-xs font-bold text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600
                    hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all shadow-md shadow-violet-500/15 cursor-pointer
                  "
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
