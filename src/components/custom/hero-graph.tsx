export const HeroGraph = () => {
  return (
    <svg className="absolute bottom-0 left-0 right-0 h-full w-full" preserveAspectRatio="none">
      <path
        className="opacity-40"
        d="M0,128 L20,100 L40,110 L60,80 L80,90 L100,60 L120,70 L140,40 L160,50 L180,20 L200,30 L220,10 L240,20 L260,5 L280,15 L300,5 L320,20 L340,10 L400,0 V128 H0 Z"
        fill="url(#gradient)"
      ></path>
      <path
        d="M0,128 L20,100 L40,110 L60,80 L80,90 L100,60 L120,70 L140,40 L160,50 L180,20 L200,30 L220,10 L240,20 L260,5 L280,15 L300,5 L320,20 L340,10 L400,0"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
      ></path>
      <defs>
        <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" className="[stop-color:var(--primary)] [stop-opacity:0.5]" />
          <stop offset="100%" className="[stop-color:var(--primary)] [stop-opacity:0]" />
        </linearGradient>
      </defs>
    </svg>
  );
};
