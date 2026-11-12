import {cache} from 'react';
import {getPublicCertificates,getPublicSkills} from './mghal-api-runtime.mjs';

export type PublicCertificateRow={
 id:string;
 slug:string;
 title:string;
 issuer:string;
 category:string|null;
 credential_id:string|null;
 issued_at:string|null;
 expires_at:string|null;
 verification_url:string|null;
 image_media_id:string|null;
 pdf_media_id:string|null;
 qr_url:string|null;
 description:string|null;
 sort_order:number;
};

/** null means Neon is unavailable; [] is an authoritative empty public set. */
export const getPublishedCertificates=cache(async():Promise<PublicCertificateRow[]|null>=>{
 const rows=await getPublicCertificates();
 return Array.isArray(rows)?rows as PublicCertificateRow[]:null;
});

export function safePublicHttpsUrl(value:string|null|undefined):string|undefined{
 if(!value)return undefined;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password)return undefined;
  return url.toString();
 }catch{return undefined;}
}

export type PublicSkillRow={
 id:string;
 name:string;
 locale:string;
 category:string;
 proficiency:string;
 sort_order:number;
};

/** null means Neon is unavailable; [] is an authoritative empty public set. */
export const getPublishedSkills=cache(async():Promise<PublicSkillRow[]|null>=>{
 const rows=await getPublicSkills();
 return Array.isArray(rows)?rows as PublicSkillRow[]:null;
});
