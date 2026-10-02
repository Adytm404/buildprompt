import type { ReactNode } from 'react';

export function NextjsLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="90" fill="#000000" />
      <path
        d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.141 149.508 157.438Z"
        fill="url(#next-diag-grad)"
      />
      <rect x="115" y="54" width="12" height="72" fill="url(#next-vert-grad)" />
      <defs>
        <linearGradient id="next-diag-grad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="next-vert-grad" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TypeScriptLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="24" fill="#3178C6" />
      <path
        d="M72.2 46.8h42.6v9.8H99.1v49.8H87.9V56.6H72.2V46.8zM59.1 63.8c-2.8-1.5-6.2-2.5-10.2-2.5-6.4 0-10.8 3.1-10.8 8.1 0 4.5 3.3 7 9.8 9.6l3.4 1.4c10.4 4.1 15.6 9.4 15.6 18.2 0 11.2-9 18.6-23.7 18.6-7.8 0-14.4-2.1-19-5.7l3.8-8.8c3.9 3.1 9.4 4.9 15.2 4.9 7.4 0 11.8-3.4 11.8-8.7 0-4.9-3.6-7.4-10.7-10.3l-3.3-1.3C21.7 83.1 16.9 78 16.9 69.9c0-10.5 8.6-17.7 22.3-17.7 6.8 0 12.8 1.7 16.8 4.2l-3.1 7.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TailwindLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 33" className={className} fill="#38BDF8" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
      />
    </svg>
  );
}

export function SqliteLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sqlite-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003B57" />
          <stop offset="100%" stopColor="#0A527A" />
        </linearGradient>
        <linearGradient id="sqlite-top-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00A3E0" />
          <stop offset="100%" stopColor="#007BBB" />
        </linearGradient>
      </defs>
      <path
        d="M20 32 C20 18 38 12 64 12 C90 12 108 18 108 32 L108 96 C108 110 90 116 64 116 C38 116 20 110 20 96 Z"
        fill="url(#sqlite-body-grad)"
      />
      <ellipse cx="64" cy="32" rx="44" ry="18" fill="url(#sqlite-top-grad)" />
      <path d="M20 58 C20 72 38 78 64 78 C90 78 108 72 108 58" fill="none" stroke="#00A3E0" strokeWidth="5" />
      <path d="M20 84 C20 98 38 104 64 104 C90 104 108 98 108 84" fill="none" stroke="#00A3E0" strokeWidth="5" />
      <path d="M34 32 Q64 22 94 32" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
      <path d="M78 40 Q88 64 64 90 Q74 74 82 60" fill="#38BDF8" opacity="0.85" />
    </svg>
  );
}

export function ReactLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function PrismaLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.77 17.51L14.07 2.78C13.84 2.06 12.82 2.06 12.59 2.78L4.35 18.91C4.06 19.49 4.6 20.15 5.21 19.94L17.65 15.59C18.3 15.36 18.97 16.03 18.77 17.51Z"
        fill="#5A67D8"
      />
      <path
        d="M13.33 2.78L4.35 18.91C4.06 19.49 4.6 20.15 5.21 19.94L12.59 17.36V2.78H13.33Z"
        fill="#7F9CF5"
      />
    </svg>
  );
}

export interface TechItem {
  name: string;
  category: string;
  icon: ReactNode;
  borderHover: string;
}

export function getProjectTechStack(platform?: string): TechItem[] {
  if (platform === 'mobile') {
    return [
      {
        name: 'React Native',
        category: 'Framework',
        icon: <ReactLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
        borderHover: 'hover:border-cyan-400/50',
      },
      {
        name: 'TypeScript',
        category: 'Bahasa',
        icon: <TypeScriptLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
        borderHover: 'hover:border-blue-400/50',
      },
      {
        name: 'Tailwind CSS',
        category: 'Styling',
        icon: <TailwindLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
        borderHover: 'hover:border-sky-400/50',
      },
      {
        name: 'SQLite',
        category: 'Basis Data',
        icon: <SqliteLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
        borderHover: 'hover:border-sky-500/50',
      },
    ];
  }

  // Default Next.js App Router + SQLite stack
  return [
    {
      name: 'Next.js',
      category: 'Framework',
      icon: <NextjsLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
      borderHover: 'hover:border-white/50',
    },
    {
      name: 'TypeScript',
      category: 'Bahasa',
      icon: <TypeScriptLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
      borderHover: 'hover:border-blue-400/50',
    },
    {
      name: 'Tailwind',
      category: 'Styling',
      icon: <TailwindLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
      borderHover: 'hover:border-sky-400/50',
    },
    {
      name: 'SQLite',
      category: 'Basis Data',
      icon: <SqliteLogo className="w-6 h-6 sm:w-7 sm:h-7" />,
      borderHover: 'hover:border-cyan-400/50',
    },
  ];
}
