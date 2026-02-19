
import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  BarChart2, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  Circle,
  X,
  Search,
  Calculator,
  Utensils,
  Activity,
  Zap,
  ShieldCheck,
  Flame,
  Lock,
  Bell,
  Droplet,
  Dumbbell as DumbbellIcon,
  MinusCircle,
  TrendingDown,
  Clock,
  ChevronLeft,
  WheatOff,
  Beef,
  Camera,
  Info,
  Trophy,
  Save,
  RotateCcw,
  Settings,
  Plus
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { DietPhase, SubPhase, UserProgress, Language, FoodItem, Notification, DietConfigs } from './types';
import { 
  TRANSLATIONS, 
  DIET_CONFIG, 
  BENEFIT_ICONS, 
  FOOD_DATABASE,
  DIET_VIDEOS
} from './constants';

// --- Helpers ---
const useTranslation = (lang: Language) => {
  return TRANSLATIONS[lang];
};

// --- Onboarding ---

const OnboardingScreen: React.FC<{ 
  language: Language, 
  setLanguage: (lang: Language) => void, 
  onComplete: () => void 
}> = ({ language, setLanguage, onComplete }) => {
  const [step, setStep] = useState(0);
  const { ui } = useTranslation(language);

  const steps = [
    {
      header: ui.problem_header,
      text: ui.problem_text,
      icon: <WheatOff size={64} className="text-red-500" />
    },
    {
      header: ui.proposal_header,
      text: ui.proposal_text,
      subText: ui.action_text,
      icon: <Flame size={64} className="text-red-500" />
    },
    {
      header: ui.not_fad_header,
      text: ui.not_fad_text,
      icon: <ShieldCheck size={64} className="text-red-500" />
    }
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col z-[300]">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-black italic tracking-tighter text-red-600">METABOLIC</h2>
        <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
          <button 
            onClick={() => setLanguage('pt')} 
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${language === 'pt' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}
          >
            PT
          </button>
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${language === 'en' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-700">
        <div className="bg-zinc-900/50 p-12 rounded-[4rem] border border-zinc-800 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
            {steps[step].icon}
          </div>
        </div>
        
        <div className="space-y-4 max-w-xs">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{steps[step].header}</h1>
          <p className="text-zinc-400 font-bold leading-relaxed whitespace-pre-line">{steps[step].text}</p>
          {steps[step].subText && (
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-4 border-t border-zinc-900 pt-4">
              {steps[step].subText}
            </p>
          )}
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 transition-all duration-300 rounded-full ${i === step ? 'w-8 bg-red-600' : 'w-2 bg-zinc-800'}`} />
          ))}
        </div>
        <button 
          onClick={next}
          className="w-full bg-red-600 py-6 rounded-3xl font-black uppercase tracking-widest text-sm active:scale-95 shadow-lg flex items-center justify-center space-x-3 transition-all hover:bg-red-700"
        >
          <span>{step === steps.length - 1 ? ui.start_now : ui.tap_clean}</span>
          <ChevronRight size={20} />
        </button>
        <p className="text-[9px] text-center text-zinc-700 font-black uppercase tracking-[0.3em]">{ui.medical_supervision}</p>
      </div>
    </div>
  );
};

// --- Admin Panel ---

const AdminPanel: React.FC<{ 
  language: Language, 
  dietConfigs: DietConfigs, 
  onSave: (newConfigs: DietConfigs) => void,
  onBack: () => void 
}> = ({ language, dietConfigs, onSave, onBack }) => {
  const { ui, phases } = useTranslation(language);
  const [localConfigs, setLocalConfigs] = useState<DietConfigs>(dietConfigs);

  const handleLimitChange = (phase: DietPhase, newLimit: number) => {
    setLocalConfigs(prev => ({
      ...prev,
      [phase]: { ...prev[phase], limit: newLimit }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-zinc-400 p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight">Painel Admin</h2>
        </div>
        <button onClick={() => setLocalConfigs(DIET_CONFIG)} className="text-zinc-500 hover:text-red-500 p-2">
          <RotateCcw size={20} />
        </button>
      </div>
      <div className="p-6 space-y-6 max-w-md mx-auto w-full pb-32">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start space-x-3">
          <Info className="text-red-500 shrink-0" size={20} />
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">Defina os limites de carboidratos para cada fase.</p>
        </div>
        {[DietPhase.LOW_CARB, DietPhase.KETOGENIC, DietPhase.CARNIVORE].map((phase) => (
          <div key={phase} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-lg">{phases[phase]}</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Limite Diário (g)</label>
              <div className="relative">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                <input 
                  type="number" 
                  value={localConfigs[phase].limit} 
                  onChange={(e) => handleLimitChange(phase, Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 font-bold"
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => onSave(localConfigs)} className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-2">
          <Save size={20} /> <span>Salvar Configurações</span>
        </button>
      </div>
    </div>
  );
};

// --- Dashboard ---

const Dashboard: React.FC<{ 
  progress: UserProgress, 
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>,
  dietConfigs: DietConfigs,
  onOpenAdmin: () => void
}> = ({ progress, setProgress, dietConfigs, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState('dieta');
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showGoalsEdit, setShowGoalsEdit] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dietDetail, setDietDetail] = useState<DietPhase | null>(null);
  const [showLockedPhase, setShowLockedPhase] = useState(false);
  const [goalTooltip, setGoalTooltip] = useState<'weight' | 'water' | null>(null);
  const [showNextPhaseModal, setShowNextPhaseModal] = useState(false);
  const [animatingTask, setAnimatingTask] = useState<string | null>(null);
  
  const [foodSearch, setFoodSearch] = useState('');
  const [foodFilter, setFoodFilter] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionType, setPortionType] = useState<'100g' | 'cup' | 'unit'>('100g');
  
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ui, phases, subPhases, objectives, tasks: taskLabels, taskBenefits, benefits } = useTranslation(progress.language);

  // Forms for editing
  const [personalForm, setPersonalForm] = useState({
    name: progress.name,
    email: progress.email
  });

  const [goalsForm, setGoalsForm] = useState({
    weightGoal: progress.weightGoal,
    waterGoal: progress.waterGoal
  });

  const savePersonalData = () => {
    setProgress(prev => ({ ...prev, name: personalForm.name, email: personalForm.email }));
    setShowPersonalData(false);
    setToast("Perfil atualizado!");
    setTimeout(() => setToast(null), 3000);
  };

  const saveGoalsData = () => {
    setProgress(prev => ({ ...prev, weightGoal: goalsForm.weightGoal, waterGoal: goalsForm.waterGoal }));
    setShowGoalsEdit(false);
    setToast("Metas atualizadas!");
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTask = (id: string) => {
    const task = progress.tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setToast(ui.task_done_toast);
      setAnimatingTask(id);
      setTimeout(() => setAnimatingTask(null), 1000);
      setTimeout(() => setToast(null), 3000);
    }
    setProgress(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  useEffect(() => {
    const allDone = progress.tasks.every(t => t.completed);
    if (allDone && !progress.phaseCompletedAlertShown) {
      const n: Notification = {
        id: Date.now().toString(),
        title: { pt: "Fase Dominada!", en: "Phase Mastered!" },
        message: { pt: "Você atingiu todas as metas! Pronto para o próximo nível?", en: "You've reached all goals! Ready for the next level?" },
        date: "Hoje",
        read: false
      };
      setProgress(prev => ({ ...prev, phaseCompletedAlertShown: true, notifications: [n, ...prev.notifications] }));
      setShowNextPhaseModal(true);
    }
  }, [progress.tasks]);

  const advancePhase = () => {
    let nextPhase = progress.currentPhase;
    if (progress.currentPhase === DietPhase.LOW_CARB) nextPhase = DietPhase.KETOGENIC;
    else if (progress.currentPhase === DietPhase.KETOGENIC) nextPhase = DietPhase.CARNIVORE;
    setProgress(prev => ({ ...prev, currentPhase: nextPhase, phaseCompletedAlertShown: false, tasks: prev.tasks.map(t => ({ ...t, completed: false })) }));
    setShowNextPhaseModal(false);
  };

  const calculateNutrition = (food: FoodItem) => {
    let mult = 1;
    if (portionType === 'cup' && food.servingWeights?.cup) mult = food.servingWeights.cup / 100;
    if (portionType === 'unit' && food.servingWeights?.unit) mult = food.servingWeights.unit / 100;
    return {
      carbs: (food.carbs * mult).toFixed(1),
      calories: (food.calories * mult).toFixed(0),
      protein: (food.protein * mult).toFixed(1),
      fat: (food.fat * mult).toFixed(1)
    };
  };

  const hasUnread = progress.notifications.some(n => !n.read);

  const renderDieta = () => (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in slide-in-from-left duration-500">
      <section className="text-center">
        <h2 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">{ui.current_phase}: {phases[progress.currentPhase]}</h2>
        <h1 className="text-3xl font-black mb-4">{subPhases[progress.currentSubPhase]}</h1>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <p className="text-gray-400 text-sm">{objectives[progress.currentPhase]}</p>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase">Limite de Carbos</span>
          <span className="text-3xl font-black text-white">{dietConfigs[progress.currentPhase].limit}g</span>
        </div>
      </section>
      <section className="bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl italic uppercase tracking-tighter">{ui.weekly_goals}</h3>
          <span className="text-red-500 text-xs font-black bg-red-500/10 px-4 py-1.5 rounded-full">{progress.tasks.filter(t => t.completed).length}/{progress.tasks.length}</span>
        </div>
        <div className="space-y-4">
          {progress.tasks.map(task => (
            <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${task.completed ? 'bg-red-950/20 border border-red-900/30' : 'bg-zinc-800/50 border border-transparent hover:bg-zinc-800'} ${animatingTask === task.id ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
              <div className={`mr-4 transition-all duration-300 ${task.completed ? 'animate-check' : ''}`}>
                {task.completed ? <CheckCircle2 className="text-red-500" size={24} /> : <Circle className="text-zinc-600" size={24} />}
              </div>
              <span className={`font-bold flex-1 text-sm ${task.completed ? 'text-zinc-600 line-through' : 'text-white'}`}>{taskLabels[task.titleKey as keyof typeof taskLabels]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderProgresso = () => (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in slide-in-from-right duration-500">
      <h1 className="text-4xl font-black italic tracking-tighter">{ui.nav_progress}</h1>
      <section className="bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 shadow-2xl overflow-hidden">
        <h3 className="font-bold text-lg mb-8 flex items-center space-x-2 uppercase tracking-widest text-zinc-400">
          <TrendingDown className="text-red-500" size={20} /> <span>Histórico de Peso</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progress.weightHistory}>
              <defs><linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <ChartTooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px' }} />
              <ReferenceLine y={progress.weightGoal} stroke="#ef4444" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="weight" stroke="#ef4444" strokeWidth={4} fill="url(#colorWeight)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 flex justify-between bg-black/40 p-6 rounded-3xl border border-zinc-800/50">
           <div className="text-center"><p className="text-[10px] text-zinc-500 font-black uppercase">Atual</p><p className="text-2xl font-black">{progress.currentWeight}kg</p></div>
           <div className="text-center"><p className="text-[10px] text-zinc-500 font-black uppercase">Meta</p><p className="text-2xl font-black text-red-500">{progress.weightGoal}kg</p></div>
        </div>
      </section>
    </div>
  );

  const renderExplorar = () => (
    <div className="bg-black min-h-screen pb-32 animate-in fade-in duration-500 overflow-y-auto">
      <div className="p-6 pb-4 flex items-center">
        <button onClick={() => setActiveTab('dieta')} className="mr-4 text-zinc-400 p-2 hover:bg-zinc-900 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{ui.back}</span>
      </div>
      <h1 className="px-6 text-4xl font-black mb-10 italic uppercase tracking-tighter">Protocolos</h1>
      <div className="p-6 space-y-12">
        <section className="space-y-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight">{ui.food_table}</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'protein', 'vegetable', 'fruit', 'dairy', 'fat', 'grain'].map(cat => (
                <button key={cat} onClick={() => setFoodFilter(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${foodFilter === cat ? 'bg-red-600 border-red-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                  {cat === 'all' ? ui.category_all : ui[`category_${cat}` as keyof typeof ui] || cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input type="text" placeholder={ui.search_placeholder} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 font-medium text-sm" value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3">
            {FOOD_DATABASE.filter(f => (foodFilter === 'all' || f.category === foodFilter) && f.name[progress.language].toLowerCase().includes(foodSearch.toLowerCase())).map((food, i) => (
              <div key={i} onClick={() => setSelectedFood(food)} className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 hover:border-red-500/40 transition-all active:scale-[0.98] group animate-in slide-in-from-top-4" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex flex-col"><span className="font-bold text-sm group-hover:text-red-500">{food.name[progress.language]}</span><span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{food.category}</span></div>
                <div className="flex flex-col items-end"><span className={`font-black ${food.carbs <= 5 ? 'text-green-500' : food.carbs <= 15 ? 'text-orange-500' : 'text-red-500'}`}>{food.carbs}g</span><span className="text-[8px] text-zinc-600 uppercase">/100g</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="flex flex-col items-center pt-8">
        <div className="w-32 h-32 rounded-full border-4 border-red-600 p-1 group relative overflow-hidden active:scale-95 transition-transform" onClick={() => fileInputRef.current?.click()}>
          <img src={progress.profileImage || "https://images.unsplash.com/photo-1594179633211-69d6994a274c?q=80&w=200&auto=format&fit=crop"} className="w-full h-full rounded-full object-cover" alt="Profile" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} /></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-lg">PRO</div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProgress(prev => ({ ...prev, profileImage: reader.result as string }));
            reader.readAsDataURL(file);
          }
        }} />
        <h2 className="mt-4 text-2xl font-black">{progress.name}</h2>
        <p className="text-zinc-500 text-sm">{progress.email}</p>
      </div>
      <section className="space-y-4">
        <h3 className="text-red-500 font-black text-xs tracking-[0.2em] uppercase">{ui.my_goals}</h3>
        <div className="space-y-3">
          {[
            { id: 'weight', icon: DumbbellIcon, label: ui.weight_goal, val: progress.weightGoal + 'kg', tip: 'Reduz o estresse inflamatório e melhora a flexibilidade metabólica.' },
            { id: 'water', icon: Droplet, label: ui.water_goal, val: progress.waterGoal + 'L/dia', tip: 'Essencial para a queima de gordura e eliminação de corpos cetônicos.' }
          ].map(g => (
            <div 
              key={g.id} 
              onMouseEnter={() => setGoalTooltip(g.id as any)} 
              onMouseLeave={() => setGoalTooltip(null)} 
              onClick={() => {
                setGoalsForm({ weightGoal: progress.weightGoal, waterGoal: progress.waterGoal });
                setShowGoalsEdit(true);
              }}
              className="flex items-center bg-zinc-900/50 border border-zinc-800/50 p-5 rounded-3xl space-x-4 hover:border-red-500/30 cursor-pointer transition-all relative active:scale-[0.98]"
            >
              <div className="bg-red-500/10 p-3 rounded-2xl"><g.icon className="text-red-500" size={24} /></div>
              <div><p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{g.label}</p><p className="text-lg font-black">{g.val}</p></div>
              {goalTooltip === g.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-zinc-800 p-4 rounded-2xl border border-red-500/30 text-xs text-zinc-300 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                   {g.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-red-500 font-black text-xs tracking-[0.2em] uppercase">{ui.settings}</h3>
        <div onClick={() => {
          setPersonalForm({ name: progress.name, email: progress.email });
          setShowPersonalData(true);
        }} className="flex items-center justify-between bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.98]">
          <div className="flex items-center space-x-4"><User size={22} className="text-red-500" /><span className="font-bold text-sm">{ui.personal_data}</span></div>
          <ChevronRight size={18} className="text-zinc-700" />
        </div>
        <div onClick={() => setShowNotifications(true)} className="flex items-center justify-between bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.98]">
          <div className="flex items-center space-x-4"><Bell size={22} className="text-red-500" /><span className="font-bold text-sm">{ui.notifications}</span></div>
          <div className="flex items-center space-x-2">
             {hasUnread && <span className="w-2 h-2 bg-red-600 rounded-full"></span>}
             <ChevronRight size={18} className="text-zinc-700" />
          </div>
        </div>
        <div onClick={onOpenAdmin} className="flex items-center justify-between bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.98]">
          <div className="flex items-center space-x-4"><Settings size={22} className="text-red-500" /><span className="font-bold text-sm">Painel Administrativo</span></div>
          <ChevronRight size={18} className="text-zinc-700" />
        </div>
      </section>
      <button className="w-full bg-zinc-900 border border-zinc-800 text-zinc-500 py-5 rounded-3xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all hover:text-white">{ui.sign_out}</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[500] bg-red-600 text-white px-8 py-4 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">{toast}</div>}
      
      {/* Modal Edição de Metas */}
      {showGoalsEdit && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Editar Metas</h2>
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Meta de Peso (kg)</label>
                <div className="relative">
                   <DumbbellIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                   <input 
                    type="number" 
                    value={goalsForm.weightGoal} 
                    onChange={e => setGoalsForm({...goalsForm, weightGoal: Number(e.target.value)})}
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 font-bold"
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Meta de Água (L/dia)</label>
                <div className="relative">
                   <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                   <input 
                    type="number" 
                    step="0.1"
                    value={goalsForm.waterGoal} 
                    onChange={e => setGoalsForm({...goalsForm, waterGoal: Number(e.target.value)})}
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 font-bold"
                   />
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowGoalsEdit(false)} className="flex-1 bg-zinc-800 py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95">Cancelar</button>
              <button onClick={saveGoalsData} className="flex-1 bg-red-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-lg">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edição Dados Pessoais */}
      {showPersonalData && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Dados Pessoais</h2>
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome</label>
                <input 
                  type="text" 
                  value={personalForm.name} 
                  onChange={e => setPersonalForm({...personalForm, name: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:border-red-500 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-mail</label>
                <input 
                  type="email" 
                  value={personalForm.email} 
                  onChange={e => setPersonalForm({...personalForm, email: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:border-red-500 font-bold"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowPersonalData(false)} className="flex-1 bg-zinc-800 py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95">Cancelar</button>
              <button onClick={savePersonalData} className="flex-1 bg-red-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 shadow-lg">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showNextPhaseModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-zinc-900 border-2 border-red-500/50 p-8 rounded-[3rem] w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
              <Trophy size={64} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl font-black italic mb-6">Fase Concluída!</h2>
              <div className="bg-black/40 p-5 rounded-3xl text-left space-y-3 mb-8">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Resumo do Nível</p>
                <div className="flex justify-between"><span className="text-xs text-zinc-400">Peso Atual:</span><span className="text-xs font-black">{progress.currentWeight}kg</span></div>
                <div className="flex justify-between"><span className="text-xs text-zinc-400">Metas Semana:</span><span className="text-xs font-black text-green-500">4/4</span></div>
              </div>
              <button onClick={advancePhase} className="w-full bg-red-600 py-5 rounded-3xl font-black uppercase tracking-widest text-sm active:scale-95 shadow-lg">{ui.advance_now}</button>
           </div>
        </div>
      )}

      {selectedFood && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] w-full max-w-sm p-8 shadow-2xl relative">
            <button onClick={() => setSelectedFood(null)} className="absolute top-8 right-8 p-3 bg-zinc-800 rounded-full active:scale-90"><X size={20}/></button>
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter">{selectedFood.name[progress.language]}</h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-8">{selectedFood.category}</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {Object.entries(calculateNutrition(selectedFood)).map(([k, v]) => (
                <div key={k} className="bg-black/40 p-4 rounded-3xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">{k}</p>
                  <p className="text-xl font-black text-red-500">{v}{k === 'calories' ? '' : 'g'}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex bg-black rounded-2xl p-1.5 border border-zinc-800">
                {['100g', 'cup', 'unit'].map(p => {
                  const available = p === '100g' || (p === 'cup' && selectedFood.servingWeights?.cup) || (p === 'unit' && selectedFood.servingWeights?.unit);
                  return available && (
                    <button key={p} onClick={() => setPortionType(p as any)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${portionType === p ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>{p}</button>
                  );
                })}
              </div>
              <button onClick={() => { setProgress(prev => ({...prev, carbsConsumed: prev.carbsConsumed + Number(calculateNutrition(selectedFood).carbs)})); setSelectedFood(null); setToast(ui.added_toast); setTimeout(() => setToast(null), 3000); }} className="w-full bg-red-600 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2"><Plus size={18} /><span>Registrar</span></button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 bg-black z-[500] flex flex-col animate-in fade-in duration-300">
           <div className="p-6 border-b border-zinc-800 flex items-center bg-black/80 backdrop-blur">
              <button onClick={() => setShowNotifications(false)} className="mr-4 text-zinc-400 p-2 hover:bg-zinc-900 rounded-full transition-colors"><ChevronLeft size={24} /></button>
              <h2 className="text-xl font-bold">Notificações</h2>
           </div>
           <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {progress.notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600"><Bell size={48} className="mb-4 opacity-20" /><span>Nenhuma notificação por enquanto.</span></div>
              ) : (
                progress.notifications.map(n => (
                  <div key={n.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative">
                    <div className="flex items-center space-x-3 mb-2"><Trophy size={18} className="text-red-500" /><h4 className="font-black text-xs uppercase tracking-widest">{n.title[progress.language]}</h4></div>
                    <p className="text-sm text-zinc-400 leading-snug">{n.message[progress.language]}</p>
                    <span className="absolute top-6 right-6 text-[10px] text-zinc-600 font-bold">{n.date}</span>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      <main className="flex-1 max-w-md mx-auto w-full overflow-y-auto">
        <div key={activeTab} className="transition-opacity duration-300">
          {activeTab === 'dieta' && renderDieta()}
          {activeTab === 'progresso' && renderProgresso()}
          {activeTab === 'explorar' && renderExplorar()}
          {activeTab === 'perfil' && renderProfile()}
        </div>
      </main>

      <nav className="bg-black/90 backdrop-blur-xl border-t border-zinc-900 py-4 px-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {[
            { id: 'dieta', icon: Utensils, label: ui.nav_diet },
            { id: 'explorar', icon: Compass, label: ui.nav_explore },
            { id: 'progresso', icon: BarChart2, label: ui.nav_progress },
            { id: 'perfil', icon: User, label: ui.nav_profile },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1 relative transition-all active:scale-75 ${activeTab === tab.id ? 'text-red-500' : 'text-zinc-600'}`}>
              <tab.icon size={26} className={activeTab === tab.id ? 'fill-current' : ''} />
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
              {tab.id === 'perfil' && hasUnread && <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// --- Main ---

const App: React.FC = () => {
  const [onboarded, setOnboarded] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [dietConfigs, setDietConfigs] = useState<DietConfigs>(DIET_CONFIG);
  const [progress, setProgress] = useState<UserProgress>({
    language: 'pt',
    currentPhase: DietPhase.LOW_CARB,
    currentSubPhase: SubPhase.START,
    carbsConsumed: 0,
    name: 'Felipe Augusto',
    email: 'felipe.augusto@email.com',
    phone: '',
    weightGoal: 80,
    currentWeight: 84,
    waterGoal: 3,
    weightHistory: [
      { date: 'Set', weight: 89 }, { date: 'Out', weight: 87 }, { date: 'Nov', weight: 86.5 }, { date: 'Dez', weight: 85 }, { date: 'Hoje', weight: 84 }
    ],
    notifications: [],
    phaseCompletedAlertShown: false,
    tasks: [
      { id: '1', titleKey: 't1', completed: false },
      { id: '2', titleKey: 't2', completed: true },
      { id: '3', titleKey: 't3', completed: false },
      { id: '4', titleKey: 't4', completed: false }
    ]
  });

  return (
    <div className="antialiased">
      {!onboarded ? (
        <OnboardingScreen language={progress.language} setLanguage={(l) => setProgress(p => ({...p, language: l}))} onComplete={() => setOnboarded(true)} />
      ) : (
        <>
          <Dashboard progress={progress} setProgress={setProgress} dietConfigs={dietConfigs} onOpenAdmin={() => setShowAdmin(true)} />
          {showAdmin && <AdminPanel language={progress.language} dietConfigs={dietConfigs} onSave={(c) => { setDietConfigs(c); setShowAdmin(false); }} onBack={() => setShowAdmin(false)} />}
        </>
      )}
    </div>
  );
};

export default App;
