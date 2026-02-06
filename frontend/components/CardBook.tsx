import "@/styles/global.css";
import "@/styles/cardbook.css";
import Image from "next/image";

interface CardBookProps {
  src: string; // Correction pour correspondre à l'utilisation dans page.tsx
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
      <a href={link} className="btn-gold">
        Lire
      </a>
    </div>
  );
}
