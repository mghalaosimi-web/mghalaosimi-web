"use client";
export default function PrintButton({label}:{label:string}){
 return <button type="button" className="document-print-button" onClick={()=>window.print()}>{label}</button>;
}
