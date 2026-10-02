"use client";

import Script from "next/script";

export function OriginalInteractions() {
  return <Script src="/assets/js/site-original.js" strategy="afterInteractive" onReady={() => document.documentElement.classList.add("js")} onError={() => document.documentElement.classList.remove("js")} />;
}
