import { LoadingSequence } from '@/components/feedback/LoadingSequence';

interface ProcessingScreenProps {
  steps: string[];
  onComplete: () => void;
  stepDuration?: number;
}

export function ProcessingScreen({ steps, onComplete, stepDuration = 950 }: ProcessingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090C]/95 backdrop-blur-2xl px-6 text-white">
      <LoadingSequence steps={steps} stepDuration={stepDuration} onComplete={onComplete} className="w-full max-w-md" />
    </div>
  );
}
