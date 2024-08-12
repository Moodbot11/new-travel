"use client";

import React, { useEffect } from "react";
import styles from "./page.module.css";
}
const Home = () => {
  const categories = {
    "Voice chat-GPT4o": "basic-chat",
    "Function calling": "function-calling",
    "Knowledge Base": "file-search",
    All: "all",
  };
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
