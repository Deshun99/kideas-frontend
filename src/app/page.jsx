"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Parenthood2 from "./../../public/parenthood2.jpeg";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  // if(session) {
  //   router?.push("/topic");
  // }

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
