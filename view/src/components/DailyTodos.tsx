import { TipTap } from './TipTap';

export default function DailyTodos() {
  return (
    <TipTap
      key={1}
      initialContent={'Daily notes'}
      onUpdate={(content) => {
        console.log('Daily note setup');
      }}
      className="rounded-lg bg-custom-surface overflow-hidden max-h-[500px] shadow-xl w-full"
    />
  );
}
