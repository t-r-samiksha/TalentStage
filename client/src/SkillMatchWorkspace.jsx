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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-50px] right-[-50px] w-[500px] h-[500px] rounded-full bg-violet-200/25 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[-50px] w-[450px] h-[450px] rounded-full bg-indigo-200/20 blur-[100px] animate-pulse-glow-reverse" />
      </div>

      {/* ── Premium Navigation Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
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
              onClick={() => setView('match-results')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer select-none ${view === 'match-results' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' : 'hover:text-slate-800'}`}
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
                            Question {currentQuestionIdx + 1} of {activeQuestions.length}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider flex items-center gap-1">
                            <Sliders className="w-2.5 h-2.5" />
                            Difficulty: Advanced
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
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 select-none">
                        <button
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIdx === 0}
                          className="px-4 py-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-3">
                          {currentQuestionIdx < activeQuestions.length - 1 ? (
                            <button
                              onClick={handleNextQuestion}
                              disabled={selectedOption === null}
                              className="
                                py-2 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-655
                                hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer
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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 13 — AI MATCH RESULT PERFORMANCE VIEW                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {view === 'match-results' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                  AI Match Results Performance
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Live optimization vector comparisons ranking optimal freelancers according to semantic scope overlays.
                </p>
              </div>
              <div className="flex items-center gap-2 py-1 px-3.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600 uppercase tracking-widest animate-pulse select-none">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active Reranking Optimization</span>
              </div>
            </div>

            {/* ── High-Tech Telemetry Banner ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm font-sans relative overflow-hidden space-y-4 shadow-xl select-none">
              {/* Corner tech indicators */}
              <div className="absolute top-3 right-4 text-xs text-slate-500 font-bold tracking-widest uppercase">
                SYSTEM TELEMETRY ENGINE v4.12
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-600 font-extrabold tracking-tight">INDEX PIPELINE SYNC SUCCESSFUL</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">Query Embedding Size: 1536 (Ada-002)</span>
              </div>

              {/* Latency ribbon grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vector Search</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-black text-slate-800">Embedding Grid Matrix</span>
                    <span className="text-indigo-650 font-extrabold text-sm">15ms</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[25%] bg-indigo-500" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cross-Encoder AI</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-black text-slate-800">Rerank Pipeline</span>
                    <span className="text-violet-600 font-extrabold text-sm">870ms</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-violet-500 animate-pulse" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">L2 Cosine Similarity</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-black text-slate-800">Confidence Threshold</span>
                    <span className="text-emerald-600 font-extrabold text-sm">0.894 min</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
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
                      relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300 group
                      ${isHired ? 'border-emerald-300 shadow-md bg-emerald-50/40' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}
                    `}
                  >
                    {/* Top ambient sheen */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.012] to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left Column: Micro-profile section */}
                      <div className="lg:col-span-3 flex items-center gap-4 border-r-none lg:border-r border-slate-200 pr-2 select-none">
                        {/* Avatar container */}
                        <div className={`w-12 h-12 rounded-2xl border ${candidate.borderColor} overflow-hidden bg-slate-100 shrink-0`}>
                          <div className={`w-full h-full bg-gradient-to-tr ${candidate.gradient} flex items-center justify-center text-sm font-black text-white`}>
                            {candidate.initials}
                          </div>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h4 className="text-base font-black text-slate-800 tracking-tight leading-none truncate">
                            {candidate.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 leading-none truncate">{candidate.role}</p>
                          
                          {/* Star Rating & AI Confidence Badge */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-450 fill-amber-450" />
                              ))}
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wide">
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
                              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                            ₹{candidate.hourlyRate.toLocaleString('en-IN')} / Hr
                          </span>
                        </div>

                        {/* Explicit Reasoning Description */}
                        <p className="text-sm text-slate-650 leading-relaxed font-semibold">
                          {candidate.matchReason}
                        </p>
                      </div>

                      {/* Right Column: Action matrix */}
                      <div className="lg:col-span-3 flex lg:flex-col gap-3 shrink-0 lg:pl-4">
                        
                        {isHired ? (
                          <div className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center gap-1.5 select-none animate-slideUp">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Escrow Assigned</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleHire(candidate)}
                            disabled={isLoading}
                            className="
                              flex-1 lg:flex-none py-2.5 px-5 rounded-xl text-sm font-semibold text-white
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
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600
                            hover:bg-slate-50 hover:border-slate-350 hover:text-slate-900
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-200 pb-3 select-none">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-650" />
                <h3 className="text-base font-extrabold text-slate-900">Direct Chat — {messageCandidate.name}</h3>
              </div>
              <button
                onClick={() => setMessageCandidate(null)}
                className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </div>
                <p className="text-sm font-bold text-slate-900">Message Dispatched</p>
                <p className="text-sm text-slate-500 font-medium">Transferred via live AI messaging relays.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-indigo-650 select-none">
                    Write Message Scope:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your project deliverables, milestones, or rate alignments..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="
                      w-full p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 hover:border-slate-805 transition-all
                    "
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="
                    w-full py-2.5 rounded-xl text-sm font-semibold text-white
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
