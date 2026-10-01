// Soft graph paper in the center, leaving the study stationery margins clear.
// CSS reveals the grid once on arrival; reduced motion keeps it static.
export function LandingBackdrop({ layout = 'split', stationery = true }: { layout?: 'centered' | 'split'; stationery?: boolean }) {
  return <div aria-hidden="true" className={`landing-backdrop landing-backdrop--${layout}`}>
    <div className="landing-center-grid" />
    {stationery && <>
    <svg className="landing-side-note landing-side-note--left" viewBox="0 0 240 340" fill="none" focusable="false">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-8 112 130)">
          <rect x="35" y="35" width="146" height="190" rx="14" fill="var(--cd-paper)" />
          <path d="M148 35v29h33M60 83h62M60 104h96M60 121h83M60 138h96M60 180h62M60 197h81" />
          <path className="landing-ink" pathLength="1" d="M57 152c24-3 70-2 99 0" strokeWidth="4" opacity=".5" />
          <circle cx="142" cy="81" r="10" />
          <path d="m138 81 3 3 5-6" />
        </g>
        <path className="landing-ink landing-ink--later" pathLength="1" d="M62 256c-23 6-18 29 9 28 36-1 53-30 111-22m-12-7 12 7-11 8" />
        <path d="m17 138 3-6 3 6 6 3-6 3-3 6-3-6-6-3 6-3Zm180-109v10m-5-5h10M43 310h19" opacity=".55" />
      </g>
    </svg>
    <svg className="landing-side-note landing-side-note--right" viewBox="0 0 240 340" fill="none" focusable="false">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(9 125 150)">
          <rect x="64" y="75" width="135" height="162" rx="14" fill="var(--cd-paper)" />
          <rect x="47" y="58" width="135" height="162" rx="14" fill="var(--cd-paper)" />
          <rect x="30" y="41" width="135" height="162" rx="14" fill="var(--cd-paper)" />
          <path d="M52 63h31M52 145h89M52 161h74" opacity=".6" />
          <path className="landing-ink" pathLength="1" d="M89 91c0-17 26-17 26 0 0 11-13 9-13 22" strokeWidth="2.4" />
          <circle cx="102" cy="123" r="1.6" fill="currentColor" />
          <path className="landing-ink landing-ink--later" pathLength="1" d="M52 179h54" strokeWidth="4" opacity=".5" />
        </g>
        <path className="landing-ink landing-ink--later" pathLength="1" d="M90 280c35 9 61-7 62-29m-7 9 7-9 6 10" />
        <path d="M194 26v12m-6-6h12m-5 231 3-6 3 6 6 3-6 3-3 6-3-6-6-3 6-3ZM41 295h17" opacity=".55" />
      </g>
    </svg>
    </>}
  </div>
}
