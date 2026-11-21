'use client';

import {useState,type FormEvent} from 'react';
import {Send,ShieldCheck} from 'lucide-react';

type Locale='ar'|'en';

export default function ContactForm({locale='ar'}:{locale?:Locale}){
  const en=locale==='en';
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [subject,setSubject]=useState('');
  const [message,setMessage]=useState('');
  const [website,setWebsite]=useState('');
  const [consent,setConsent]=useState(false);
  const [notice,setNotice]=useState('');
  const [noticeType,setNoticeType]=useState<'success'|'error'|''>('');
  const [sending,setSending]=useState(false);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(sending)return;
    const payload={name:name.trim(),email:email.trim(),subject:subject.trim(),message:message.trim(),locale,website,consent};
    if(payload.name.length<2||payload.email.length<5||payload.subject.length<3||payload.message.length<10||!consent){
      setNotice(en?'Complete all fields and accept the privacy notice.':'أكمل الحقول المطلوبة ووافق على إشعار الخصوصية.');
      setNoticeType('error');
      return;
    }
    setSending(true);
    setNotice('');
    setNoticeType('');
    try{
      const response=await fetch('/api/public/contact-messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        credentials:'omit',
        cache:'no-store',
        body:JSON.stringify(payload)
      });
      const result=await response.json().catch(()=>null);
      if(!response.ok||!result?.success){
        const detail=result?.error?.message;
        throw new Error(detail||(en?'The message could not be sent. Please try again.':'تعذر إرسال الرسالة. حاول مرة أخرى.'));
      }
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setWebsite('');
      setConsent(false);
      setNotice(en?'Your message was sent successfully. It is now in the secure contact inbox.':'وصلت رسالتك بنجاح، وتم حفظها في صندوق التواصل الآمن.');
      setNoticeType('success');
    }catch(error){
      setNotice(error instanceof Error?error.message:(en?'A network error occurred. Please try again.':'حدث خطأ في الاتصال. حاول مرة أخرى.'));
      setNoticeType('error');
    }finally{
      setSending(false);
    }
  }

  return <div className="contact-form-wrap">
    <form className="contact-form" onSubmit={submit} noValidate>
      <label>{en?'Your name':'اسمك'}
        <input name="name" value={name} onChange={event=>setName(event.target.value)} autoComplete="name" minLength={2} maxLength={80} placeholder={en?'Enter your full name':'اكتب اسمك الكامل'} required/>
      </label>
      <label>{en?'Email address':'البريد الإلكتروني'}
        <input name="email" type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" maxLength={160} placeholder={en?'you@example.com':'name@example.com'} required/>
      </label>
      <label>{en?'Subject':'موضوع الرسالة'}
        <input name="subject" value={subject} onChange={event=>setSubject(event.target.value)} minLength={3} maxLength={120} placeholder={en?'What would you like to discuss?':'ما الموضوع الذي تريد مناقشته؟'} required/>
      </label>
      <label>{en?'Message':'تفاصيل الرسالة'}
        <textarea name="message" value={message} onChange={event=>setMessage(event.target.value)} minLength={10} maxLength={4000} rows={6} placeholder={en?'Write the details of your message…':'اكتب تفاصيل رسالتك هنا…'} required/>
      </label>
      <label className="form-honeypot" aria-hidden="true">Website
        <input name="website" value={website} onChange={event=>setWebsite(event.target.value)} tabIndex={-1} autoComplete="off"/>
      </label>
      <label className="contact-consent">
        <input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)} required/>
        <span>{en?'I agree that my details and message may be stored securely to respond to this inquiry.':'أوافق على حفظ بياناتي ورسالتي بشكل آمن لغرض الرد على هذا الاستفسار.'}</span>
      </label>
      <button className="button-primary" type="submit" disabled={sending||!consent}>
        {sending?(en?'Sending…':'جارٍ الإرسال…'):(en?'Send message securely':'إرسال الرسالة بأمان')} <Send size={16}/>
      </button>
    </form>
    {notice&&<p className={noticeType==='success'?'form-success':'form-error'} role={noticeType==='success'?'status':'alert'} aria-live="polite">{notice}</p>}
    <p className="contact-auth-status"><ShieldCheck size={15}/>{en?'Messages are stored in the Neon PostgreSQL contact inbox. Only authorized administrators can read them.':'تُحفظ الرسائل في صندوق التواصل بقاعدة Neon PostgreSQL، ولا يمكن الاطلاع عليها إلا للمخولين في لوحة الإدارة.'}</p>
  </div>;
}
