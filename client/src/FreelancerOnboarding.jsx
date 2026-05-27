import { useState, useRef } from 'react';
import {
  Cpu, ArrowLeft, Camera, Globe, Code2, Plus, UploadCloud,
  Trash2, CheckCircle2, ChevronDown, ChevronRight, ChevronLeft,
  Calendar, GraduationCap, Check, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';

// ─── Autocomplete / Quick-Add Skills Suggestions ─────────────────────────────
const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'Solidity', 'TypeScript', 'UI/UX Design', 'Tailwind CSS', 'Python', 'Web3.js'
];

function FreelancerOnboarding({ onNavigate }) {
  // ─── General Wizard & Loader States ─────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formError, setFormError] = useState('');

  // ─── Step 1: Professional Profile Form States ──────────────────────────────
  const [avatar, setAvatar] = useState(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState(['React', 'Tailwind CSS', 'UI/UX Design']);
  const [skillInput, setSkillInput] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('full-time');
  const [education, setEducation] = useState('bachelors');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  // ─── Step 2: Portfolio Injection Form States ───────────────────────────────
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectRepo, setProjectRepo] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  const [isDraggingProjImg, setIsDraggingProjImg] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'Decentralized Smart Escrow Protocol',
      description: 'A cutting-edge Web3 freelance payment framework leveraging Solidity, OpenZeppelin, and multisig verification to guarantee safe contractor compensation.',
      tech: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
      link: 'https://escrow.talentstage.network',
      repo: 'https://github.com/developer/smart-escrow',
      image: null // Fallback gradient will render
    }
  ]);

  // Ref pointers for hidden file inputs
  const avatarInputRef = useRef(null);
  const projImgInputRef = useRef(null);

  // ─── Step 1 Handlers ───────────────────────────────────────────────────────
  const handleAvatarChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarChange(e.dataTransfer.files[0]);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/,$/, '');
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
      }
      setSkillInput('');
    }
  };

  const handleQuickAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // ─── Step 2 Handlers ───────────────────────────────────────────────────────
  const handleProjImgChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setProjectImage(e.target.result);
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  const handleProjImgDrop = (e) => {
    e.preventDefault();
    setIsDraggingProjImg(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProjImgChange(e.dataTransfer.files[0]);
    }
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = techInput.trim().replace(/,$/, '');
      if (trimmed && !projectTech.includes(trimmed)) {
        setProjectTech([...projectTech, trimmed]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setProjectTech(projectTech.filter(t => t !== techToRemove));
  };

  const handleAddProjectToRegistry = (e) => {
    e.preventDefault();
    setFormError('');

    if (!projectTitle.trim()) {
      setFormError('Portfolio project needs a title.');
      return;
    }
    if (!projectDesc.trim()) {
      setFormError('Portfolio project needs a brief description.');
      return;
    }

    const newProject = {
      id: Date.now(),
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      tech: projectTech.length > 0 ? projectTech : ['General Dev'],
      link: projectLink.trim(),
      repo: projectRepo.trim(),
      image: projectImage
    };

    setPortfolioItems([...portfolioItems, newProject]);

    // Clear step 2 injector form fields
    setProjectTitle('');
    setProjectDesc('');
    setProjectTech([]);
    setProjectLink('');
    setProjectRepo('');
    setProjectImage(null);
  };

  const handleRemoveProject = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  // ─── Navigation & Finalization Handlers ────────────────────────────────────
  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!bio.trim()) {
        setFormError('Please provide a brief bio to tell clients about yourself.');
        return;
      }
      if (skills.length === 0) {
        setFormError('Please specify at least one skill.');
        return;
      }
      if (!hourlyRate) {
        setFormError('Please define your hourly rate.');
        return;
      }
      if (!experience) {
        setFormError('Please specify your years of experience.');
        return;
      }
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    if (step === 2) {
      setStep(1);
    } else {
      onNavigate('signup');
    }
  };

  const handleCompleteProfile = () => {
    setFormError('');
    if (portfolioItems.length === 0) {
      setFormError('Please add at least one project to your portfolio before completing.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2500);
    }, 2000);
  };

  return (
    <div className="onboarding-shell min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(88,80,245,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%),#080b16] text-slate-100 font-sans relative flex flex-col justify-center items-center px-6 py-14 overflow-hidden selection:bg-cyan-300/30 selection:text-slate-950">
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-10 right-[-60px] w-[540px] h-[540px] rounded-full bg-violet-500/15 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[500px] h-[480px] rounded-full bg-cyan-400/12 blur-[110px] animate-pulse-glow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[280px] rounded-full bg-fuchsia-400/12 blur-[80px]" />
      </div>

      {/* ── Back button breadcrumb ── */}
      <div className="absolute top-7 left-6 md:left-10 z-20">
        <button
          onClick={handlePrevStep}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors duration-200 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>{step === 2 ? 'Back to Step 1' : 'Back to signup'}</span>
        </button>
      </div>

      {/* ── Card Wrapper ── */}
      <div className="relative z-10 w-full max-w-[680px]">
        
        {/* Brand Lockup */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-2.5 group mb-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[1.15rem] font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
              Talent<span className="text-cyan-300 font-extrabold">Stage</span>
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-200 leading-tight text-center">
            Set up your professional profile
          </h2>
          <p className="text-sm text-slate-400 mt-1 text-center max-w-xl leading-6">
            Craft a polished profile with refined visuals, clear sections, and a premium color palette.
          </p>
        </div>

        {/* ── GLASS CARD CONTAINER ── */}
        <div className="card-panel relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-slate-700 shadow-2xl shadow-slate-950/45 p-6 md:p-8">
          
          {/* Accent Line */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px accent-line" />
          {/* Inner sheen */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

          {/* ── WIZARD PROGRESS TRACKER ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3">
              <span className="text-cyan-300 font-extrabold">
                {step === 1 ? 'Step 1: Professional Profile' : 'Step 2: Advanced Portfolio'}
              </span>
              <span className="text-slate-400">
                {step === 1 ? 'Step 1 of 2 • 50% Complete' : 'Step 2 of 2 • 100% Ready'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-slate-600 via-violet-500 to-slate-600 transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>

            {/* Stepper Nodes */}
            <div className="flex justify-between items-center mt-4 px-2">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300 ${
                  step === 2 
                    ? 'bg-slate-800 border-slate-700 text-cyan-200 shadow-lg shadow-slate-900/20' 
                    : 'bg-slate-700 border-slate-600 text-slate-100 shadow-lg shadow-slate-900/20'
                }`}>
                  {step === 2 ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : '1'}
                </div>
                <span className={`text-sm font-bold transition-colors ${step === 1 ? 'text-cyan-300' : 'text-slate-300 group-hover:text-white'}`}>
                  Profile Info
                </span>
              </button>

              <div className="flex-1 h-px bg-slate-800 mx-4" />

              <button 
                onClick={handleNextStep}
                disabled={step === 1 && (!bio.trim() || skills.length === 0 || !hourlyRate || !experience)}
                className={`flex items-center gap-2 group transition-all ${
                  step === 1 && (!bio.trim() || skills.length === 0 || !hourlyRate || !experience)
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300 ${
                  step === 2 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  2
                </div>
                <span className={`text-sm font-bold transition-colors ${step === 2 ? 'text-cyan-300' : 'text-slate-300 group-hover:text-white'}`}>
                  Portfolio Items
                </span>
              </button>
            </div>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 flex items-start gap-2.5 text-xs text-rose-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
              <span>{formError}</span>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── STEP 1: GENERAL PROFILE FIELDS ─────────────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Profile Photo drag-and-drop */}
              <div className="flex flex-col items-center md:flex-row gap-5 p-4 rounded-2xl content-surface border border-slate-700">
                <div 
                  onClick={() => avatarInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
                  onDragLeave={() => setIsDraggingAvatar(false)}
                  onDrop={handleAvatarDrop}
                  className={`
                    relative w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shrink-0 select-none overflow-hidden group
                    ${avatar 
                      ? 'border-cyan-400/60 bg-slate-950/80' 
                      : isDraggingAvatar
                        ? 'border-cyan-400 bg-cyan-400/10' 
                        : 'border-slate-700 hover:border-cyan-400 bg-slate-950/80 hover:bg-slate-900'
                    }
                  `}
                >
                  <input 
                    type="file" 
                    ref={avatarInputRef}
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleAvatarChange(e.target.files[0])}
                  />
                  {avatar ? (
                    <>
                      <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                        <Camera className="w-5 h-5 text-white/80 mb-1" />
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Change</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors duration-300">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 mt-2 uppercase tracking-wider">
                        Upload
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left flex-1">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                    Profile Photo
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-sm">
                    Drag and drop your professional headshot, or click the frame to browse. Supported formats: JPG, PNG.
                  </p>
                  {avatar && (
                    <button 
                      type="button"
                      onClick={() => setAvatar(null)}
                      className="mt-2 text-sm font-bold text-rose-500 hover:text-rose-400 hover:underline transition-colors cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Bio Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center select-none">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Professional Summary / Bio
                  </label>
                  <span className={`text-sm font-semibold transition-colors ${bio.length > 450 ? 'text-amber-500' : 'text-slate-550'}`}>
                    {bio.length} / 500
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  placeholder="e.g. Senior Full-Stack Engineer specializing in React, Node, and Web3 technologies. 5+ years building highly interactive, scalable DeFi applications and responsive client-facing interfaces..."
                  className="
                    w-full h-28 px-4 py-3 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-sm text-slate-100 placeholder:text-slate-500
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                    hover:border-slate-700 resize-none
                    transition-all duration-200
                  "
                />
              </div>

              {/* Skills Tag-Input Component */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                  Technical Expertise & Skills
                </label>
                
                {/* Skill Pills Container */}
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl content-surface border border-slate-700 min-h-[50px] items-center">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-500 select-none pl-1">No skills added yet. Add some below.</span>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                          bg-slate-950/80 border border-cyan-500/15
                          text-xs text-cyan-300 font-semibold select-none
                        "
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-indigo-500/30 text-indigo-400 hover:text-white transition-colors duration-150 cursor-pointer text-sm"
                          aria-label={`Remove ${skill}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Tag input box */}
                <input
                  type="text"
                  placeholder="Type a skill (e.g. Solidity) and press Enter or comma"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-sm text-slate-100 placeholder:text-slate-500
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                    hover:border-slate-700
                    transition-all duration-200
                  "
                />

                {/* Autocomplete Suggestion Chips */}
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400 mr-1 select-none">Quick add:</span>
                  {SUGGESTED_SKILLS.map((suggested) => {
                    const isAdded = skills.includes(suggested);
                    return (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => handleQuickAddSkill(suggested)}
                        disabled={isAdded}
                        className={`
                          text-sm font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer
                          ${isAdded 
                            ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                            : 'bg-slate-950 border-slate-700 text-slate-100 hover:border-cyan-400 hover:text-white hover:bg-slate-900'
                          }
                        `}
                      >
                        + {suggested}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid: Rate & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hourly Rate */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    Target Hourly Rate
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="
                        w-full pl-8 pr-12 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 placeholder:text-slate-500
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 text-xs font-semibold select-none">
                      / Hr
                    </span>
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    Years of Experience
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="
                        w-full pl-10 pr-16 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 placeholder:text-slate-500
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 text-xs font-semibold select-none">
                      Years
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid: Availability & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Availability Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    Availability Status
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="
                        w-full pl-10 pr-10 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 appearance-none cursor-pointer
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    >
                      <option value="full-time">Full-Time (40+ hrs/wk)</option>
                      <option value="part-time">Part-Time (20-40 hrs/wk)</option>
                      <option value="contract">Contract / Flexible</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Education Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    Highest Education
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="
                        w-full pl-10 pr-10 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 appearance-none cursor-pointer
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    >
                      <option value="self-taught">Self-Taught / Portfolio-based</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">Ph.D. / Research-focused</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LinkedIn Brand-Agnostic Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    LinkedIn Network URL
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      placeholder="linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 placeholder:text-slate-500
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>

                {/* GitHub Brand-Agnostic Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                    GitHub Codebase URL
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                      <Code2 className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      placeholder="github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-slate-100 placeholder:text-slate-500
                        focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── STEP 2: DYNAMIC PORTFOLIO INJECTOR CARD ─────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-8">
              
              {/* Form Section Header */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                  Portfolio Construction
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Demonstrate your expertise to employers by linking your flagship projects. Include descriptions and source codes.
                </p>
              </div>

              {/* DYNAMIC PORTFOLIO INJECTOR CARD */}
              <div className="content-surface border border-slate-700 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
                
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-650 mb-4 select-none">
                  Add Project Portfolio
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  
                  {/* Left Side: Meta Inputs */}
                  <div className="space-y-4">
                    {/* Project Title */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TalentStage Freelance Portal"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="
                          w-full px-3.5 py-2.5 rounded-lg
                          bg-slate-950 border border-slate-800
                          text-xs text-slate-100 placeholder:text-slate-500
                          focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/25
                          hover:border-slate-700
                          transition-all duration-200
                        "
                      />
                    </div>

                    {/* Technologies Tag input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        placeholder="Type tag (e.g. Vue) and press Enter"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleAddTech}
                        className="
                          w-full px-3.5 py-2.5 rounded-lg
                          bg-slate-950 border border-slate-800
                          text-xs text-slate-100 placeholder:text-slate-500
                          focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/25
                          hover:border-slate-700
                          transition-all duration-200
                        "
                      />
                      
                      {/* Tech Chips */}
                      {projectTech.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {projectTech.map(tech => (
                            <span 
                              key={tech} 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sm text-cyan-300 font-semibold"
                            >
                              <span>{tech}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveTech(tech)}
                                className="text-indigo-500 hover:text-white font-bold cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Project Live Link */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Project Link (Live demo)
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-600 pointer-events-none">
                          <Globe className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="url"
                          placeholder="https://talentstage.com"
                          value={projectLink}
                          onChange={(e) => setProjectLink(e.target.value)}
                          className="
                            w-full pl-9 pr-3 py-2.5 rounded-lg
                            bg-slate-950 border border-slate-800
                            text-xs text-slate-100 placeholder:text-slate-500
                            focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/25
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                    {/* Repository Link */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Codebase Link (GitHub/GitLab)
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-600 pointer-events-none">
                          <Code2 className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="url"
                          placeholder="https://github.com/org/repo"
                          value={projectRepo}
                          onChange={(e) => setProjectRepo(e.target.value)}
                          className="
                            w-full pl-9 pr-3 py-2.5 rounded-lg
                            bg-slate-950 border border-slate-800
                            text-xs text-slate-100 placeholder:text-slate-500
                            focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/25
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Description & File Drop Area */}
                  <div className="space-y-4 flex flex-col">
                    
                    {/* Project Description */}
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Project Description *
                      </label>
                      <textarea
                        placeholder="Explain the technical challenges solved, stack details, and your specific role..."
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        className="
                          w-full h-24 px-3.5 py-2.5 rounded-lg flex-1
                          bg-slate-950 border border-slate-800
                          text-xs text-slate-100 placeholder:text-slate-500
                          focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/25
                          hover:border-slate-700 resize-none
                          transition-all duration-200
                        "
                      />
                    </div>

                    {/* Dashboard Image drag-and-drop */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Project Mockup / Screenshot
                      </label>
                      <div 
                        onClick={() => projImgInputRef.current.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingProjImg(true); }}
                        onDragLeave={() => setIsDraggingProjImg(false)}
                        onDrop={handleProjImgDrop}
                        className={`
                          relative h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-350 overflow-hidden group
                          ${projectImage 
                            ? 'border-cyan-500/50 bg-slate-950/85' 
                            : isDraggingProjImg
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-700 bg-slate-950/85 hover:border-cyan-500/50 hover:bg-slate-900'
                          }
                        `}
                      >
                        <input 
                          type="file" 
                          ref={projImgInputRef}
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleProjImgChange(e.target.files[0])}
                        />
                        {projectImage ? (
                          <>
                            <img src={projectImage} alt="Project Mockup Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <UploadCloud className="w-4 h-4 text-white mr-1.5" />
                              <span className="text-xs font-bold text-white uppercase tracking-widest">Change Mockup</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-cyan-300 group-hover:text-cyan-100 transition-colors duration-300" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-200 uppercase tracking-widest mt-1.5">
                              {isDraggingProjImg ? 'Drop image here' : 'Drop project cover'}
                            </span>
                            <span className="text-xs text-slate-400 mt-0.5">Click to select files</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Add Portfolio CTA */}
                <button
                  type="button"
                  onClick={handleAddProjectToRegistry}
                  className="
                    w-full py-2.5 rounded-lg border border-cyan-400/30
                    bg-cyan-500/10 hover:bg-cyan-500/15 hover:border-cyan-400/60
                    text-cyan-200 font-bold text-xs tracking-wide
                    flex items-center justify-center gap-2
                    transition-all duration-200 cursor-pointer active:scale-[0.99]
                  "
                >
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span>Add Project to Portfolio</span>
                </button>
              </div>

              {/* RENDERED REGISTERED PORTFOLIO ITEMS GALLERY */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                  Added Projects Registry ({portfolioItems.length})
                </h4>

                {portfolioItems.length === 0 ? (
                  <div className="text-center py-6 content-surface border border-slate-700 rounded-2xl">
                    <p className="text-xs text-slate-400 leading-normal">
                      No active portfolio elements. Construct a project above and inject it.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {portfolioItems.map((item) => (
                      <div 
                        key={item.id}
                        className="
                          relative overflow-hidden flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-slate-700 content-surface hover:border-cyan-400/40 hover:shadow-xl hover:shadow-slate-950/20 transition-all duration-200 group
                        "
                      >
                        {/* Project Thumbnail Image */}
                        <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-850 select-none">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-400">
                              <Code2 className="w-5 h-5 text-cyan-300/80" />
                            </div>
                          )}
                        </div>

                        {/* Project Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h5 className="text-xs font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
                                {item.title}
                              </h5>
                              <button
                                type="button"
                                onClick={() => handleRemoveProject(item.id)}
                                className="text-slate-600 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                                aria-label={`Delete project ${item.title}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Tech & Links */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-900/60">
                            {/* Tech Stack Chips */}
                            <div className="flex flex-wrap gap-1">
                              {item.tech.map((t) => (
                                <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/85 border border-cyan-500/15 text-cyan-300">
                                  {t}
                                </span>
                              ))}
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-3">
                              {item.link && (
                                <a 
                                  href={item.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                  <Globe className="w-3 h-3" />
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
                                </a>
                              )}
                              {item.repo && (
                                <a 
                                  href={item.repo} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                  <Code2 className="w-3 h-3" />
                                  <span>Repository</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ── SYSTEM NAVIGATION ACTIONS ───────────────────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <div className="mt-8 pt-5 border-t border-slate-900/80 flex items-center justify-between gap-4">
            
            {/* Back CTA */}
            <button
              type="button"
              onClick={handlePrevStep}
              className="
                px-5 py-3 rounded-xl border border-slate-800/80
                hover:border-slate-700 hover:bg-slate-900/40 active:scale-[0.97]
                text-slate-400 hover:text-white text-xs font-semibold
                flex items-center gap-2
                transition-all duration-200 cursor-pointer select-none
              "
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Complete Profile CTA */}
            <button
              type="button"
              onClick={step === 1 ? handleNextStep : handleCompleteProfile}
              disabled={isLoading}
              className="
                relative px-6 py-3 rounded-xl overflow-hidden
                bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600
                hover:brightness-110 active:scale-[0.98]
                disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
                text-white text-xs font-bold tracking-wide
                shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                flex items-center gap-2
                transition-all duration-200 cursor-pointer select-none
              "
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Launching Dashboard...</span>
                </>
              ) : step === 1 ? (
                <>
                  <span>Continue to Portfolio</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Complete Profile & Launch Dashboard</span>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Protection / trust label */}
        <p className="mt-5 text-center text-sm font-medium text-slate-500 tracking-wide select-none">
          Data stored safely on our encrypted cloud networks. You can edit this at any time in settings.
        </p>

      </div>

      {/* ── Simulated Onboarding Completed Success Modal Overlay ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-950 border border-slate-700 shadow-2xl p-8 text-center animate-scaleUp">
            {/* Header glow */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

            {/* Checked Circular Banner */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-35" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600/30 to-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight leading-none mb-2">
              Profile Completed!
            </h3>
            
            <p className="text-sm text-slate-650 leading-relaxed max-w-xs mx-auto mb-6">
              Your developer profile has been constructed and injected into the TalentStage ecosystem. Redirecting you to the workspace...
            </p>

            {/* Mini Escrow Badge */}
            <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-950/90 border border-slate-700 text-sm text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Smart Escrow Ledger Activated</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default FreelancerOnboarding;
