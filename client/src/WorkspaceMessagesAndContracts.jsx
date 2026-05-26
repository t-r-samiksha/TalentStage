import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Cpu, Briefcase, Sparkles, DollarSign,
  ShieldCheck, User, Calendar, Plus, ChevronRight, ArrowUpRight,
  Award, Search, Paperclip, Smile, Check, AlertCircle, Wallet,
  Lock, Unlock, ArrowRight, Video, Phone, MoreVertical, CheckCircle2,
  Trash2, X, RefreshCw
} from 'lucide-react';

function WorkspaceMessagesAndContracts({ activeSection = 'messages', onNavigate }) {
  // Toggle between 'messages' (Page 14) and 'escrow' (Page 15)
  const [currentSection, setCurrentSection] = useState(activeSection);

  // ─────────────────────────────────────────────────────────────────
  // ── STATE & DATA FOR WORKSPACE MESSAGES HUB (Page 14) ────────────
  // ─────────────────────────────────────────────────────────────────
  
  // Conversations roster mock data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Prisha Iyer',
      role: 'Head of Developer Relations at ConsenSys',
      avatarInitials: 'PI',
      avatarGradient: 'from-emerald-500 to-teal-500',
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
      avatarGradient: 'from-indigo-500 to-violet-500',
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
      avatarGradient: 'from-amber-500 to-rose-500',
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
      avatarGradient: 'from-fuchsia-500 to-indigo-500',
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

  // Message threads structured dictionary
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

  // Auto-scroll messages thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesDict, activeConvId, isTyping]);

  // Simulate receiving an automated reply after 2.5 seconds
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

      // Update last message in sidebar roster
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

    // Update roster preview
    setConversations(prev =>
      prev.map(c => c.id === targetConvId ? { ...c, lastMessage: inputText.trim(), time: 'Just now' } : c)
    );

    setInputText('');
    
    // Simulate automated reply
    simulateRecipientReply(targetConvId, inputText.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Quick automated reply selection
  const quickReplies = [
    "Let’s release the milestone.",
    "The Solidity audit looks good!",
    "Can you upload the test coverage report?",
    "I will check the paymaster vault logs."
  ];

  // Roster filtering
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // ─────────────────────────────────────────────────────────────────
  // ── STATE & DATA FOR CONTRACT & ESCROW TIMELINE (Page 15) ────────
  // ─────────────────────────────────────────────────────────────────
  
  // High-level contract metadata details
  const contractMetadata = {
    title: 'EVM Smart Contract Escrow Audit',
    clientName: 'ConsenSys Ventures',
    freelancerName: 'Ananya Sharma',
    contractStatus: 'In Escrow',
    totalBudget: '₹65,000',
    creationDate: 'May 10, 2026',
    vaultAddress: '0x71C...8e45'
  };

  // Milestone records state
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

  // Visual flow tracking indicator
  const [flowState, setFlowState] = useState('idle'); // 'idle', 'transferring', 'success'
  const [activeLedgerStep, setActiveLedgerStep] = useState(2); // 1: Funded, 2: Locked, 3: Pending, 4: Done
  const [toastMessage, setToastMessage] = useState(null);

  const handleReleasePayment = (milestoneId) => {
    // Start capital transmission simulation
    setFlowState('transferring');
    setActiveLedgerStep(3); // Moving funds from Locked Escrow to Freelancer Balance
    
    // Simulate smart contract event emission delay
    setTimeout(() => {
      setMilestones(prev => 
        prev.map(m => m.id === milestoneId ? { ...m, status: 'Released', completed: true } : m)
      );
      setFlowState('success');
      setActiveLedgerStep(4); // Fully processed platform fee and balance settlement
      setToastMessage(`Payment of ₹${milestoneId === 2 ? '22,000' : '15,000'} has been successfully released from Safe Escrow Vault!`);
      
      // Reset animations after successful completion
      setTimeout(() => {
        setFlowState('idle');
      }, 5000);
    }, 3000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Dynamic Action Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-4 max-w-md animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Transaction Settled</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── COCKPIT INTERACTION HEADER TABS ─────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            Workspace Console
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h2>
          <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mt-0.5">
            Unified FinTech Operations Roster
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 select-none">
          <button
            onClick={() => setCurrentSection('messages')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
              ${currentSection === 'messages'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages Hub</span>
            <span className="text-[9px] px-1 bg-white/10 rounded font-black text-white/95">P14</span>
          </button>
          
          <button
            onClick={() => setCurrentSection('escrow')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
              ${currentSection === 'escrow'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow & Ledgers</span>
            <span className="text-[9px] px-1 bg-white/10 rounded font-black text-white/95">P15</span>
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── SECTION 1: WORKSPACE MESSAGES HUB (Page 14) ────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {currentSection === 'messages' && (
        <section className="h-[650px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col md:flex-row relative">
          
          {/* LEFT SIDEBAR (Conversation Selection) */}
          <div className="w-full md:w-80 h-full border-r border-slate-800 flex flex-col justify-between bg-slate-900/30 shrink-0">
            <div>
              {/* Search Conversation Bar */}
              <div className="p-4 border-b border-slate-850 relative group">
                <Search className="absolute left-7 top-7.5 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search chats & clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-9 pr-4 py-2.5 rounded-lg text-xs
                    bg-slate-950 border border-slate-800
                    text-white placeholder:text-slate-600
                    focus:outline-none focus:border-indigo-500/60
                    hover:border-slate-700 transition-all duration-200
                  "
                />
              </div>

              {/* Roster list */}
              <div className="overflow-y-auto max-h-[500px] divide-y divide-slate-900/40">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-700 font-bold select-none">
                    No active dialogs found
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isActive = conv.id === activeConvId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id);
                          // Clear unread indicator simulation
                          setConversations(prev =>
                            prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
                          );
                        }}
                        className={`
                          p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 group relative
                          ${isActive 
                            ? 'bg-slate-900/70 border-l-2 border-indigo-500' 
                            : 'hover:bg-slate-900/30 border-l-2 border-transparent'
                          }
                        `}
                      >
                        {/* Avatar initials with dynamic online state */}
                        <div className="relative shrink-0">
                          <div className={`
                            w-9 h-9 rounded-full bg-gradient-to-tr ${conv.avatarGradient} 
                            flex items-center justify-center text-xs font-black text-white shadow-md
                            ring-1 ${conv.avatarRing} ring-offset-2 ring-offset-slate-950
                          `}>
                            {conv.avatarInitials}
                          </div>
                          {conv.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse shadow-sm shadow-emerald-500/20" />
                          )}
                        </div>

                        {/* Roster details content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-xs font-bold truncate leading-none ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                              {conv.name}
                            </h4>
                            <span className="text-[9px] font-semibold text-slate-600 whitespace-nowrap ml-2">
                              {conv.time}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-indigo-400 font-bold tracking-wide mt-1 truncate">
                            {conv.role}
                          </p>

                          <p className="text-[10.5px] text-slate-500 truncate mt-1 leading-normal">
                            {conv.lastMessage}
                          </p>
                        </div>

                        {/* Unread Message Pill Badge */}
                        {conv.unreadCount > 0 && (
                          <div className="absolute right-4 bottom-4 px-1.5 py-0.5 rounded-full bg-indigo-600 text-[8px] font-extrabold text-white animate-pulse">
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
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 select-none text-[9px] font-extrabold text-slate-600 flex justify-between items-center">
              <span>ACTIVE DISPATCH TUNNEL</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>SECURED TLS</span>
              </span>
            </div>
          </div>

          {/* RIGHT WORKSPACE PANE (Active Chat Window) */}
          <div className="flex-1 h-full flex flex-col justify-between bg-slate-900/10">
            
            {/* Thread Active Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${activeConv.avatarGradient} flex items-center justify-center text-xs font-black text-white shadow`}>
                  {activeConv.avatarInitials}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white leading-none">{activeConv.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeConv.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wide">
                      {activeConv.online ? 'Active Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Capsule trackers & Actions */}
              <div className="flex items-center gap-3">
                
                {/* AI Compatible Score Capsule */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/20 text-[9px] font-extrabold tracking-wider uppercase shadow-inner text-violet-300">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI Match: {activeConv.compatibility}% Compatible</span>
                </div>

                {/* Direct calling controls */}
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

            {/* MESSAGE THREAD SCROLL WINDOW */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[440px]">
              
              {/* Security encryption banner */}
              <div className="flex justify-center select-none">
                <span className="px-3 py-1 rounded bg-slate-950 border border-slate-900 text-[8.5px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-500/80" />
                  End-to-End Cryptographic Escrow Vault Handshake Active
                </span>
              </div>

              {/* Chat speech bubbles */}
              {(messagesDict[activeConv.id] || []).map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`
                      max-w-md px-4 py-3 text-xs leading-relaxed shadow-md
                      ${isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-l-xl rounded-tr-xl'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-r-xl rounded-tl-xl'
                      }
                    `}>
                      {msg.text}
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-600 mt-1 select-none">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* PULSING ACTIVE FEED TYPING INDICATOR */}
              {isTyping && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="px-4 py-3 rounded-r-xl rounded-tl-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs flex items-center gap-1 select-none">
                    <span className="font-semibold text-slate-500">{activeConv.name} is typing</span>
                    <span className="flex items-center gap-0.5 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* INPUT ACTION FOOTER */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-3">
              
              {/* Quick AI Suggestions */}
              <div className="flex flex-wrap items-center gap-2 select-none">
                <span className="text-[8px] font-black uppercase text-indigo-400 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  AI Assist:
                </span>
                {quickReplies.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(r)}
                    className="
                      text-[10px] font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400
                      hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-900/80 transition-all cursor-pointer
                    "
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Text Input Row */}
              <div className="flex items-center gap-3">
                
                {/* Media uploads controls */}
                <div className="flex items-center gap-1">
                  <button className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:text-white text-slate-500 transition-all cursor-pointer" title="Attach Deliverables / Commits">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:text-white text-slate-500 transition-all cursor-pointer" title="Insert Emoji">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Message input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Type secured message to ${activeConv.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="
                      w-full px-4 py-3 rounded-xl text-xs
                      bg-slate-900 border border-slate-800
                      text-white placeholder:text-slate-650
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40
                      hover:border-slate-750 transition-all duration-200
                    "
                  />
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="
                    p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 active:scale-95 disabled:opacity-40
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
      {/* ── SECTION 2: SMART CONTRACT & ESCROW LEDGER (Page 15) ────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {currentSection === 'escrow' && (
        <section className="space-y-6">
          
          {/* CORE METADATA HEADER CONTAINER (4-Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-lg relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-2xl pointer-events-none" />
            
            {/* Project Title */}
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Project Agreement</span>
              <h4 className="text-sm font-black text-white mt-1 leading-snug truncate" title={contractMetadata.title}>
                {contractMetadata.title}
              </h4>
              <span className="text-[9.5px] font-semibold text-slate-500 flex items-center gap-1 mt-1">
                Vault address: <span className="font-mono text-indigo-400">{contractMetadata.vaultAddress}</span>
              </span>
            </div>

            {/* Client Context */}
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Deployer Client</span>
              <h4 className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[8px] font-bold text-white leading-none">PI</div>
                {contractMetadata.clientName}
              </h4>
              <p className="text-[9.5px] font-semibold text-slate-500 mt-1">ConsenSys Corp Venture Fund</p>
            </div>

            {/* Freelancer Auditor */}
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Verified Contractor</span>
              <h4 className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white leading-none">AS</div>
                {contractMetadata.freelancerName}
              </h4>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-violet-400 flex items-center gap-0.5 mt-1">
                <Award className="w-3.5 h-3.5" /> Top 5% Attested
              </span>
            </div>

            {/* Operational Contract Status Capsule */}
            <div className="flex flex-col justify-between items-start">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Contract State</span>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black select-none shadow-sm shadow-amber-500/5 uppercase tracking-wide relative">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {contractMetadata.contractStatus}
                </span>
              </div>
              <span className="text-[9.5px] font-semibold text-slate-500 mt-1">Total locked budget: <span className="font-extrabold text-white">{contractMetadata.totalBudget}</span></span>
            </div>
          </div>

          {/* THE ESCROW LEDGER VISUALIZATION (Highlight Component) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 shadow-xl relative overflow-hidden">
            
            {/* Visual background glows */}
            <div className="absolute top-[-50px] left-[300px] w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-8 select-none">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-indigo-400">
                  Secured Escrow Ledger Topology
                </h3>
                <p className="text-[10px] text-slate-650 mt-1 leading-normal">
                  Decentralized money flow path auditing platform fees, lock-up releases, and client-freelancer transactions.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-slate-500 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg">
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${flowState === 'transferring' ? 'animate-spin' : ''}`} />
                <span className="uppercase">{flowState === 'transferring' ? 'Transmitting Assets...' : 'Ledger Synced'}</span>
              </div>
            </div>

            {/* FLOWTIMELINE SCHEMATIC BLOCK */}
            {/* Horizontally positioned on desktop, stacked on mobile */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-3 relative z-10 py-4 select-none">
              
              {/* NODE 1: CLIENT ACCOUNT */}
              <div className="w-full lg:w-[22%] flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 transition-all text-center relative group">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
                  <Wallet className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                </div>
                <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider mt-3">Node 1: Client Wallet</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Prisha Iyer / ConsenSys</p>
                <div className="mt-2.5 py-0.5 px-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-wide">
                  Funded & Authorized
                </div>
              </div>

              {/* CONNECTOR LINE 1 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-indigo-500/80 animate-pulse" />
                  {/* Moving animated dot indicator */}
                  <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow shadow-indigo-400/80 animate-dash-flow" style={{ left: '30%' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 absolute right-0" />
              </div>

              {/* NODE 2: SECURE ESCROW VAULT (LOCKED/UNLOCKED) */}
              <div className={`
                w-full lg:w-[22%] flex flex-col items-center p-4 rounded-xl border transition-all text-center relative group
                ${flowState === 'transferring'
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
                }
              `}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shadow-sm relative transition-transform duration-200 group-hover:scale-105
                  ${flowState === 'transferring'
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-400 animate-pulse'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }
                `}>
                  {flowState === 'success' ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-500" />}
                </div>
                <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider mt-3">Node 2: Escrow Vault</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Multi-Token Ledger Smart Contract</p>
                <div className={`
                  mt-2.5 py-0.5 px-2 rounded text-[9px] font-black uppercase tracking-wide border
                  ${flowState === 'transferring'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-amber-500/15 border-amber-500/25 text-amber-500'
                  }
                `}>
                  {flowState === 'transferring' ? 'Emitting Release event' : 'Locked Escrow (Verified)'}
                </div>
              </div>

              {/* CONNECTOR LINE 2 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850 relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 transition-colors ${flowState === 'transferring' ? 'bg-amber-500/60' : 'bg-slate-800'}`} />
                  {/* Moving animated dot indicator */}
                  <span className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow ${flowState === 'transferring' ? 'bg-amber-400 shadow-amber-400/80 animate-dash-flow' : 'bg-slate-600'}`} style={{ left: '50%' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 absolute right-0" />
              </div>

              {/* NODE 3: FREELANCER BALANCE */}
              <div className={`
                w-full lg:w-[22%] flex flex-col items-center p-4 rounded-xl border transition-all text-center relative group
                ${flowState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
                }
              `}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shadow-sm relative transition-transform duration-200 group-hover:scale-105
                  ${flowState === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border border-slate-850 text-slate-400'
                  }
                `}>
                  <User className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider mt-3">Node 3: Contractor Balance</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Ananya Sharma / TalentStage</p>
                <div className={`
                  mt-2.5 py-0.5 px-2 rounded text-[9px] font-black uppercase tracking-wide border
                  ${flowState === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-950 border-slate-900 text-slate-650'
                  }
                `}>
                  {flowState === 'success' ? 'Attestation Succeeded' : 'Awaiting Release'}
                </div>
              </div>

              {/* CONNECTOR LINE 3 */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative w-full h-1">
                <div className="w-full h-0.5 bg-slate-850 relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 transition-colors ${flowState === 'success' ? 'bg-emerald-500/60 animate-pulse' : 'bg-slate-800'}`} />
                  <span className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow ${flowState === 'success' ? 'bg-emerald-400 shadow-emerald-400/80 animate-dash-flow' : 'bg-slate-600'}`} style={{ left: '70%' }} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 absolute right-0" />
              </div>

              {/* NODE 4: PLATFORM FEE ECOSYSTEM */}
              <div className="w-full lg:w-[22%] flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 transition-all text-center relative group">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
                  <Cpu className="w-5 h-5 text-violet-400" />
                </div>
                <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider mt-3">Node 4: Fee Treasury</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">2.5% Auditing Allocation Fee</p>
                <div className="mt-2.5 py-0.5 px-2 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] font-black text-violet-400 uppercase tracking-wide">
                  Processed on-chain
                </div>
              </div>

            </div>
          </div>

          {/* MILESTONE MANAGEMENT TABLE */}
          <div className="rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 md:p-7 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-6 select-none">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Milestone Settlement Schedule</h3>
                  <p className="text-[10px] text-slate-655 mt-0.5 leading-normal">
                    Smart-contract release triggers. Select active funded milestones to release capital on completed deliverables.
                  </p>
                </div>
                <div className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-850 text-[9px] font-black text-indigo-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DEFI MULTISIG APPLIED</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 select-none">
                      <th className="py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 pr-4">Milestone Description</th>
                      <th className="py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 px-4">Allocation Amount</th>
                      <th className="py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 px-4 text-center">Current Status</th>
                      <th className="py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 px-4">Due Date</th>
                      <th className="py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 pl-4 text-right">Actions</th>
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
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded bg-slate-950 border border-slate-850 flex items-center justify-center text-[9.5px] font-black text-slate-500 shrink-0">
                              {m.id}
                            </span>
                            <span>{m.description}</span>
                          </div>
                        </td>

                        {/* Amount in ₹ */}
                        <td className="py-4 text-xs font-black text-white px-4">
                          {m.amount}
                        </td>

                        {/* Current Status badging */}
                        <td className="py-4 text-xs px-4 text-center select-none">
                          {m.status === 'Released' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-wide shadow-sm">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              Released
                            </span>
                          )}
                          {m.status === 'Funded in Escrow' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-wide shadow-sm relative">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              Funded in Escrow
                            </span>
                          )}
                          {m.status === 'Pending Allocation' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-[9px] font-black text-slate-500 uppercase tracking-wide">
                              <span className="w-1 h-1 rounded-full bg-slate-650" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Due Date */}
                        <td className="py-4 text-[10.5px] font-bold text-slate-500 px-4">
                          {m.dueDate}
                        </td>

                        {/* Control buttons */}
                        <td className="py-4 pl-4 text-right">
                          {m.status === 'Funded in Escrow' ? (
                            <button
                              onClick={() => handleReleasePayment(m.id)}
                              disabled={flowState === 'transferring'}
                              className="
                                px-3 py-1.5 rounded-lg
                                bg-gradient-to-r from-emerald-600 to-teal-600
                                hover:brightness-110 active:scale-95 disabled:opacity-40
                                text-white text-[10px] font-black uppercase tracking-wider
                                shadow-md shadow-emerald-500/10 transition-all duration-150 cursor-pointer
                              "
                            >
                              Release Payment
                            </button>
                          ) : m.status === 'Released' ? (
                            <span className="text-[10px] text-slate-600 font-extrabold flex items-center justify-end gap-1 select-none pr-3">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Settled On-chain
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-700 font-extrabold pr-3 select-none">
                              Locked Vault
                            </span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform compliance audit status footer */}
            <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[9px] font-bold text-slate-600 select-none gap-3">
              <span className="flex items-center gap-1 text-center sm:text-left">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                This contract complies with the Solidity Attestation Framework guidelines and utilizes secure multi-signature signoffs.
              </span>
              <span className="text-violet-400 font-black flex items-center gap-0.5 hover:underline cursor-pointer">
                View Ledger Smart Contract Code
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

          </div>

        </section>
      )}

    </div>
  );
}

// Inline CSS for scrolling data transmission dots along the connections
const styleTag = `
  @keyframes dash-flow {
    0% {
      left: 0%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }
  .animate-dash-flow {
    animation: dash-flow 3s infinite linear;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = styleTag;
  document.head.appendChild(style);
}

export default WorkspaceMessagesAndContracts;
