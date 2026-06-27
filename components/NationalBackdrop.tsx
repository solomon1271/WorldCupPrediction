import { getFlagImageUrl } from "@/lib/team-showcase";

const floatingFlags = [
  { code: "ar", position: "top-left", delay: "0s" },
  { code: "fr", position: "top-right", delay: "1.2s" },
  { code: "gb-eng", position: "mid-left", delay: "2.4s" },
  { code: "es", position: "mid-right", delay: "0.8s" },
  { code: "de", position: "lower-left", delay: "1.8s" },
  { code: "pt", position: "lower-right", delay: "2.8s" },
  { code: "us", position: "bottom-left", delay: "1.4s" },
  { code: "br", position: "bottom-right", delay: "2.1s" },
  { code: "mx", position: "float-a", delay: "0.5s" },
  { code: "nl", position: "float-b", delay: "1.6s" },
  { code: "jp", position: "float-c", delay: "2.3s" },
  { code: "sn", position: "float-d", delay: "0.9s" }
] as const;

export function NationalBackdrop() {
  return (
    <div className="national-backdrop" aria-hidden="true">
      <div className="national-backdrop__pitch" />
      <div className="national-backdrop__glow national-backdrop__glow--left" />
      <div className="national-backdrop__glow national-backdrop__glow--right" />
      {floatingFlags.map((flag) => (
        <div
          className={`national-backdrop__crest national-backdrop__crest--${flag.position}`}
          key={flag.code}
          style={{ animationDelay: flag.delay }}
        >
          <img
            alt=""
            className="national-backdrop__image"
            src={getFlagImageUrl(flag.code)}
          />
        </div>
      ))}
    </div>
  );
}
