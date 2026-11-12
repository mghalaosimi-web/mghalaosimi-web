'use client';
import {useState,type FormEvent} from 'react';
import {Send} from 'lucide-react';

type Locale='ar'|'en';

export default function ContactForm({locale='ar'}:{locale?:Locale}){
  const en=locale==='en';
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [subject,setSubject]=useState('');
  const [message,setMessage]=useState('');
  const [notice,setNotice]=useState('');

  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const cleanName=name.trim();
    const cleanEmail=email.trim();
    const cleanSubject=subject.trim();
    const cleanMessage=message.trim();
    if(cleanName.length<2||cleanEmail.length<5||cleanSubject.length<3||cleanMessage.length<10){
      setNotice(en?'Please complete all fields with valid details.':'يرجى استكمال الحقول وإدخال بيانات صحيحة.');
      return;
    }
    const body=encodeURIComponent(
      `${en?'Name':'الاسم'}: ${cleanName}\n${en?'Email':'البريد الإلكتروني'}: ${cleanEmail}\n\n${cleanMessage}`
    );
    const mailto=`mailto:m.gh.alaosimi@gmail.com?subject=${encodeURIComponent(cleanSubject)}&body=${body}`;
    setNotice(en
      ?'Your email application will open with the message prepared. Review it and send it from your email account.'
      :'سيُفتح تطبيق البريد لديك مع تجهيز الرسالة. راجعها ثم أرسلها من حسابك.');
    window.location.href=mailto;
  }

  return <div className="contact-form-wrap">
    <form className="contact-form" onSubmit={submit}>
      <label>{en?'Name':'الاسم'}
        <input name="name" value={name} onChange={event=>setName(event.target.value)} autoComplete="name" minLength={2} maxLength={80} placeholder={en?'Enter your name':'اكتب اسمك'} required/>
      </label>
      <label>{en?'Email address':'البريد الإلكتروني'}
        <input name="email" type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" maxLength={160} placeholder={en?'you@example.com':'name@example.com'} required/>
      </label>
      <label>{en?'Subject':'موضوع الرسالة'}
        <input name="subject" value={subject} onChange={event=>setSubject(event.target.value)} minLength={3} maxLength={120} placeholder={en?'Technical collaboration or inquiry':'تعاون تقني أو استفسار مهني'} required/>
      </label>
      <label>{en?'Message':'الرسالة'}
        <textarea name="message" value={message} onChange={event=>setMessage(event.target.value)} minLength={10} maxLength={4000} rows={5} placeholder={en?'Write your message here…':'اكتب تفاصيل رسالتك هنا…'} required/>
      </label>
      <label className="form-honeypot" aria-hidden="true">Website
        <input name="website" tabIndex={-1} autoComplete="off"/>
      </label>
      <button className="button-primary" type="submit">{en?'Prepare email message':'تجهيز رسالة البريد'} <Send size={16}/></button>
    </form>
    {notice&&<p className="form-success" role="status" aria-live="polite">{notice}</p>}
    <p className="contact-auth-status">{en?'This form opens your default email application; it does not send messages in the background.':'هذا النموذج يفتح تطبيق البريد الافتراضي لديك، ولا يرسل الرسائل في الخلفية تلقائياً.'}</p>
  </div>;
}
