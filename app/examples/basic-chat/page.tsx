"use client";

import React from "react";
import styles from "./page.module.css"; // Ensure this file contains your CSS styles
import Chat from "../components/chat";

const Home = () => {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Welcome to Your Travel Adventure</h1>
        <p>Discover new destinations and experiences with us</p>
        <img src="/path/to/your/hero-image.jpg" alt="Travel" className={styles.heroImage} />
      </header>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Explore Destinations</h2>
            <img src="/path/to/destination-image.jpg" alt="Destinations" />
            <p>Find your next getaway with our curated lists.</p>
          </div>
          <div className={styles.card}>
            <h2>Book Flights</h2>
            <img src="/path/to/flight-image.jpg" alt="Flights" />
            <p>Compare prices and book your flights easily.</p>
          </div>
          <div className={styles.card}>
            <h2>Find Hotels</h2>
            <img src="/path/to/hotel-image.jpg" alt="Hotels" />
            <p>Discover the best accommodations wherever you go.</p>
          </div>
          <div className={styles.card}>
            <h2>Travel Tips</h2>
            <img src="/path/to/tips-image.jpg" alt="Travel Tips" />
            <p>Get the best advice for a smooth journey.</p>
          </div>
        </div>
        <Chat />
      </div>
    </main>
  );
};

export default Home;
