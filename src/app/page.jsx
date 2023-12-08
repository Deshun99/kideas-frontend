"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";

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
          <p className={styles.mainTitle}>St</p>
          <p className={styles.logoA}>a</p>
          <p className={styles.mainTitle}>rHire</p>
        </div>
        <div>
          <p className={styles.description}>
            because educators deserve the best
          </p>
        </div>
        <div>
          <h1 className={styles.secondaryTitle}>Opportunities</h1>
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
      {/* <div className={styles.imageContainer}>
        <Image src={yellowStar} alt="Picture" className={styles.img} />
      </div>
      <div className={styles.imageContainer2}>
        <Image src={blueStar} alt="Picture" className={styles.img2} />
      </div> */}
    </div>
  );
}
