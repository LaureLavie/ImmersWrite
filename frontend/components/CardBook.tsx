import "@/styles/global.css";
import "@/styles/cardbook.css";
import "@/styles/responsive.css";
import Image from "next/image";

interface CardBookProps {
  src: string; // 
  title: string;
  description: string;
  link: string;
}

export default function CardBook({ src, title, description, link }: CardBookProps) {
  return (
    <div className="card-book">
      <Image src={src} alt={title} width={200} height={200} className="card-image" />
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <button className="btn-gold">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Lire
        </a>
      </button>
    </div>
  );
}
