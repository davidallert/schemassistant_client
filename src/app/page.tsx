'use client';

import React, { FormEvent, useState } from 'react';
import styles from "./page.module.css";

export default function Page() {
  const [input, setInput] = useState('');

  const handleSubmit  = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateSchema();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateSchema = async () => {
    const url = 'http://localhost:3001/scrape';
    const requestBody = {
      url: input
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);

    } catch(error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
        <h1 className={styles.header}>Schemassistant<span className={styles.blink}>_</span></h1>
        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <input
          className={styles.inputField}
          type="text"
          onChange={handleChange}
          placeholder="https://example.com/"></input>
        </form>
        </div>
      </main>
    </div>
  );
}
