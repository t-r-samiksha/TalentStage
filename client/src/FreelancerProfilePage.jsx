import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Cpu, ArrowLeft, Calendar, Briefcase, DollarSign, CheckCircle2, 
  Star, Award, ShieldCheck, Sparkles, AlertCircle, Clock, FileText, ChevronRight
} from 'lucide-react';
import { authService } from './api';

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      setIsLoading(true);
      setError('');
      const result = await authService.getFreelancerProfile(id);
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error?.message || 'Failed to load freelancer profile details.');
      }
      setIsLoading(false);
    };
    fetchFreelancerProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-700/5 blur-[120px]" />
        </div>
        <div className="text-center relative z-10 space-y-4 select-none">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Retrieving Freelancer Credentials...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10 space-y-4 max-w-md px-6 select-none">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sync Error</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error || 'Freelancer profile not found'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-350 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { fullName, bio, email, createdAt, freelancerProfile, stats, skills, reviews, contracts } = profile;

  // Star rating helper
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < full ? 'text-amber-400 fill-amber-400' : half && i === full ? 'text-amber-400 fill-amber-400/50' : 'text-slate-700'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 font-sans p-6 md:p-10 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[600px] h-[600px] rounded-full bg-indigo-950/10 blur-[130px]" />
        <div className="absolute bottom-[-100px] left-[200px] w-[500px] h-[500px] rounded-full bg-violet-955/5 blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 animate-fadeIn">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors duration-200 group bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        {/* Freelancer Profile Header Card */}
        <section className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-[#121216]/60 border border-[#22222a] p-6 md:p-8 shadow-2xl">
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4.5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-indigo-550/10 border border-indigo-500/35 flex items-center justify-center text-2xl font-black text-indigo-400 shadow-lg shadow-indigo-500/5 select-none">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{fullName}</h1>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-500/20 text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest select-none">
                    Freelancer
                  </span>
                </div>
                <p className="text-xs text-slate-450 font-medium">{email}</p>
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </p>
              </div>
            </div>

            {/* Hourly Rate & Rating Badge */}
            <div className="flex items-center gap-4 select-none">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  {renderStars(freelancerProfile.rating)}
                  <span className="text-sm font-bold text-slate-200">{freelancerProfile.rating.toFixed(2)}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase mt-1">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
              
              {freelancerProfile.hourlyRate && (
                <div className="px-4.5 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-black text-sm shadow-md">
                  ₹{freelancerProfile.hourlyRate.toLocaleString('en-IN')}/hr
                </div>
              )}
            </div>
          </div>

          {bio && (
            <div className="mt-6 pt-6 border-t border-[#22222a]">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 select-none mb-1.5">Professional Summary</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{bio}</p>
            </div>
          )}
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
          {[
            { label: 'Completed Contracts', value: stats.completedContractsCount, sub: 'Closed Vaults', icon: CheckCircle2, color: 'emerald' },
            { label: 'Active Contracts', value: stats.activeContractsCount, sub: 'In Progress escrows', icon: Clock, color: 'indigo' },
            { label: 'Total Earnings', value: `₹${stats.totalEarnings.toLocaleString('en-IN')}`, sub: 'Released payments', icon: DollarSign, color: 'amber' },
            { label: 'Verified Skills', value: stats.verifiedSkillsCount, sub: 'AI Attested Badges', icon: ShieldCheck, color: 'violet' }
          ].map((card, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-[#22222a] bg-[#121216]/50 shadow-lg flex flex-col justify-between hover:border-slate-800 transition-colors">
              <div className={`w-9 h-9 rounded-xl mb-3.5 flex items-center justify-center
                ${card.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                  card.color === 'indigo' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' :
                  card.color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-455' :
                  'bg-violet-500/10 border border-violet-500/20 text-violet-400'}`}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{card.value}</p>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">{card.label}</p>
                <p className="text-[10px] text-slate-650 font-semibold mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Skills and Portfolio */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Verified Skills (Left Column) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#22222a] bg-[#121216]/50 p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#22222a] pb-4 select-none">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
              Verified Skills Attestations
            </h3>

            <div className="space-y-4">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-550 select-none">No skill badges attested yet.</p>
              ) : (
                skills.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3.5 rounded-xl border border-[#22222a] bg-slate-950/30">
                    <div className="flex items-center gap-2.5">
                      {s.verified ? (
                        <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-slate-900 border border-[#22222a] flex items-center justify-center text-slate-600">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-white block">{s.name}</span>
                        {s.verified && (
                          <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">Attested Badge</span>
                        )}
                      </div>
                    </div>
                    {s.verified && s.score !== null && (
                      <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        Score: {s.score}%
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Portfolio & Project History (Right Column) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#22222a] bg-[#121216]/50 p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#22222a] pb-4 select-none">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
              Verified Portfolio
            </h3>

            <div className="space-y-4">
              {contracts.filter(c => c.status === 'COMPLETED').length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-[#22222a] bg-slate-900/10 select-none">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">No completed project portfolio details available.</p>
                </div>
              ) : (
                contracts.filter(c => c.status === 'COMPLETED').map((c) => (
                  <div key={c.id} className="p-4.5 rounded-xl border border-[#22222a] bg-slate-950/20 space-y-2 hover:border-slate-800 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-white leading-tight">{c.projectName}</h4>
                      <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10.5px] font-bold text-slate-500 pt-1 border-t border-[#22222a]/50 select-none">
                      <span>Client: <span className="text-slate-350">{c.clientName}</span></span>
                      <span>·</span>
                      <span>Value: <span className="text-emerald-400">₹{c.contractValue.toLocaleString('en-IN')}</span></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* Client Reviews */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white select-none">Client Reviews & Attestations ({reviews.length})</h3>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-[#22222a] bg-[#121216]/10 select-none">
                <Star className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-400">This freelancer hasn't received any reviews yet.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl border border-[#22222a] bg-[#121216]/40 backdrop-blur-md space-y-3.5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {renderStars(r.rating)}
                        <span className="text-xs font-black text-amber-400 mt-0.5">{r.rating}/5</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-tight">Re: {r.projectName}</h4>
                    </div>
                    <span className="text-[10px] text-slate-550 font-bold whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-350 leading-relaxed font-medium">{r.comment}</p>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 select-none">
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-[#22222a] flex items-center justify-center text-[8px] font-black text-indigo-400 shrink-0">
                      {r.clientName.charAt(0).toUpperCase()}
                    </div>
                    <span>Reviewed by <span className="text-slate-400">{r.clientName}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
