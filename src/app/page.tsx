import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <h1 className={styles.header}>Schemassistant</h1> */}
        <form method="post" action={"/"}>
          <input className={styles.inputField} type="text"></input>
        </form>
      </main>
    </div>
  );
}
