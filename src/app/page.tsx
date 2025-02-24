'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import styles from "./page.module.css";
import mockSchema from './utils/mock.schema';

export default function Page() {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState('');
  const [shifted, setShifted] = useState(false);

  useEffect(() => {
    const schemaDiv = document.getElementById("schemaDiv");
    // const pre = document.getElementById("pre");
    // const code = document.getElementById("code");

    // if (!code || !pre || !schemaDiv) return;

    if (!schemaDiv) return;

    schemaDiv.style.transitionDuration = "3s";
    schemaDiv.style.opacity = "1";

  }, [schema]);

  const handleSubmit  = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generateSchema();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateSchema = async () => {
    // const url = 'http://localhost:3001/scrape';
    // const requestBody = {
    //   url: input
    // }

    if (!shifted) shiftLayout();
    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(requestBody),
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Response status: ${response.status}`);
    //   }

    //   const json = await response.text(); // TODO Should be .json(), probably?
    //   console.log(json);

    // } catch(error: any) {
    //   console.error(error.message);
    // }

    setTimeout(() => {
      setSchema(mockSchema);
    }, 5000);

  };

  const shiftLayout = () => {
    const wrapper = document.getElementById("wrapper");

    if (!wrapper) return;

    wrapper.style.top = "-30dvh";
    // Remove the transition-duration after the animation has completed.
    setTimeout(() => {
      wrapper.style.transitionDuration = "0s";
      setShifted(true);
    }, 3000);
  };

  return (
    <div className={styles.page}>
      <main id="main" className={styles.main}>
        <div className={styles.bg}>
          <div id="wrapper" className={styles.wrapper}>
            <h1 className={styles.header}>Schemassistant<span className={styles.blink}>_</span></h1>
            <form className={styles.inputForm} onSubmit={handleSubmit}>
              <input
              className={styles.inputField}
              type="text"
              onChange={handleChange}
              placeholder="https://example.com/"></input>
            </form>
          </div>
        </div>
            <div id="schemaDiv" className={styles.schemaDiv}>
              <pre id="pre" className={styles.pre}>
                <code id="code" className={styles.code}>{schema}</code>
              </pre>
            </div>
      </main>
    </div>
  );
}
