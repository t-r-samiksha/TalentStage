import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Cpu, Briefcase, Sparkles, DollarSign,
  ShieldCheck, User, Calendar, Plus, ChevronRight, ArrowUpRight,
  Award, Search, Paperclip, Smile, Check, AlertCircle, Wallet,
  Lock, Unlock, ArrowRight, Video, Phone, MoreVertical, CheckCircle2,
  X, RefreshCw, Layers, ShieldAlert, Terminal, HelpCircle
} from 'lucide-react';

function WorkspaceMessagesAndContracts({ activeSection = 'messages', onNavigate }) {
  const [currentSection, setCurrentSection] = useState(activeSection);

  // ─────────────────────────────────────────────────────────────────
  // ── STATE & DATA FOR WORKSPACE MESSAGES HUB (Page 14) ────────────
  // ─────────────────────────────────────────────────────────────────
  
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Prisha Iyer',
      role: 'Head of Developer Relations at ConsenSys',
      avatarInitials: 'PI',
      avatarGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      lastMessage: 'The ERC-4337 test suite looks very solid. Can you review the paymaster vault locking mechanism tomorrow?',
      time: '3m ago',
      online: true,
      unreadCount: 0,
      compatibility: 96,
      avatarRing: 'ring-emerald-500/50'
    },
    {
      id: 2,
      name: 'Elena Rostova',
      role: 'Lead Architect, Aave Labs',
      avatarInitials: 'ER',
      avatarGradient: 'from-indigo-500 via-purple-500 to-pink-500',
      lastMessage: 'Let’s release the first milestone. The Solidity compiler audits were checked in with zero critical errors.',
      time: '1h ago',
      online: true,
      unreadCount: 2,
      compatibility: 94,
      avatarRing: 'ring-emerald-500/50'
    },
    {
      id: 3,
      name: 'Alex Vance',
      role: 'Principal, Polygon Guild',
      avatarInitials: 'AV',
      avatarGradient: 'from-amber-500 via-orange-500 to-rose-500',
      lastMessage: 'Hey Ananya, we saw your attestation for the zkEVM vector storage. Would love to scope a bridge audit project.',
      time: '1d ago',
      online: false,
      unreadCount: 0,
      compatibility: 91,
      avatarRing: 'ring-slate-800'
    },
    {
      id: 4,
      name: 'Marcus Chen',
      role: 'Founder, ZeroLend',
      avatarInitials: 'MC',
      avatarGradient: 'from-fuchsia-500 via-pink-500 to-indigo-500',
      lastMessage: 'Can we schedule a quick architectural synch tomorrow morning? The multi-token vesting timelines need tweaks.',
      time: '2d ago',
      online: false,
      unreadCount: 0,
      compatibility: 89,
      avatarRing: 'ring-slate-800'
    }
  ]);

  const [activeConvId, setActiveConvId] = useState(1);
  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const [messagesDict, setMessagesDict] = useState({
    1: [
      { id: 101, sender: 'them', text: 'Hi Ananya! We reviewed your portfolio recommendations for our EVM Smart Contract Audit. Your verified test coverage scores are remarkable.', time: '10:15 AM' },
      { id: 102, sender: 'me', text: 'Thank you Prisha! Yes, I compiled full Hardhat coverage test suites and checked the compiler optimization settings. Everything is gas-optimized.', time: '10:18 AM' },
      { id: 103, sender: 'them', text: 'Excellent. I have registered the escrow payment for our multi-token lockup schedule. Total budget is locked at ₹65,000.', time: '10:20 AM' },
      { id: 104, sender: 'me', text: 'That sounds perfect. I saw the milestone structures in the escrow ledger. The first phase is fully audited and complete.', time: '10:22 AM' },
      { id: 105, sender: 'them', text: 'The ERC-4337 test suite looks very solid. Can you review the paymaster vault locking mechanism tomorrow?', time: '10:24 AM' }
    ],
    2: [
      { id: 201, sender: 'them', text: 'Hello, we are checking the Solidity audit parameters on Polygon zkEVM bridge protocol. Do you have vector optimization stats?', time: 'Yesterday' },
      { id: 202, sender: 'me', text: 'Yes Elena, the vector storage audits are verified. Zero compilation errors on Polygon compiler toolchain.', time: 'Yesterday' },
      { id: 203, sender: 'them', text: 'Let’s release the first milestone. The Solidity compiler audits were checked in with zero critical errors.', time: '1h ago' }
    ],
    3: [
      { id: 301, sender: 'them', text: 'Hey Ananya, we saw your attestation for the zkEVM vector storage. Would love to scope a bridge audit project.', time: '2 days ago' }
    ],
    4: [
      { id: 401, sender: 'them', text: 'Can we schedule a quick architectural synch tomorrow morning? The multi-token vesting timelines need tweaks.', time: '2 days ago' }
    ]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesDict, activeConvId, isTyping]);

  const simulateRecipientReply = (convId, textSent) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That makes absolute sense! I’ll check the escrow lockups now.",
        "Understood. Let me cross-verify this with our compiler team.",
        "Perfect. I am on the contract review tab right now ready to release the funds.",
        "Superb. Let's sync up on a video call tomorrow to lock down the paymaster scope."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newReply = {
        id: Date.now(),
        sender: 'them',
        text: randomReply,
        time: timeStr
      };

      setMessagesDict(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), newReply]
      }));

      setConversations(prev =>
        prev.map(c => c.id === convId ? { ...c, lastMessage: randomReply, time: 'Just now' } : c)
      );
    }, 2500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: timeStr
    };

    const targetConvId = activeConvId;
    setMessagesDict(prev => ({
      ...prev,
      [targetConvId]: [...(prev[targetConvId] || []), newMsg]
    }));

    setConversations(prev =>
      prev.map(c => c.id === targetConvId ? { ...c, lastMessage: inputText.trim(), time: 'Just now' } : c)
    );

    setInputText('');
    simulateRecipientReply(targetConvId, inputText.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickReplies = [
    "Let’s release the milestone.",
    "The Solidity audit looks good!",
    "Can you upload the test coverage report?",
    "I will check the paymaster vault logs."
  ];

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // ─────────────────────────────────────────────────────────────────
  // ── STATE & DATA FOR CONTRACT & ESCROW TIMELINE (Page 15) ────────
  // ─────────────────────────────────────────────────────────────────
  
  const contractMetadata = {
    title: 'EVM Smart Contract Escrow Audit',
    clientName: 'ConsenSys Ventures',
    freelancerName: 'Ananya Sharma',
    contractStatus: 'In Escrow',
    totalBudget: '₹65,000',
    creationDate: 'May 10, 2026',
    vaultAddress: '0x71C...8e45'
  };

  const [milestones, setMilestones] = useState([
    {
      id: 1,
      description: 'Solidity Codebase Audit & Security Checklist',
      amount: '₹18,000',
      status: 'Released',
      dueDate: 'May 15, 2026',
      completed: true
    },
    {
      id: 2,
      description: 'Multisig Escrow Contract Integration',
      amount: '₹22,000',
      status: 'Funded in Escrow',
      dueDate: 'June 05, 2026',
      completed: false
    },
    {
      id: 3,
      description: 'Attestation Compliance & Test Suite Execution',
      amount: '₹15,000',
      status: 'Funded in Escrow',
      dueDate: 'June 18, 2026',
      completed: false
    },
    {
      id: 4,
      description: 'Platform Mainnet Deployment & Handover',
      amount: '₹10,000',
      status: 'Pending Allocation',
      dueDate: 'July 01, 2026',
      completed: false
    }
  ]);

  const [flowState, setFlowState] = useState('idle'); // 'idle', 'transferring', 'success'
  const [activeLedgerStep, setActiveLedgerStep] = useState(2); // 1: Funded, 2: Locked, 3: Pending, 4: Done
  const [toastMessage, setToastMessage] = useState(null);
  
  // Scrolling Smart Contract Event Logs Console State
  const [telemetryLogs, setTelemetryLogs] = useState([
    '[SYSTEM] Escrow vault contract initialized at 0x71C...8e45',
    '[SYSTEM] Multi-signature signoff threshold configured (2-of-3)',
    '[INFO] Deposited ₹18,000 INR compiler audit allocation - Settled on-chain',
    '[INFO] Deposited ₹22,000 INR escrow vault allocation - Locked in smart contract',
    '[INFO] Deposited ₹15,000 INR attestation check allocation - Locked in smart contract',
    '[STATUS] Smart-contract listening for milestone release event triggers...'
  ]);
  
  const consoleEndRef = useRef(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [telemetryLogs]);

  const handleReleasePayment = (milestoneId) => {
    const targetAmt = milestoneId === 2 ? '₹22,000' : '₹15,000';
    setFlowState('transferring');
    setActiveLedgerStep(3);
    
    // Add logs
    setTelemetryLogs(prev => [
      ...prev,
      `[USER_ACTION] Invoke secureReleasePayment(milestoneId: ${milestoneId})`,
      `[RPC_CALL] Broadcasting transaction payload to EVM node...`,
      `[SOLIDITY] emit SettleAsset(vault: 0x71C...8e45, milestone: ${milestoneId}, amount: ${targetAmt})`
    ]);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        `[RPC_RESPONSE] Block #4819519 validated - Hash: 0x8a92f02f9c...39f1c`,
        `[EVENT_EMITTED] PaymentReleased(milestoneId: ${milestoneId}, recipient: 0xAS...d91c, amount: ${targetAmt})`,
        `[GAS_REPORT] SettleAsset gas utilization: 43,108 / Gas price: 18.2 Gwei`,
        `[STATUS] Ledger updated. Contractor balance unlocked successfully.`
      ]);

      setMilestones(prev => 
        prev.map(m => m.id === milestoneId ? { ...m, status: 'Released', completed: true } : m)
      );
      setFlowState('success');
      setActiveLedgerStep(4);
      setToastMessage(`Payment of ${targetAmt} has been successfully released from Safe Escrow Vault!`);
      
      setTimeout(() => {
        setFlowState('idle');
      }, 5000);
    }, 3000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TRANSACTION SUCCESS TOAST ALERTS ───────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4.5 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-5 max-w-md animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Transaction Settled</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{toastMessage}</p>
            </div>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── METALLIC TAB NAVIGATION SWITCHER ───────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl gap-5 relative overflow-hidden">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Operations Workspace
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </h2>
          <p className="text-[9px] text-indigo-400 font-extrabold tracking-[0.2em] uppercase mt-1 leading-none">
            Unified FinTech Escrows & Messages
          </p>
        </div>

        {/* Action Toggle Switch */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-850 select-none relative z-10">
          <button
            onClick={() => setCurrentSection('messages')}
            className={`
              flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer
              ${currentSection === 'messages'
                ? 'bg-gradient-to-tr from-indigo-600 via-indigo-650 to-violet-600 text-white shadow-lg shadow-indigo-500/10 border-indigo-400/25 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'
              }
            `}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages Hub</span>
            <span className="text-[8.5px] px-1 bg-white/10 rounded font-black text-white/90">Page 14</span>
          </button>
          
          <button
            onClick={() => setCurrentSection('escrow')}
            className={`
              flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer
              ${currentSection === 'escrow'
                ? 'bg-gradient-to-tr from-indigo-600 via-indigo-650 to-violet-600 text-white shadow-lg shadow-indigo-500/10 border-indigo-400/25 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'
              }
            `}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow & Ledgers</span>
            <span className="text-[8.5px] px-1 bg-white/10 rounded font-black text-white/90">Page 15</span>
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 1. WORKSPACE MESSAGES HUB (Page 14) ────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {currentSection === 'messages' && (
        <section className="h-[650px] border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col md:flex-row relative shadow-2xl">
          
          {/* LEFT CONVERSATIONS LIST SIDEBAR */}
          <div className="w-full md:w-[320px] h-full border-r border-slate-800/85 flex flex-col justify-between bg-slate-900/20 shrink-0">
            <div>
              {/* Search Bar Input */}
              <div className="p-4 border-b border-slate-900/90 relative group">
                <Search className="absolute left-7.5 top-7.5 w-4 h-4 text-slate-650 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter chat pathways..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-9 pr-4 py-3 rounded-xl text-xs
                    bg-slate-950 border border-slate-850
                    text-white placeholder:text-slate-700
                    focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20
                    hover:border-slate-750 transition-all duration-200
                  "
                />
              </div>

              {/* conversations List */}
              <div className="overflow-y-auto max-h-[500px] divide-y divide-slate-900/30">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-700 font-bold select-none uppercase tracking-wider">
                    No active channels found
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isActive = conv.id === activeConvId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id);
                          setConversations(prev =>
                            prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
                          );
                        }}
                        className={`
                          p-4.5 flex items-start gap-3.5 cursor-pointer transition-all duration-300 relative group
                          ${isActive 
                            ? 'bg-gradient-to-r from-slate-900/70 to-slate-900/20 border-l-3 border-indigo-500' 
                            : 'hover:bg-slate-900/20 border-l-3 border-transparent'
                          }
                        `}
                      >
                        {/* Avatar Block */}
                        <div className="relative shrink-0 select-none">
                          <div className={`
                            w-10 h-10 rounded-full bg-gradient-to-tr ${conv.avatarGradient} 
                            flex items-center justify-center text-xs font-black text-white shadow-md
                            ring-2 ${conv.avatarRing} ring-offset-2 ring-offset-slate-950
                            group-hover:scale-[1.03] transition-transform duration-200
                          `}>
                            {conv.avatarInitials}
                          </div>
                          {conv.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse shadow shadow-emerald-500/20" />
                          )}
                        </div>

                        {/* Roster details content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-xs font-black truncate leading-none ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                              {conv.name}
                            </h4>
                            <span className="text-[8.5px] font-bold text-slate-600 whitespace-nowrap ml-2">
                              {conv.time}
                            </span>
                          </div>
                          
                          <p className="text-[9.5px] text-indigo-400 font-extrabold tracking-wide mt-1.5 truncate">
                            {conv.role}
                          </p>

                          <p className="text-[10.5px] text-slate-500 truncate mt-1 leading-normal">
                            {conv.lastMessage}
                          </p>
                        </div>

                        {/* Dynamic Notification pill */}
                        {conv.unreadCount > 0 && (
                          <div className="absolute right-4.5 bottom-4 px-2 py-0.5 rounded-md bg-indigo-600 text-[8px] font-black text-white animate-pulse shadow shadow-indigo-500/20 uppercase">
                            {conv.unreadCount} new
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sidebar quick metadata footer */}
            <div className="p-4 border-t border-slate-900 bg-slate-950/40 select-none text-[8.5px] font-mono text-slate-600 flex justify-between items-center">
              <span>DISPATCH TUNNEL NODE 4</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>SECURED AES-256</span>
              </span>
            </div>
          </div>

          {/* RIGHT WORKSPACE CONSOLE WINDOW */}
          <div className="flex-1 h-full flex flex-col justify-between bg-slate-900/10 relative">
            
            {/* Header metadata bar */}
            <div className="p-4.5 border-b border-slate-900 bg-slate-900/40 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeConv.avatarGradient} flex items-center justify-center text-xs font-black text-white shadow ring-1 ring-slate-800`}>
                  {activeConv.avatarInitials}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white leading-none">{activeConv.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeConv.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">
                      {activeConv.online ? 'Active Channel' : 'Channel Closed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action badges */}
              <div className="flex items-center gap-3">
                
                {/* AI Score Capsule */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-[9px] font-extrabold tracking-wider uppercase shadow-inner text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Match Engine Context: {activeConv.compatibility}% Compatible</span>
                </div>

                {/* Calls actions triggers */}
                <div className="flex items-center border border-slate-850 rounded-lg bg-slate-950 p-1">
                  <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer" title="Initiate Secure Voice Audit">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer" title="Launch Video Consultation">
                    <Video className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer" title="More Operations">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* SCROLLING CONTEXT WINDOW */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[440px] bg-slate-950/20">
              
              {/* TLS handshake warning */}
              <div className="flex justify-center select-none">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-900 text-[8px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Lock className="w-3 h-3 text-indigo-500/80 animate-pulse" />
                  Secured blockchain telemetry handshakes active
                </span>
              </div>

              {/* Chat bubbles roster */}
              {(messagesDict[activeConv.id] || []).map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}>
                    <div className={`
                      max-w-md px-4 py-3 text-xs leading-relaxed shadow-lg
                      ${isMe
                        ? 'bg-gradient-to-tr from-indigo-500 via-indigo-650 to-violet-600 text-white rounded-l-2xl rounded-tr-2xl shadow-indigo-500/5'
                        : 'bg-slate-900/90 border border-slate-800/80 text-slate-100 rounded-r-2xl rounded-tl-2xl shadow-black/20 backdrop-blur-xl'
                      }
                    `}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-bold text-slate-650 mt-1 select-none font-mono">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* TYPING DOT PULSING RIPPLES */}
              {isTyping && (
                <div className="flex flex-col items-start animate-fadeIn">
                  <div className="px-4.5 py-3 rounded-r-2xl rounded-tl-2xl bg-slate-900 border border-slate-800 text-slate-500 text-xs flex items-center gap-1.5 select-none shadow shadow-black/20">
                    <span className="font-extrabold text-[10px] text-slate-500 uppercase tracking-wide">{activeConv.name} is typing</span>
                    <span className="flex items-center gap-1 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* MESSAGE ACTION FOOTER CONTAINER */}
            <div className="p-4.5 border-t border-slate-900 bg-slate-950 flex flex-col gap-3.5 relative">
              
              {/* Quick Prompt suggestions */}
              <div className="flex flex-wrap items-center gap-2 select-none z-10">
                <span className="text-[8px] font-black uppercase text-indigo-400 flex items-center gap-0.5 tracking-wider">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI ASSIST SUITE:
                </span>
                {quickReplies.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(r)}
                    className="
                      text-[9.5px] font-extrabold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400
                      hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-900/90 hover:scale-[1.01] transition-all cursor-pointer
                    "
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Message Typing Panel */}
              <div className="flex items-center gap-3.5 z-10">
                
                {/* File Upload triggers */}
                <div className="flex items-center gap-1.5">
                  <button className="p-3 rounded-xl bg-slate-905 border border-slate-850 hover:border-slate-700 hover:text-white text-slate-500 transition-all cursor-pointer shadow-sm" title="Attach Deliverables / Commits">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-xl bg-slate-905 border border-slate-850 hover:border-slate-700 hover:text-white text-slate-500 transition-all cursor-pointer shadow-sm" title="Insert Emoji">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Input Text Box */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Deploy secured payload to ${activeConv.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="
                      w-full px-4.5 py-3.5 rounded-xl text-xs
                      bg-slate-900 border border-slate-850
                      text-white placeholder:text-slate-700
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
                      hover:border-slate-750 transition-all duration-200
                    "
                  />
                </div>

                {/* Send action Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="
                    p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 active:scale-95 disabled:opacity-40
                    text-white flex items-center justify-center cursor-pointer shadow-lg shadow-violet-500/10 transition-all
                  "
                >
                  <Send className="w-4 h-4 text-white" />
                </button>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 2. SMART CONTRACT & ESCROW LEDGER (Page 15) ────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {currentSection === 'escrow' && (
        <section className="space-y-6">
          
          {/* HIGH-LEVEL CONTRACT METADATA DETAILS (4-Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
            
            {/* Project Title Node */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-500">Project Agreement</span>
              <h4 className="text-sm font-black text-white tracking-wide leading-snug truncate" title={contractMetadata.title}>
                {contractMetadata.title}
              </h4>
              <span className="text-[9.5px] font-bold text-slate-500 flex items-center gap-1 font-mono">
                VAULT: <span className="text-indigo-400">{contractMetadata.vaultAddress}</span>
              </span>
            </div>

            {/* Client Node */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-500">Deployer Client</span>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[9px] font-black text-white select-none">PI</div>
                {contractMetadata.clientName}
              </h4>
              <p className="text-[9.5px] font-semibold text-slate-500">ConsenSys Corp Venture Fund</p>
            </div>

            {/* Contractor Node */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-500">Verified Contractor</span>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-[9px] font-black text-white select-none">AS</div>
                {contractMetadata.freelancerName}
              </h4>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-violet-400 flex items-center gap-0.5 leading-none">
                <Award className="w-3.5 h-3.5" /> Top 5% Attested
              </span>
            </div>

            {/* Operational Contract Status Capsule */}
            <div className="flex flex-col justify-between items-start">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-500">Contract State</span>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black shadow shadow-amber-500/5 uppercase tracking-wider relative">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {contractMetadata.contractStatus}
                </span>
              </div>
              <span className="text-[9.5px] font-semibold text-slate-500 mt-1">Total locked budget: <span className="font-extrabold text-white">{contractMetadata.totalBudget}</span></span>
            </div>
          </div>

          {/* THE ESCROW LEDGER VISUALIZATION (Highlight Component) */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950 p-6 md:p-8 shadow-2xl relative overflow-hidden select-none">
            
            {/* Glowing background elements */}
            <div className="absolute top-[-80px] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <div className="flex justify-between items-center mb-10 select-none">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
                  Secured Escrow Ledger Topology
                </h3>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                  Decentralized money flow path auditing platform fees, lock-up releases, and client-freelancer transactions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-400 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl">
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${flowState === 'transferring' ? 'animate-spin' : ''}`} />
                <span className="uppercase tracking-wider font-extrabold">{flowState === 'transferring' ? 'Transmitting Assets...' : 'Ledger Synced'}</span>
              </div>
            </div>

            {/* FLOWTIMELINE SCHEMATIC BLOCK */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-3 relative z-10 py-6">
              
              {/* NODE 1: CLIENT WALLET */}
              <div className="w-full lg:w-[22%] flex flex-col items-center p-5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-700 transition-all text-center relative group backdrop-blur shadow-lg">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
                  <Wallet className="w-5.5 h-5.5 animate-pulse" />
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow" />
                </div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mt-4">Node 1: Client Wallet</h5>
                <p className="text-[9.5px] text-slate-500 mt-1 font-mono leading-none">0xPI...e851</p>
                <div className="mt-3 py-0.5 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8.5px] font-black text-emerald-400 uppercase tracking-widest leading-none select-none">
                  Funded & Active
                </div>
              </div>

              {/* CONNECTOR LINE 1 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850/50 relative overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-indigo-500/40" />
                  {/* Moving animated dots */}
                  <span className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow shadow-indigo-400/80 animate-dash-flow" style={{ animationDelay: '0s' }} />
                  <span className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow shadow-indigo-400/80 animate-dash-flow" style={{ animationDelay: '1s' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-800 absolute right-0" />
              </div>

              {/* NODE 2: SECURE ESCROW VAULT (LOCKED/UNLOCKED) */}
              <div className={`
                w-full lg:w-[22%] flex flex-col items-center p-5 rounded-xl border transition-all text-center relative group backdrop-blur shadow-lg
                ${flowState === 'transferring'
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-850 hover:border-slate-700'
                }
              `}>
                <div className={`
                  w-11 h-11 rounded-full flex items-center justify-center shadow-sm relative transition-all duration-300 group-hover:scale-105
                  ${flowState === 'transferring'
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-400 animate-bounce'
                    : flowState === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }
                `}>
                  {flowState === 'success' ? <Unlock className="w-5.5 h-5.5 text-emerald-400" /> : <Lock className="w-5.5 h-5.5 text-amber-500" />}
                </div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mt-4">Node 2: Escrow Vault</h5>
                <p className="text-[9.5px] text-slate-500 mt-1 font-mono leading-none">0x71C...8e45</p>
                <div className={`
                  mt-3 py-0.5 px-2 rounded-md text-[8.5px] font-black uppercase tracking-widest leading-none border
                  ${flowState === 'transferring'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : flowState === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                  }
                `}>
                  {flowState === 'transferring' ? 'Emitting release event' : flowState === 'success' ? 'Unlocked (Released)' : 'Locked Vault'}
                </div>
              </div>

              {/* CONNECTOR LINE 2 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850/50 relative overflow-hidden">
                  <div className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 transition-colors ${flowState === 'transferring' ? 'bg-amber-500/40' : 'bg-slate-800'}`} />
                  {/* Moving animated dots */}
                  <span className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow ${flowState === 'transferring' ? 'bg-amber-400 shadow-amber-400/80 animate-dash-flow' : 'bg-slate-650'}`} style={{ animationDelay: '0.2s' }} />
                  <span className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow ${flowState === 'transferring' ? 'bg-amber-400 shadow-amber-400/80 animate-dash-flow' : 'bg-slate-650'}`} style={{ animationDelay: '1.2s' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-800 absolute right-0" />
              </div>

              {/* NODE 3: CONTRACTOR BALANCE */}
              <div className={`
                w-full lg:w-[22%] flex flex-col items-center p-5 rounded-xl border transition-all text-center relative group backdrop-blur shadow-lg
                ${flowState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-850 hover:border-slate-700'
                }
              `}>
                <div className={`
                  w-11 h-11 rounded-full flex items-center justify-center shadow-sm relative transition-all duration-300 group-hover:scale-105
                  ${flowState === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border border-slate-850 text-slate-400'
                  }
                `}>
                  <User className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mt-4">Node 3: Contractor Balance</h5>
                <p className="text-[9.5px] text-slate-500 mt-1 font-mono leading-none">0xAS...d91c</p>
                <div className={`
                  mt-3 py-0.5 px-2 rounded-md text-[8.5px] font-black uppercase tracking-widest leading-none border
                  ${flowState === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-950 border-slate-900 text-slate-700'
                  }
                `}>
                  {flowState === 'success' ? 'Attested Success' : 'Awaiting Release'}
                </div>
              </div>

              {/* CONNECTOR LINE 3 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850/50 relative overflow-hidden">
                  <div className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 transition-colors ${flowState === 'success' ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
                  <span className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow ${flowState === 'success' ? 'bg-emerald-400 shadow-emerald-400/80 animate-dash-flow' : 'bg-slate-650'}`} style={{ animationDelay: '0.4s' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-800 absolute right-0" />
              </div>

              {/* NODE 4: 플랫폼 FEE TREASURY */}
              <div className="w-full lg:w-[22%] flex flex-col items-center p-5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-700 transition-all text-center relative group backdrop-blur shadow-lg">
                <div className="w-11 h-11 rounded-full bg-violet-500/10 border border-violet-500/35 flex items-center justify-center text-violet-400 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
                  <Cpu className="w-5.5 h-5.5 text-violet-400 animate-pulse" />
                </div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-wider mt-4">Node 4: Platform Fee</h5>
                <p className="text-[9.5px] text-slate-500 mt-1 font-mono leading-none">2.5% treasury allocation</p>
                <div className="mt-3 py-0.5 px-2 rounded-md bg-violet-500/10 border border-violet-500/20 text-[8.5px] font-black text-violet-400 uppercase tracking-widest leading-none select-none">
                  Processed on-chain
                </div>
              </div>

            </div>
          </div>

          {/* FUTURISTIC LEDGER MILESTONES DATA TABLE */}
          <div className="rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 md:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 select-none">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Milestone Settlement Schedule</h3>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                  Smart-contract release triggers. Select active funded milestones to release capital on completed deliverables.
                </p>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-lg bg-slate-950 border border-slate-850 text-[9px] font-mono font-black text-indigo-400">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                <span>DEFI MULTISIG CERTIFIED</span>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 select-none">
                    <th className="py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 pr-4">Milestone Description</th>
                    <th className="py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 px-4">Allocation Amount</th>
                    <th className="py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 px-4 text-center">Current Status</th>
                    <th className="py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 px-4">Due Date</th>
                    <th className="py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((m) => (
                    <tr 
                      key={m.id} 
                      className={`
                        border-b border-slate-900/40 hover:bg-slate-900/30 transition-colors duration-150 group
                        ${m.completed ? 'opacity-70' : ''}
                      `}
                    >
                      {/* Milestone Description */}
                      <td className="py-4 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight pr-4">
                        <div className="flex items-start gap-3">
                          <span className="w-5.5 h-5.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-[9px] font-mono font-black text-slate-500 shrink-0 shadow-sm">
                            {m.id}
                          </span>
                          <span>{m.description}</span>
                        </div>
                      </td>

                      {/* INR Amount */}
                      <td className="py-4 text-xs font-black text-white px-4 font-mono">
                        {m.amount}
                      </td>

                      {/* Status badges */}
                      <td className="py-4 text-xs px-4 text-center select-none">
                        {m.status === 'Released' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8.5px] font-black text-emerald-400 uppercase tracking-widest shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Released
                          </span>
                        )}
                        {m.status === 'Funded in Escrow' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[8.5px] font-black text-amber-400 uppercase tracking-widest shadow-sm relative">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Funded
                          </span>
                        )}
                        {m.status === 'Pending Allocation' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-slate-850 text-[8.5px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-slate-650" />
                            Locked
                          </span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 text-[10.5px] font-bold text-slate-500 px-4">
                        {m.dueDate}
                      </td>

                      {/* Payment release triggers */}
                      <td className="py-4 pl-4 text-right">
                        {m.status === 'Funded in Escrow' ? (
                          <button
                            onClick={() => handleReleasePayment(m.id)}
                            disabled={flowState === 'transferring'}
                            className="
                              px-3.5 py-2 rounded-xl
                              bg-gradient-to-r from-emerald-600 to-teal-650
                              hover:brightness-110 active:scale-95 disabled:opacity-40
                              text-white text-[9.5px] font-black uppercase tracking-wider
                              shadow-lg shadow-emerald-500/10 transition-all duration-150 cursor-pointer
                            "
                          >
                            Release Payment
                          </button>
                        ) : m.status === 'Released' ? (
                          <span className="text-[10px] text-slate-600 font-extrabold flex items-center justify-end gap-1.5 select-none pr-3">
                            <Check className="w-4 h-4 text-emerald-400" />
                            On-Chain Settled
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-700 font-extrabold pr-3 select-none uppercase tracking-wide">
                            Locked
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SMART CONTRACT TELEMETRY LOGGER (DX Highlight) */}
          <div className="rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-900/30 to-transparent pointer-events-none" />
            
            {/* Console Header */}
            <div className="p-3 border-b border-slate-900 bg-slate-900/50 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">
                  Smart Contract Telemetry Event Console
                </span>
              </div>
              <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-wider font-bold">
                EVM BLOCKHEIGHT: 19582910
              </span>
            </div>

            {/* Scrolling Logs Feed */}
            <div className="p-4.5 max-h-[140px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 leading-relaxed bg-slate-950/95 scrollbar-thin">
              {telemetryLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-700 select-none">{`[${i + 1}]`}</span>
                  <span className={`
                    ${log.startsWith('[RPC_') ? 'text-indigo-400' : ''}
                    ${log.startsWith('[EVENT_') ? 'text-emerald-400 font-bold' : ''}
                    ${log.startsWith('[SOLIDITY') ? 'text-violet-400' : ''}
                    ${log.startsWith('[SYSTEM') ? 'text-slate-500' : ''}
                    ${log.startsWith('[USER_') ? 'text-white font-bold' : ''}
                    ${log.startsWith('[GAS_') ? 'text-amber-400' : ''}
                  `}>
                    {log}
                  </span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>

        </section>
      )}

    </div>
  );
}

const styleTag = `
  @keyframes dash-flow {
    0% {
      left: -20%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      left: 120%;
      opacity: 0;
    }
  }
  .animate-dash-flow {
    animation: dash-flow 4s infinite linear;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = styleTag;
  document.head.appendChild(style);
}

export default WorkspaceMessagesAndContracts;
