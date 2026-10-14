import { Reveal } from '@/components/ui/Reveal';

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: 'left' | 'center';
  rule?: boolean;
  className?: string;
  /** Optional right-hand content on wide screens (e.g. a "see all" link). */
  aside?: React.ReactNode;
};

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'left',
  rule = true,
  className = '',
  aside,
}: Props) {
  const centred = align === 'center';

  return (
    <Reveal
      className={`flex flex-col gap-5 ${
        aside ? 'lg:flex-row lg:items-end lg:justify-between lg:gap-10' : ''
      } ${centred ? 'items-center text-center' : ''} ${className}`}
    >
      <div className={centred ? 'max-w-2xl' : 'max-w-2xl'}>
        <p className={`eyebrow ${centred ? 'justify-center' : ''}`}>{eyebrow}</p>
        <h2 className="section-title mt-3">{title}</h2>
        {rule && <div className={`rule-saffron mt-5 ${centred ? 'mx-auto' : ''}`} />}
        {lead && <p className="lead mt-5">{lead}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </Reveal>
  );
}
