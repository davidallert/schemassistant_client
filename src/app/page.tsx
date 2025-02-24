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
  const [copyIconClicked, setCopyIconClicked] = useState(false);
  const [copyIcon, setCopyIcon] = useState("fa-regular fa-copy");

  useEffect(() => {
    if (!shifted) return;
    setDisplaySchemaContainer(true);
  }, [shifted]); // Trigger when the layout is shifted i.e. when the user presses enter.

  useEffect(() => {
    if (!schema) return;
    setDisplayCode(true);
    setSchemaExists(true);
    dynamicGradient(); // Create/remove bottom gradient depending on current windowHeight.
  }, [schema]); // Trigger when the schema is fetched.

  const dynamicGradient = () => {
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight >= windowHeight * 2) {
      setGradientState(true); // Only add the gradient effect if the schema is "tall" enough.
    } else {
      setGradientState(false);
    }
  }

  const handleSubmit  = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generateSchema();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateSchema = async () => {
    if (!shifted) shiftLayout(); // Move the header div towards the top of the screen.

    if (schemaExists) {
      setDisplayCode(false); // Fade schema markup code if it exists.
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

    wrapper.style.top = "-25dvh"; // TODO use React state and CSS instead of setting style directly.
    setTimeout(() => {
      // Remove the transition-duration after the animation has completed.
      wrapper.style.transitionDuration = "0s";
      setShifted(true);
    }, 1000);
  };

  const copy = () => {
    navigator.clipboard.writeText(schema);
    setCopyIconClicked(true);
    setTimeout(() => {
      setCopyIconClicked(false);
    }, 100);
  };

  useEffect(() => {
    if (copyIcon === "fa-regular fa-copy") {
      setCopyIcon("fa-solid fa-copy")
    } else {
      setCopyIcon("fa-regular fa-copy")
    }
  }, [copyIconClicked]);

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
            <span className={`${styles.copy} ${displayCode ? styles.displayCopy : ""}`} onClick={copy}><i className={copyIcon}></i></span>
            <span className={`${styles.spinner}  ${displayCode ? styles.hideSpinner : ""}`}><i className="fa-solid fa-slash fa-spin"></i></span>
              <pre className={styles.pre}>
                <code className={`${styles.code} ${displayCode ? styles.displayCode : ""}`}>{schema}</code>
              </pre>
            </div>
      </main>
    </div>
  );
}
