import "@/styles/global.css";
import "@/styles/cardbook.css";
import "@/styles/responsive.css";
import Image from "next/image";

interface CardBookProps {
  src: string | null;  
  title: string;
  description: string | null;
  link: string;
}

const COVER_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#130F3B"/>
    <rect x="1" y="1" width="198" height="198" fill="none" stroke="#B38839" stroke-width="1" stroke-opacity="0.4"/>
    <text x="100" y="108" font-family="serif" font-size="48" text-anchor="middle" fill="#B38839" opacity="0.5">✦</text>
  </svg>
  `)}`;

  export default function CardBook({ src, title, description, link }: CardBookProps) {    
    const coverSrc = src && src.trim() !== "" ? src : COVER_PLACEHOLDER;
   
    return (
      <div className="card-book">
        <Image
          src={coverSrc}
          alt={title}
          width={200}
          height={200}
          className="card-image"         
          unoptimized={!src || src.startsWith("data:")}
        />
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description ?? ""}</p>
        <button className="btn-gold">
          <a href={link} rel="noopener noreferrer">
            Entrer dans l'histoire
          </a>
        </button>
      </div>
    );
  }