"use client";
import React from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { forgetPassword } from "../api/forgetPassword/route";
//import ReactLoading from "react-loading";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "../common/enums/enums";

const ForgetPassword = () => {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setErrorMessage("");
    const email = formData.email;
    const role = formData.role;

    if (!email) {
      setErrorMessage("Please fill in your email!");
      return;
    } else if (!role) {
      setErrorMessage("Please fill in your role!");
      return;
    } else {
      try {
        setLoading(true);
        const result = await forgetPassword(email, role);
        if (!result.error) {
          router.push(
            "/resetPassword?message=You%20have%201%20hour%20to%20reset%20your%20password"
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("An error occurred during password reset:", error);
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Forgot Password?</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form className={styles.form}>
        <div className={styles.inputContainer}>
          <p>Email</p>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.radio}>
          <p>I am a:</p>
          <RadioButton
            inputId={Enums.CONTENT_CREATOR}
            name="role"
            value={Enums.CONTENT_CREATOR}
            onChange={handleInputChange}
            checked={formData.role === Enums.CONTENT_CREATOR}
            required
          />
          <label htmlFor={Enums.CONTENT_CREATOR}>Content Creator</label>
          <RadioButton
            inputId={Enums.ADMIN}
            name="role"
            value={Enums.ADMIN}
            onChange={handleInputChange}
            checked={formData.role === Enums.ADMIN}
            required
          />
          <label htmlFor={Enums.ADMIN}>Admin</label>
        </div>
        {loading && (
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        )}
        {!loading && (
          <button className={styles.button} onClick={handleSubmit}>
            Reset Password
          </button>
        )}
      </form>
      <div className={styles.orContainer}>
        <div className={styles.orSeparator}></div>
        <span className={styles.orText}>or</span>
        <div className={styles.orSeparator}></div>
      </div>
      <button
        className={styles.registerButton}
        onClick={() => router.push("/register")}
      >
        New to Kideas? Join Now!
      </button>
    </div>
  );
};

export default ForgetPassword;
