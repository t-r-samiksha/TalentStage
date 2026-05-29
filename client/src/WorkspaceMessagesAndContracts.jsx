import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, ShieldCheck, Send, Paperclip, Search,
  CheckCircle2, Clock, FileText, ChevronRight,
  Zap, Lock, MoreHorizontal, Star,
  PlusCircle, ChevronDown, ChevronUp, AlertCircle, Wifi, WifiOff,
  X, Image, File as FileIcon, RefreshCw
} from 'lucide-react';
import { messageService, contractService } from './api/services/messageService';
import { socketService } from './api/services/socketService';
import authStorage from './api/authStorage';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'from-indigo-600 to-violet-600',
  'from-fuchsia-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-blue-600 to-cyan-500',
  'from-rose-600 to-pink-500',
];

function getAvatarGradient(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function getInitials(user) {
  const name = user?.profile?.fullName;
  if (name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  const email = user?.email || '';
  return email.slice(0, 2).toUpperCase();
}

function getDisplayName(user) {
  return user?.profile?.fullName || user?.email?.split('@')[0] || 'Unknown';
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return 'Yesterday';
}

// ─── STATUS CONFIG (Milestones) ────────────────────────────────────────────────

const STATUS_CONFIG = {
  APPROVED: { label: 'Completed', icon: CheckCircle2, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
  SUBMITTED: { label: 'In Progress', icon: Clock, badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'bg-indigo-500' },
  PENDING: { label: 'Pending Start', icon: AlertCircle, badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' },
  REVISION_REQUESTED: { label: 'Revision Requested', icon: RefreshCw, badge: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500' },
};

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-4">
        <MessageSquare className="w-7 h-7 text-indigo-400" />
      </div>
      <h3 className="text-base font-black text-slate-800 tracking-tight">No active contracts</h3>
      <p className="text-xs text-slate-400 mt-1 font-medium max-w-[200px] leading-relaxed">
        Hire a freelancer or get hired to start a conversation.
      </p>
    </div>
  );
}

function EmptyChat({ contractTitle }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
        <MessageSquare className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-600">Start your conversation</p>
      <p className="text-xs text-slate-400 mt-1">Re: <span className="font-semibold text-indigo-600">{contractTitle}</span></p>
    </div>
  );
}

// ─── MESSAGES PANEL ───────────────────────────────────────────────────────────

function MessagesPanel({ contracts, currentUserId, isLoadingContracts, socketConnected }) {
  const [activeContract, setActiveContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [pendingFile, setPendingFile] = useState(null);
  const [sendError, setSendError] = useState('');

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const prevContractRef = useRef(null);

  // ── Auto-select first contract ──
  useEffect(() => {
    if (contracts.length > 0 && !activeContract) {
      const timer = setTimeout(() => {
        setActiveContract(contracts[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [contracts, activeContract]);

  // ── Scroll to bottom when messages change ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // ── Fetch messages when active contract changes ──
  useEffect(() => {
    if (!activeContract) return;

    // Leave previous contract room
    if (prevContractRef.current && prevContractRef.current !== activeContract.id) {
      // just leave implicitly by stopping listening
    }
    prevContractRef.current = activeContract.id;

    // Join contract room via socket
    socketService.joinContract(activeContract.id);

    // Fetch message history
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setMessages([]);
      const result = await messageService.getMessages(activeContract.id);
      if (result.success && Array.isArray(result.data)) {
        setMessages(result.data);
      }
      setIsLoadingMessages(false);
    };
    fetchMessages();
  }, [activeContract]);

  // ── Socket event listeners ──
  useEffect(() => {
    // Real-time incoming message
    const onReceive = (msg) => {
      if (msg.contractId !== activeContract?.id) return;
      setMessages((prev) => {
        // Deduplicate: if we have an optimistic msg, replace it
        const optIdx = prev.findIndex(
          (m) => m._optimistic && m.content === msg.content && m.senderId === msg.senderId
        );
        if (optIdx !== -1) {
          const next = [...prev];
          next[optIdx] = msg;
          return next;
        }
        // Check real ID duplicate
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    // Typing indicators
    const onTypingStart = (userId) => {
      if (userId === currentUserId) return;
      setTypingUsers((prev) => new Set([...prev, userId]));
    };

    const onTypingStop = (userId) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    // Presence
    const onPresenceUpdate = (userIds) => {
      setOnlineUsers(new Set(userIds));
    };

    // Reconnect: re-fetch messages to catch any missed during outage
    const onReconnect = () => {
      if (activeContract) {
        socketService.joinContract(activeContract.id);
        messageService.getMessages(activeContract.id).then((result) => {
          if (result.success && Array.isArray(result.data)) {
            setMessages(result.data);
          }
        });
      }
    };

    socketService.on('chat:receive', onReceive);
    socketService.on('typing:start', onTypingStart);
    socketService.on('typing:stop', onTypingStop);
    socketService.on('presence:update', onPresenceUpdate);
    socketService.on('reconnect', onReconnect);

    return () => {
      socketService.off('chat:receive', onReceive);
      socketService.off('typing:start', onTypingStart);
      socketService.off('typing:stop', onTypingStop);
      socketService.off('presence:update', onPresenceUpdate);
      socketService.off('reconnect', onReconnect);
    };
  }, [activeContract, currentUserId]);

  // ── Handle typing indicator emit ──
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!activeContract || !currentUserId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.emit('typing:start', { contractId: activeContract.id, userId: currentUserId });
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socketService.emit('typing:stop', { contractId: activeContract.id, userId: currentUserId });
    }, 1500);
  };

  // ── Send message ──
  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed && !pendingFile) return;
    if (!activeContract || isSending) return;

    setSendError('');

    // Stop typing indicator
    clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;
    socketService.emit('typing:stop', { contractId: activeContract.id, userId: currentUserId });

    // Optimistic update
    const tempId = `_opt_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      _optimistic: true,
      contractId: activeContract.id,
      senderId: currentUserId,
      content: trimmed || (pendingFile ? pendingFile.name : ''),
      attachmentUrl: pendingFile ? URL.createObjectURL(pendingFile) : null,
      attachmentType: pendingFile ? pendingFile.type : null,
      createdAt: new Date().toISOString(),
      sender: { id: currentUserId, email: '' },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');
    setPendingFile(null);
    setIsSending(true);

    const result = await messageService.sendMessage(activeContract.id, trimmed, pendingFile || null);

    setIsSending(false);

    if (!result.success) {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError('Failed to send. Please try again.');
    }
    // On success, the socket event `chat:receive` will replace the optimistic msg
  }, [input, pendingFile, activeContract, currentUserId, isSending]);

  // ── File selection ──
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = '';
  };

  // ── Helpers for current contract context ──
  const getOtherParty = (contract) => {
    if (!contract) return null;
    return contract.clientId === currentUserId ? contract.freelancer : contract.client;
  };

  const isOnline = (userId) => onlineUsers.has(userId);

  const filtered = contracts.filter((c) => {
    const other = getOtherParty(c);
    const name = getDisplayName(other).toLowerCase();
    const project = c.project?.title?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || project.includes(q);
  });

  const activeOther = activeContract ? getOtherParty(activeContract) : null;

  return (
    <div className="flex h-[680px] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-72 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50">

        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Conversations</h3>
            {/* Connection indicator */}
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${socketConnected ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
              {socketConnected ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
              {socketConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{contracts.length} active contract{contracts.length !== 1 ? 's' : ''}</p>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contracts..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Contract List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingContracts ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyConversations />
          ) : (
            filtered.map((c) => {
              const other = getOtherParty(c);
              const online = isOnline(other?.id);
              const isActive = activeContract?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveContract(c)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-slate-200/60 transition-all duration-150 cursor-pointer
                    ${isActive ? 'bg-indigo-50 border-l-2 border-l-indigo-600' : 'hover:bg-slate-100/60'}`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(other?.id)} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
                      {getInitials(other)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-50 ${online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {getDisplayName(other)}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{formatTime(c.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-0.5 truncate">{c.project?.title}</p>
                    <p className={`text-[11px] text-slate-500 mt-0.5 truncate leading-snug capitalize ${c.status === 'ACTIVE' ? 'text-emerald-600 font-semibold' : ''}`}>
                      {c.status?.toLowerCase() ?? 'active'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT CHAT PANE ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {!activeContract ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-400">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(activeOther?.id)} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
                  {getInitials(activeOther)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-200 ${isOnline(activeOther?.id) ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 leading-tight">{getDisplayName(activeOther)}</h4>
                <p className="text-xs text-slate-500 font-semibold">
                  {activeOther?.email} · <span className="text-indigo-600">{activeContract.project?.title}</span>
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${isOnline(activeOther?.id) ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline(activeOther?.id) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isOnline(activeOther?.id) ? 'Online Now' : 'Offline'}
                </span>
                <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project Context Banner */}
            <div className="mx-4 mt-3 mb-1 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2.5 shrink-0">
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <p className="text-xs font-semibold text-indigo-800">
                Contract: <span className="text-slate-800 font-bold">{activeContract.project?.title}</span>
              </p>
              <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full border ${activeContract.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {activeContract.status}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-10">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <EmptyChat contractTitle={activeContract.project?.title} />
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === currentUserId;
                  const isOptimistic = m._optimistic;
                  return (
                    <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      {isMe ? (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200 shrink-0 mt-0.5">
                          ME
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(activeOther?.id)} flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5 shadow-sm`}>
                          {getInitials(activeOther)}
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        {/* Text bubble */}
                        {m.content && (
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-semibold shadow-sm ${isOptimistic ? 'opacity-70' : ''}
                            ${isMe
                              ? 'bg-indigo-600 text-white rounded-tr-sm'
                              : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60'
                            }`}>
                            {m.content}
                          </div>
                        )}

                        {/* Attachment preview */}
                        {m.attachmentUrl && (
                          <a
                            href={m.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${isMe ? 'bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-400' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'}`}
                          >
                            {m.attachmentType?.startsWith('image/')
                              ? <Image className="w-3.5 h-3.5 shrink-0" />
                              : <FileIcon className="w-3.5 h-3.5 shrink-0" />
                            }
                            <span className="truncate max-w-[160px]">Attachment</span>
                          </a>
                        )}

                        <span className="text-[10px] text-slate-400 font-medium px-1">
                          {isOptimistic ? 'Sending…' : formatTime(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div className="flex gap-3 items-end">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(activeOther?.id)} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
                    {getInitials(activeOther)}
                  </div>
                  <div className="bg-slate-100 border border-slate-200/60 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Send Error */}
            {sendError && (
              <div className="mx-4 mb-1 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {sendError}
                <button onClick={() => setSendError('')} className="ml-auto cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            )}

            {/* Pending file preview */}
            {pendingFile && (
              <div className="mx-4 mb-1 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <FileIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pendingFile.name}</span>
                <button onClick={() => setPendingFile(null)} className="ml-auto cursor-pointer text-indigo-400 hover:text-rose-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-end gap-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.zip"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 mb-0.5 ${pendingFile ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                    placeholder={activeContract ? `Message about "${activeContract.project?.title}"…` : 'Select a contract to chat…'}
                    rows={1}
                    disabled={!activeContract || activeContract.status !== 'ACTIVE'}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 resize-none transition-colors leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  onClick={send}
                  disabled={(!input.trim() && !pendingFile) || isSending || !activeContract || activeContract.status !== 'ACTIVE'}
                  className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0 mb-0.5"
                >
                  {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center font-semibold">
                All messages are end-to-end encrypted · <Lock className="w-2.5 h-2.5 inline-block" /> Escrow-linked channel
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CONTRACTS PANEL ──────────────────────────────────────────────────────────

function ContractsPanel({ contracts, isLoadingContracts }) {
  const [expanded, setExpanded] = useState(null);

  const totalEscrow = contracts.reduce((a, c) =>
    a + (c.milestones || []).reduce((s, m) => s + (m.amount || 0), 0), 0);
  const totalReleased = contracts.reduce((a, c) =>
    a + (c.milestones || []).filter(m => m.status === 'APPROVED').reduce((s, m) => s + (m.amount || 0), 0), 0);
  const totalPending = totalEscrow - totalReleased;

  const allMilestones = contracts.flatMap((c) =>
    (c.milestones || []).map((m) => ({ ...m, contract: c }))
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Contract Value', value: `₹${totalEscrow.toLocaleString()}`, sub: `Across ${contracts.length} contract${contracts.length !== 1 ? 's' : ''}`, icon: FileText, color: 'indigo' },
          { label: 'Released to Contractors', value: `₹${totalReleased.toLocaleString()}`, sub: `${allMilestones.filter(m => m.status === 'APPROVED').length} milestone${allMilestones.filter(m => m.status === 'APPROVED').length !== 1 ? 's' : ''} completed`, icon: CheckCircle2, color: 'emerald' },
          { label: 'Held in Escrow', value: `₹${totalPending.toLocaleString()}`, sub: 'Pending delivery approval', icon: Lock, color: 'amber' },
        ].map((card) => (
          <div key={card.label} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-colors">
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center
              ${card.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                'bg-amber-50 text-amber-600'}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{card.value}</p>
            <p className="text-sm font-bold text-slate-500 mt-1">{card.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Milestones Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Milestone Escrow Ledger</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Smart contract-backed milestone tracking</p>
          </div>
          <button className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-2.5 bg-slate-50/20 border-b border-slate-200">
          {['Milestone', 'Amount', 'Contract', 'Status', ''].map((h) => (
            <p key={h} className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {isLoadingContracts ? (
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ) : allMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <FileText className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm font-semibold">No milestones yet</p>
            </div>
          ) : (
            allMilestones.map((m) => {
              const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = cfg.icon;
              const isOpen = expanded === m.id;

              return (
                <div key={m.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <div
                    onClick={() => setExpanded(isOpen ? null : m.id)}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-4 cursor-pointer items-center"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{m.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{m.contract?.project?.title}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-900">₹{(m.amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{m.status === 'APPROVED' ? '100%' : '0%'} released</p>
                    </div>

                    <p className="text-sm font-semibold text-slate-700 truncate">{m.contract?.project?.title?.slice(0, 20)}</p>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border w-fit text-xs font-bold ${cfg.badge}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </div>

                    <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all cursor-pointer">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="px-5 pb-2">
                    <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                        style={{ width: m.status === 'APPROVED' ? '100%' : m.status === 'SUBMITTED' ? '60%' : '0%' }}
                      />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Submission</p>
                          <p className="text-sm font-bold text-slate-900">{m.submissionText || 'No submission yet'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Amount</p>
                          <p className="text-sm font-black text-emerald-600">₹{(m.amount || 0).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 items-end">
                          {m.status === 'SUBMITTED' && (
                            <>
                              <button className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve & Release
                              </button>
                              <button className="flex-1 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                                Request Revision
                              </button>
                            </>
                          )}
                          {m.status === 'APPROVED' && (
                            <div className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Payment Released
                            </div>
                          )}
                          {m.status === 'PENDING' && (
                            <button className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20">
                              <Zap className="w-3.5 h-3.5" />
                              Fund Escrow
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export default function WorkspaceMessagesAndContracts({ activeSection = 'messages' }) {
  const [contracts, setContracts] = useState([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  const currentUser = authStorage.getUser();
  const currentUserId = currentUser?.id;

  // ── Fetch contracts on mount ──
  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoadingContracts(true);
      const result = await contractService.getMyContracts();
      if (result.success && Array.isArray(result.data)) {
        setContracts(result.data);
      }
      setIsLoadingContracts(false);
    };
    fetchContracts();
  }, []);

  // ── Setup socket on mount ──
  useEffect(() => {
    if (!currentUserId) return;

    socketService.connect();
    socketService.join(currentUserId);

    // Track connection state
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    socketService.on('connect', onConnect);
    socketService.on('disconnect', onDisconnect);

    // Check initial state
    if (socketService.socket?.connected) {
      const timer = setTimeout(() => {
        setSocketConnected(true);
      }, 0);
      return () => {
        clearTimeout(timer);
        socketService.off('connect', onConnect);
        socketService.off('disconnect', onDisconnect);
      };
    }

    return () => {
      socketService.off('connect', onConnect);
      socketService.off('disconnect', onDisconnect);
      // Keep socket alive; don't disconnect on unmount for demo
    };
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {activeSection === 'messages' ? 'Messages Hub' : 'Contracts & Escrow'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {activeSection === 'messages' ? 'Candidate Messages' : 'Milestone & Escrow Ledger'}
            </h1>
            <p className="text-base text-slate-500 font-semibold mt-1.5">
              {activeSection === 'messages'
                ? 'Real-time encrypted communication with your contractors.'
                : 'Smart contract-backed milestone payments. Full audit trail & dispute resolution.'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${socketConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
              {socketConnected ? 'Live' : 'Offline'}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Star className="w-3 h-3 text-indigo-600" />
              {isLoadingContracts ? '...' : contracts.length} Contracts
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      {activeSection === 'messages' ? (
        <MessagesPanel
          contracts={contracts}
          currentUserId={currentUserId}
          isLoadingContracts={isLoadingContracts}
          socketConnected={socketConnected}
        />
      ) : (
        <ContractsPanel
          contracts={contracts}
          isLoadingContracts={isLoadingContracts}
        />
      )}
    </div>
  );
}
