"use client";

import React, { useEffect } from "react";
import styles from "./page.module.css";

declare global {
  interface Window {
    vapiSDK: any;
  }
}
const Home = () => {
  const categories = {
    "Voice chat-GPT4o": "basic-chat",
    "Function calling": "function-calling",
    "Knowledge Base": "file-search",
    All: "all",
  };

  useEffect(() => {
    const assistant = "80aecc7e-9537-4240-91e6-642c0c5cb976"; // Substitute with your assistant ID
    const apiKey = "f5c80ab3-a42b-4544-a3a2-ff019e8b7913"; // Substitute with your Public key from Vapi Dashboard.

    const buttonConfig = {
  position: "right", // "bottom" | "top" | "left" | "right" | "top-right" | "top-left" | "bottom-left" | "bottom-right"
  offset: "465px", // decide how far the button should be from the edge
  width: "480px", // min-width of the button
  height: "130px", // height of the button
  idle: { // button state when the call is not active.
    color: `rgb(93, 254, 202)`, 
    type: "pill", // or "round"
    title: "Im here for you 24 hours a day?", // only required in case of Pill
    subtitle: " Talk to me, lets fiqure it out.", // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/phone.svg`,
  },
  loading: { // button state when the call is connecting
    color: `rgb(93, 124, 202)`,
    type: "pill", // or "round"
    title: "Connecting...", // only required in case of Pill
    subtitle: "Please wait", // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg`,
  },
  active: { // button state when the call is in progress or active.
    color: `rgb(255, 0, 0)`,
    type: "pill", // or "round"
    title: "Im here with you now", // only required in case of Pill
    subtitle: "End the call.", // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg`,
  },
};

    
    const script = document.createElement("script");
    script.src = "https://api.callfluent.ai/embed.js?id=519";
    script.defer = true;
    script.async = true;    
    
    
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    script.onload = () => {
      const vapiInstance = window.vapiSDK.run({
        apiKey: apiKey,
        assistant: assistant,
        config: buttonConfig,
        parentElement: document.getElementById('vapi-widget'), // Specify the container
      });

      vapiInstance.on('speech-start', () => {
        console.log('Speech has started');
      });

      vapiInstance.on('speech-end', () => {
        console.log('Speech has ended');
      });

      vapiInstance.on('call-start', () => {
        console.log('Call has started');
      });

      vapiInstance.on('call-end', () => {
        console.log('Call has stopped');
      });

      vapiInstance.on('volume-level', (volume) => {
        console.log(`Assistant volume level: ${volume}`);
      });

      vapiInstance.on('message', (message) => {
        console.log(message);
      });

      vapiInstance.on('error', (e) => {
        console.error(e);
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Explore and interact with our technology, this is what really runs our company and can run yours.</h1>
        <p>Discover the power of Generative Intelligence from the Pioneers at Generative solutions.</p>
      </header>
      <div className={styles.container}>
        {Object.entries(categories).map(([name, url]) => (
          <a key={name} className={styles.category} href={`/examples/${url}`}>
            {name}
          </a>
        ))}
      </div>
      <section className={styles.textBox}>
        <div className={styles.left}>
          <p>In the realm of super intelligence, this is not merely a desire for businesses; it is an absolute necessity. To thrive in this new world, you need this entity. It will manage all your sales and handle thousands of calls per minute. 
        It will generate leads, follow up on all prospects, and close sales at a higher rate than your human phone agents. This entity will save you over 75% on your salesroom or call center expenses. No more lawsuits, no more worker's compensation issues. 
        Business has just become enjoyable and profitable again for those who see the future and wish to help shape it. This is the most significant change in business ever. A.I. will transform absolutely everything.</p>
        </div>
        <div className={styles.right}>
          <p>Meet Internet Entity, a true entity like no other. Imagine having a Lawyer, Doctor, Financial Genius, Trusted Friend, Scientist, Physicist, Mathematician, Philosopher, and anything else you can envision working with you.</p> 
        </div>
      </section>
      <section className={styles.widgetSection}>
        <div className={styles.widget} id="vapi-widget">
          {/* The Vapi widget will be injected here */}
        </div>
       <div className={styles.center}>
          <h3>If you like you can all call me on your cell phone! Internet Entity +1 (310) 776 3204 --------------------- Im always happy to help you 24 hours a day</h3> 
        </div>
      </section>
      <footer className={styles.footer}>
        <p>&copy; 2024 Generative Solutions. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Home;
