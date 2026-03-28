const logos = [
  { name: "Argentina", src: "/logos/ARG.png", position: "top-left" },
  { name: "England", src: "/logos/ENG.png", position: "top-right" },
  { name: "France", src: "/logos/FRA.png", position: "mid-left" },
  { name: "Spain", src: "/logos/ESP.png", position: "mid-right" },
  { name: "Germany", src: "/logos/GER.png", position: "lower-left" },
  { name: "Portugal", src: "/logos/POR.png", position: "lower-right" },
  { name: "United States", src: "/logos/USA.png", position: "bottom-left" }
] as const;

export function NationalBackdrop() {
  return (
    <div className="national-backdrop" aria-hidden="true">
      {logos.map((logo) => (
        <div className={`national-backdrop__crest national-backdrop__crest--${logo.position}`} key={logo.name}>
          <img alt="" className="national-backdrop__image" src={logo.src} />
        </div>
      ))}
    </div>
  );
}
