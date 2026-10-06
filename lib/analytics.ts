"use client";

type EventProps=Record<string,string|number|boolean|null|undefined>;

function consented(){
  if(typeof window==="undefined") return false;
  return localStorage.getItem("miyu_analytics_consent")==="allow";
}

/**
 * Vendor-neutral MIYU event boundary.
 * V1 intentionally ships with no third-party analytics adapter.
 * Add an adapter here only after Step 26 vendor/DPA/consent review.
 */
export function track(event:string,props:EventProps={}){
  if(!consented()) return;
  // no-op by design until a reviewed analytics vendor is configured.
  if(process.env.NODE_ENV==="development") console.debug("[MIYU analytics]",event,props);
}
