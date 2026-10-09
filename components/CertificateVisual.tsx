import type { Locale } from "@/lib/course";
import { FitName } from "@/components/FitName";

export function CertificateVisual({
  locale,name,completed,certificateId,qrDataUrl
}:{locale:Locale;name:string;completed:string;certificateId:string;qrDataUrl:string}){
  const [line1,line2]=locale==="ru"
    ?["ГРЕЧЕСКАЯ МИФОЛОГИЯ:","РАСШИФРУЙ МИР ВОКРУГ СЕБЯ"]
    :["GREEK MYTHOLOGY:","DECODE THE WORLD AROUND YOU"];
  const pre=locale==="ru"?"Сертификат выдан":"This certifies that";
  const post=locale==="ru"?"за успешное завершение курса":"has successfully completed the course";
  return <div className="certificateVisual" role="img" aria-label={`MIYU Academy Certificate of Completion for ${name}`}>
    <img className="certificateMasterBg" src="/certificate-master.webp" alt="" aria-hidden="true"/>
    <img className="certificateClean" src="/certificate-clean-patches.webp" alt="" aria-hidden="true"/>
    <div className="certLine certLinePre">{pre}</div>
    <div className="certLine certLineName"><FitName className="certificateName" text={name} baseCqw={6} twoLine/></div>
    <div className="certLine certLinePost">{post}</div>
    <div className="certLine certLineCourse1"><FitName className="certificateCourse" text={line1} baseCqw={4.2}/></div>
    <div className="certLine certLineCourse2"><FitName className="certificateCourse certificateCourseSub" text={line2} baseCqw={3}/></div>
    <div className="certificateMetaLeft"><span>{locale==="ru"?"Завершено":"Completed"}</span><strong>{completed}</strong></div>
    <div className="certificateMetaRight"><span>Certificate ID</span><strong>{certificateId}</strong></div>
    <div className="certificateQr"><img src={qrDataUrl} alt="QR code for certificate verification"/></div>
  </div>
}
