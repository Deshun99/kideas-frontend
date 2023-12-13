"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import Parenthood from "./../../public/parenthood.jpg";
import Parenthood2 from "./../../public/parenthood2.jpeg";

export default function Home() {
  const session = useSession();

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <div className={styles.titleContainer}>
          <p className={styles.mainTitle}>K</p>
          <p className={styles.logoA}>i</p>
          <p className={styles.mainTitle}>deas</p>
        </div>
        <div>
          <p className={styles.description}>
            because you deserve the best
          </p>
        </div>
        <div>
          <h1 className={styles.secondaryTitle}>Advices</h1>
        </div>
        <div className={styles.buttonContainer}>
          {!accessToken && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => (window.location.href = "/login")}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
      <Image src={Parenthood2} alt="Picture" className={styles.img} />
    </div>
  );
}
