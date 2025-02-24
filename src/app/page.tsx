'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import styles from "./page.module.css";
import mockSchema from './utils/mock.schema';
import mockSchema2 from './utils/mock.schema2';

/**
 * Flow:
 * Code is not visible to begin with.
 * Code + spinner become visible when the schema changes.
 * 
 * Code should fade out when the user makes a new search.
 * Spinner should fade in when the user makes a new search.
 * 
 * Spinner should then fade out as the new code fades in.
 */

export default function Page() {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState('');
  const [shifted, setShifted] = useState(false);
  const [displaySchemaContainer, setDisplaySchemaContainer] = useState(false);
  const [displayCode, setDisplayCode] = useState(false);
  const [gradientState, setGradientState] = useState(false);
  const [schemaExists, setSchemaExists] = useState(false);

  useEffect(() => {
    if (!shifted) return;
    setDisplaySchemaContainer(true);
  }, [shifted]); // Trigger when the layout is shifted i.e. when the user presses enter.

  useEffect(() => {
    if (!schema) return;
    setDisplayCode(true);
    setSchemaExists(true);
    dynamicGradient();
  }, [schema]); // Trigger when the schema is fetched.

  const dynamicGradient = () => {
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight >= windowHeight * 2) {
      setGradientState(true); // Only add the gradient effect if the schema is tall enough.
    } else {
      setGradientState(false);
    }
  }

  // Testing.
  // useEffect(() => {
  //   setTimeout(() => {
  //     setSchema(mockSchema); // Set mock schema after 5 seconds
  //   }, 3000);
  //   setTimeout(() => {
  //     setSchema(mockSchema2);
  //   }, 6000);
  // }, []);

  const handleSubmit  = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generateSchema();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateSchema = async () => {
    if (!shifted) shiftLayout();
    if (schemaExists) {
      setDisplayCode(false);
    }

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

      const json = await response.text(); // TODO Should be .json(), probably?
      console.log(json);
      setSchema(json);

    } catch(error: any) {
      console.error(error.message);
    }

  };

  const shiftLayout = () => {
    const wrapper = document.getElementById("wrapper");

    if (!wrapper) return;

    wrapper.style.top = "-25dvh";
    // Remove the transition-duration after the animation has completed.
    setTimeout(() => {
      wrapper.style.transitionDuration = "0s";
      setShifted(true);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      <main id="main" className={`${styles.main} ${gradientState ? styles.gradient : ""}`}>
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
            <div className={`${styles.schemaDiv} ${displaySchemaContainer ? styles.displaySchema : ""}`}>
            <span className={`${styles.spinner}  ${displayCode ? styles.hideSpinner : ""}`}><i className="fa-solid fa-slash fa-spin"></i></span>
              <pre className={styles.pre}>
                <code className={`${styles.code} ${displayCode ? styles.displayCode : ""}`}>{schema}</code>
              </pre>
            </div>
      </main>
    </div>
  );
}
