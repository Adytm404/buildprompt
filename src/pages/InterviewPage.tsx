import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, LogOut, RefreshCw, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProcessingScreen } from '@/components/feedback/ProcessingScreen';
import { ProjectNotFound } from '@/components/feedback/ProjectNotFound';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { ChoiceCard } from '@/components/interview/ChoiceCard';
import { InterviewNavigation } from '@/components/interview/InterviewNavigation';
import { MultiChoice } from '@/components/interview/MultiChoice';
import { QuestionLayout } from '@/components/interview/QuestionLayout';
import { QuestionProgress } from '@/components/interview/QuestionProgress';
import { TextQuestion } from '@/components/interview/TextQuestion';
import { LoadingSequence } from '@/components/feedback/LoadingSequence';
import { useProject } from '@/context/ProjectContext';
import { projectInterviewNavItems } from '@/data/navigation';
import { isAIConfigured } from '@/lib/aiConfig';
import { describeAIError } from '@/lib/aiError';
import { deriveProjectName, cn } from '@/lib/utils';
import {
  computeCompletenessFrom,
  fallbackQuestions,
  filterVisible,
  getPreselectedIds,
  isQuestionAnswered,
} from '@/services/interviewService';
import { generateFollowUps, generateInterview } from '@/services/ai/aiInterview';
import type { Answers, Question } from '@/types';

const COMPLETION_STEPS = [
  'Memahami seluruh jawaban Anda...',
  'Menyusun struktur aplikasi...',
  'Menulis PRD teknis...',
  'Menyiapkan prompt untuk koding AI...',
];

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export function InterviewPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, saveInterview, completeInterview, updateProject } = useProject();
  const project = projectId ? getProject(projectId) : undefined;

  const [answers, setAnswers] = useState<Answers>(() => ({ ...(project?.answers ?? {}) }));
  const [step, setStep] = useState<number>(() => project?.currentStep ?? 0);
  const [questions, setQuestions] = useState<Question[]>(() => project?.questions ?? []);
  const [ready, setReady] = useState<boolean>(() => Boolean(project?.questions?.length));
  const [aiFailed, setAiFailed] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const finishedRef = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);
  const lockedRef = useRef(false);
  const followUpRef = useRef(false);
  const loadRef = useRef(false);

  const visible = useMemo(() => filterVisible(questions, answers), [questions, answers]);
  const isComplete = ready && visible.length > 0 && step >= visible.length;
  const current: Question | undefined = visible[step];
  const navItems = useMemo(() => (project ? projectInterviewNavItems(project.id) : []), [project]);

  useEffect(() => {
    if (step > visible.length) setStep(visible.length);
  }, [step, visible.length]);

  const loadQuestions = useCallback(
    async (idea: string, projectIdValue: string, force: boolean) => {
      setReady(false);
      setAiFailed(false);
      setLoadFailed(false);
      setErrorMessage(null);
      try {
        const result = await generateInterview(idea);
        if (!result || result.questions.length === 0) {
          throw new Error('AI tidak mengembalikan pertanyaan yang valid.');
        }
        setQuestions(result.questions);
        updateProject(projectIdValue, {
          questions: result.questions,
          analysis: result.analysis,
          aiGenerated: true,
          currentStep: 0,
          followUpsDone: false,
        });
        if (force) setStep(0);
        setReady(true);
      } catch (error) {
        if (force) setStep(0);
        setErrorMessage(
          isAIConfigured()
            ? describeAIError(error)
            : 'API key belum diisi. Tambahkan VITE_AI_API_KEY di file .env lalu restart.',
        );
        setLoadFailed(true);
      }
    },
    [updateProject],
  );

  useEffect(() => {
    if (!project) return;
    if (project.questions?.length) {
      setReady(true);
      return;
    }
    if (loadRef.current) return;
    loadRef.current = true;
    void loadQuestions(project.idea, project.id, false);
  }, [project, loadQuestions]);

  const saveRef = useRef(saveInterview);
  saveRef.current = saveInterview;
  const projectIdValue = project?.id;

  useEffect(() => {
    if (!projectIdValue || finishedRef.current || !ready) return;
    saveRef.current(projectIdValue, answers, Math.min(step, visible.length));
  }, [answers, step, visible.length, projectIdValue, ready]);

  const setAnswer = useCallback((id: string, value: string | string[]) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }, []);

  useEffect(() => {
    if (!current || current.type !== 'multiple') return;
    if (answers[current.id] !== undefined) return;
    const preselected = getPreselectedIds(current);
    if (preselected.length > 0) setAnswer(current.id, preselected);
  }, [current, answers, setAnswer]);

  useEffect(() => {
    window.clearTimeout(advanceTimer.current);
    lockedRef.current = false;
  }, [step]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  useEffect(() => {
    if (!project || !ready || followUpRef.current || project.followUpsDone) return;
    if (questions.length === 0 || aiFailed) return;
    const answeredCount = questions.filter((question) => isQuestionAnswered(question, answers)).length;
    if (answeredCount < Math.ceil(questions.length / 2)) return;

    followUpRef.current = true;
    const ids = questions.map((question) => question.id);
    generateFollowUps(project.idea, answers, ids)
      .then((extras) => {
        const merged = extras.length > 0 ? [...questions, ...extras] : questions;
        if (extras.length > 0) setQuestions(merged);
        updateProject(project.id, { questions: merged, followUpsDone: true });
      })
      .catch(() => {
        updateProject(project.id, { followUpsDone: true });
      });
  }, [answers, questions, ready, aiFailed, project, updateProject]);

  const goNext = useCallback(() => {
    const question = visible[step];
    if (!question) return;
    window.clearTimeout(advanceTimer.current);
    lockedRef.current = false;
    if (question.type === 'confirm' && answers[question.id] === 'fix') {
      const revision = String(answers.idea_revision ?? '').trim();
      if (revision && project) {
        updateProject(project.id, { idea: revision, name: deriveProjectName(revision) });
      }
    }
    setStep((value) => value + 1);
  }, [answers, visible, step, project, updateProject]);

  const goBack = useCallback(() => {
    window.clearTimeout(advanceTimer.current);
    lockedRef.current = false;
    setStep((value) => Math.max(0, value - 1));
  }, []);

  const selectSingle = useCallback(
    (id: string) => {
      if (!current) return;
      setAnswer(current.id, id);
      if (current.autoAdvance) {
        window.clearTimeout(advanceTimer.current);
        lockedRef.current = true;
        advanceTimer.current = window.setTimeout(() => {
          lockedRef.current = false;
          setStep((value) => value + 1);
        }, 320);
      }
    },
    [current, setAnswer],
  );

  const toggleMulti = useCallback(
    (id: string) => {
      if (!current) return;
      const currentValue = Array.isArray(answers[current.id]) ? (answers[current.id] as string[]) : [];
      setAnswer(
        current.id,
        currentValue.includes(id) ? currentValue.filter((item) => item !== id) : [...currentValue, id],
      );
    },
    [answers, current, setAnswer],
  );

  const needsRevision = Boolean(current && current.type === 'confirm' && answers[current.id] === 'fix');
  const canProceed = Boolean(
    current &&
      isQuestionAnswered(current, answers) &&
      !(needsRevision && String(answers.idea_revision ?? '').trim().length === 0),
  );

  const stateRef = useRef({ canProceed: false, goNext, selectSingle, toggleMulti, current });
  stateRef.current = { canProceed, goNext, selectSingle, toggleMulti, current };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = stateRef.current;
      if (!state.current || lockedRef.current) return;
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (event.key === 'Enter') {
        if (typing && state.current.type !== 'text' && state.current.type !== 'confirm') return;
        event.preventDefault();
        if (state.canProceed) state.goNext();
        return;
      }

      if (typing || !state.current.options) return;

      const key = event.key.toLowerCase();
      const letterIndex = LETTERS.indexOf(key);
      const numberIndex = Number.parseInt(event.key, 10) - 1;
      const index = letterIndex >= 0 ? letterIndex : Number.isNaN(numberIndex) ? -1 : numberIndex;
      const option = index >= 0 ? state.current.options[index] : undefined;
      if (!option) return;
      if (state.current.type === 'multiple') state.toggleMulti(option.id);
      else state.selectSingle(option.id);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!project || !project.completed) return;
    const target =
      project.status === 'generated' ? `/project/${project.id}/prompt` : `/project/${project.id}/review`;
    navigate(target, { replace: true });
  }, [project, navigate]);

  const exit = () => {
    if (project) saveInterview(project.id, answers, step);
    navigate('/projects');
  };

  const continueWithLocal = useCallback(() => {
    if (!project) return;
    setQuestions(fallbackQuestions(project.idea));
    setAiFailed(true);
    setLoadFailed(false);
    setErrorMessage(null);
    setReady(true);
  }, [project]);

  const retryLoad = useCallback(() => {
    if (!project) return;
    loadRef.current = true;
    void loadQuestions(project.idea, project.id, true);
  }, [project, loadQuestions]);

  const regenerate = async () => {
    if (!project) return;
    if (!window.confirm('Buat ulang pertanyaan? Jawaban saat ini akan dihapus.')) return;
    setRegenerating(true);
    setAnswers({});
    followUpRef.current = false;
    await loadQuestions(project.idea, project.id, true);
    setRegenerating(false);
  };

  if (!project) {
    return <ProjectNotFound title="Wawancara tidak ditemukan" />;
  }

  if (loadFailed && !ready) {
    return (
      <SidebarLayout projectName={project.name} projectItems={navItems} activeId="interview" title="Wawancara">
        <div className="flex min-h-[75vh] items-center justify-center px-4 sm:px-6">
          {/* Error Card: Outer R = 28px, Padding = 32px */}
          <div className="relative overflow-hidden rounded-[28px] border border-amber-500/25 bg-[#0E0F17]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl max-w-md w-full text-center text-white">
            {/* Inner R = 28px - 12px = 16px */}
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
              <AlertTriangle size={24} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-snug">AI belum bisa diakses</h1>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/60">{errorMessage}</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={retryLoad}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-md"
              >
                <RefreshCw size={14} />
                <span>Coba lagi</span>
              </button>
              <button
                type="button"
                onClick={continueWithLocal}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
              >
                <span>Lanjut dengan pertanyaan dasar</span>
              </button>
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-white/35">
              Pertanyaan wawancara dibuat oleh AI berdasarkan ide Anda. Tanpa AI, sistem memakai pertanyaan umum.
            </p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!ready) {
    return (
      <SidebarLayout projectName={project.name} projectItems={navItems} activeId="interview" title="Wawancara">
        <div className="flex min-h-[75vh] items-center justify-center px-4 sm:px-6">
          <LoadingSequence
            steps={['Menganalisis ide Anda...', 'Menyusun pertanyaan yang relevan...']}
            className="w-full max-w-md"
          />
        </div>
      </SidebarLayout>
    );
  }

  if (isComplete) {
    return (
      <ProcessingScreen
        steps={COMPLETION_STEPS}
        stepDuration={900}
        onComplete={() => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          completeInterview(project.id);
          navigate(`/project/${project.id}/prompt`, { replace: true });
        }}
      />
    );
  }

  const percent = computeCompletenessFrom(questions, answers);

  const renderQuestion = (question: Question) => {
    if (question.type === 'confirm') {
      const selected = answers[question.id];
      return (
        <>
          <div className="grid gap-3 sm:max-w-md">
            {question.options?.map((option, index) => (
              <ChoiceCard
                key={option.id}
                option={option}
                selected={selected === option.id}
                shortcut={String.fromCharCode(65 + index)}
                onClick={() => setAnswer(question.id, option.id)}
              />
            ))}
          </div>
          {selected === 'fix' ? (
            <div className="mt-4 sm:max-w-xl">
              <TextQuestion
                value={String(answers.idea_revision ?? '')}
                onChange={(value) => setAnswer('idea_revision', value)}
                placeholder={question.placeholder}
              />
            </div>
          ) : null}
        </>
      );
    }

    if (question.type === 'multiple') {
      const value = Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : [];
      return <MultiChoice question={question} value={value} onChange={(next) => setAnswer(question.id, next)} />;
    }

    if (question.type === 'text') {
      return (
        <TextQuestion
          value={String(answers[question.id] ?? '')}
          onChange={(value) => setAnswer(question.id, value)}
          placeholder={question.placeholder}
          className="sm:max-w-xl"
        />
      );
    }

    return (
      <div className={cn('grid gap-3', question.columns === 2 ? 'sm:grid-cols-2' : 'sm:max-w-md')}>
        {question.options?.map((option, index) => (
          <ChoiceCard
            key={option.id}
            option={option}
            selected={answers[question.id] === option.id}
            design={Boolean(option.visual)}
            shortcut={String.fromCharCode(65 + index)}
            onClick={() => selectSingle(option.id)}
          />
        ))}
      </div>
    );
  };

  const nextDisabled = !canProceed;
  const showNext = Boolean(current && (current.type !== 'single' || !current.autoAdvance));

  return (
    <SidebarLayout
      projectName={project.name}
      projectItems={navItems}
      activeId="interview"
      title="Wawancara"
    >
      <div className="flex flex-col min-h-full text-white">
        {/* Dark Toolbar */}
        <div className="border-b border-white/10 bg-[#0B0C10]/80 px-4 py-3 sm:px-8 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <QuestionProgress
              current={Math.min(step + 1, visible.length)}
              total={visible.length}
              percent={percent}
            />
            <div className="flex items-center gap-2 shrink-0">
              {aiFailed ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                  <WifiOff size={11} />
                  Mode lokal
                </span>
              ) : null}
              <button
                type="button"
                onClick={regenerate}
                disabled={regenerating}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white transition"
                aria-label="Buat ulang pertanyaan"
                title="Buat ulang pertanyaan"
              >
                <RefreshCw size={13} className={cn(regenerating && 'animate-spin')} />
              </button>
              <button
                type="button"
                onClick={exit}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Simpan &amp; keluar</span>
                <span className="sm:hidden">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Area (Centered Studio Card) */}
        <div className="flex flex-1 items-center justify-center py-8 sm:py-12 px-4 sm:px-8">
          {/* Studio Question Card (Outer R = 28px, Padding = 36px) */}
          <div className="relative w-full max-w-[740px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0E0F16]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <QuestionLayout
                      label={current.label}
                      contextual={current.contextual}
                      title={current.title}
                      helper={current.helper}
                    >
                      {renderQuestion(current)}
                    </QuestionLayout>

                    <InterviewNavigation
                      onBack={step > 0 ? goBack : undefined}
                      onNext={goNext}
                      showNext={showNext}
                      nextDisabled={nextDisabled}
                      hint={current.options && current.type === 'single' ? 'Pilih untuk lanjut' : 'Tekan Enter ↵'}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
