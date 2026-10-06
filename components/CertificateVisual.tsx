import type { Locale } from "@/lib/course";

export function CertificateVisual({
  locale,name,completed,certificateId,qrDataUrl
}:{locale:Locale;name:string;completed:string;certificateId:string;qrDataUrl:string}){
  const courseTitle=locale==="ru"
    ?"ГРЕЧЕСКАЯ МИФОЛОГИЯ: РАСШИФРУЙ МИР ВОКРУГ СЕБЯ"
    :"GREEK MYTHOLOGY: DECODE THE WORLD AROUND YOU";
  const pre=locale==="ru"?"Сертификат подтверждает успешное прохождение курса":"This certifies that";
  const post=locale==="ru"?"":"has successfully completed the course";
  const nameClass=name.length>30?"longName":name.length>22?"mediumName":"";
  return <div className="certificateVisual" role="img" aria-label={`MIYU Academy Certificate of Completion for ${name}`}>
    <img className="certificateMasterBg" src="/certificate-master.webp" alt="" aria-hidden="true"/>
    <div className="certPatch certPatchMain" aria-hidden="true"/>
    <div className="certPatch certPatchMeta" aria-hidden="true"/>
    <div className="certPatch certPatchQr" aria-hidden="true"/>
    <div className="certificateDynamic">
      <div className="certificatePre">{pre}</div>
      <div className={`certificateName ${nameClass}`}>{name}</div>
      {post&&<div className="certificatePost">{post}</div>}
      <div className="certificateCourse">{courseTitle}</div>
    </div>
    <div className="certificateMetaLeft"><span>{locale==="ru"?"Завершено":"Completed"}</span><strong>{completed}</strong></div>
    <div className="certificateMetaRight"><span>Certificate ID</span><strong>{certificateId}</strong></div>
    <div className="certificateQr"><img src={qrDataUrl} alt="QR code for certificate verification"/></div>
    <div className="certificateVerifyText">VERIFY CERTIFICATE <span>→</span></div>
  </div>
}
