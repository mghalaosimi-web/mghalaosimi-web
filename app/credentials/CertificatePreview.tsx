type Props={file:string;image:string;title:string};

export default function CertificatePreview({image,title}:Props){
  return <div className="certificate-image-viewer" aria-label={'صورة الشهادة: '+title}>
    <img
      src={image}
      alt={'معاينة شهادة '+title}
      loading="lazy"
      decoding="async"
    />
  </div>;
}
