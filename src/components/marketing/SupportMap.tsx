"use client";

import { useEffect, useRef, useState } from "react";

const address = "Av. João Pilon, 307 - 1º andar, Salas 07/08 - Cerquilho - SP";
const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const embed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=pt-BR&output=embed`;

export function SupportMap() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false), [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const element = frame.current;
    const fail = () => setBlocked(true);
    element?.addEventListener("error", fail);
    const violation = (event: SecurityPolicyViolationEvent) => {
      if (event.effectiveDirective === "frame-src" && event.blockedURI.startsWith("https://www.google.com")) setBlocked(true);
    };
    document.addEventListener("securitypolicyviolation", violation);
    return () => { document.removeEventListener("securitypolicyviolation", violation); element?.removeEventListener("error", fail); };
  }, []);
  return <div className="support-map">
    <div className="support-map-stage">
      <div className="support-map-fallback" aria-hidden={loaded && !blocked} inert={loaded && !blocked}>
        <p>{address}</p><a href={maps} target="_blank" rel="noopener">Ver no Google Maps</a>
      </div>
      {!blocked && <iframe ref={frame} src={embed} title="Mapa com a localização da Fasa Informática em Cerquilho" loading="lazy" width="600" height="320"
        tabIndex={-1} aria-hidden="true"
        referrerPolicy="no-referrer-when-downgrade" onLoad={() => setLoaded(true)}
        className={loaded ? "is-loaded" : undefined} />}
    </div>
    {/* The map is visual only. The address and accessible external links live beside it in Support. */}
  </div>;
}
