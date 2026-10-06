"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";

export function CertificateForm({locale}:{locale:Locale}){
 const router=useRouter();const [name,setName]=useState("");const [ok,setOk]=useState(false);const [busy,setBusy]=useState(false);
 async function issue(){setBusy(true);try{const r=await fetch("/api/certificate/issue",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({studentName:name,language:locale})});if(!r.ok)throw new Error(await r.text());router.refresh()}finally{setBusy(false)}}
 return <div className="card formCard"><label htmlFor="certName">{locale==="ru"?"Имя в сертификате":"Name on certificate"}</label><input id="certName" type="text" autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/>
 <label className="checkline"><input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)}/><span>{locale==="ru"?"Я подтверждаю, что имя написано правильно.":"I confirm that my name is written correctly."}</span></label>
 <div className="notice">{locale==="ru"?"Сертификат не индексируется в поиске. Любой, у кого есть ссылка или QR-код для проверки, сможет увидеть имя в сертификате, название курса, дату завершения, ID сертификата и его статус.":"Your certificate is unlisted. Anyone with its verification link or QR code can view your certificate name, course, completion date, Certificate ID and status."}</div>
 <button className="btn" style={{marginTop:16}} disabled={!name.trim()||!ok||busy} onClick={issue}>{locale==="ru"?"Сгенерировать сертификат":"Generate my certificate"}</button></div>
}

export function CertificateActions({locale,token}:{locale:Locale;token:string}){
 async function copy(){await navigator.clipboard.writeText(`${location.origin}/en/certificate/${token}`)}
 async function share(){if(navigator.share)await navigator.share({title:"MIYU Academy Certificate",url:`${location.origin}/en/certificate/${token}`})}
 return <div className="actions"><button className="btn" onClick={()=>window.print()}>Download PDF</button><button className="btn secondary" onClick={copy}>Copy certificate link</button><button className="btn secondary" onClick={share}>Share</button><a className="btn secondary" href={`/${locale}/certificate/${token}`}>Open verification</a></div>
}
