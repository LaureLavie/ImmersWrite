"use client";

import "@/styles/global.css";
import "@/styles/home.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardBook from "@/components/CardBook";
import LogoIW from "../public/LogoIW.png";
import IWgold from "../public/IWgold.png";


export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="container">
       <div className="left-container">
        <CardBook
          src={LogoIW}
          title="Livre à Lire"
          description="Description du livre à découvrir."
          link="/book/1"
        />
        </div>
        <div className="right-container">
          <CardBook
            src={IWgold}
            title="Livre déjà Lu"
            description="Description du livre déjà découvert."
            link="/book/2"            
            />
        </div>
      </div>
      <Footer />
    </div>   
  );
}