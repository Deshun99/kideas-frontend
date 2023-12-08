"use client";
import React, { useRef } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Enums from "../common/enums/enums";

const Login = () => {
    const session = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
      email: "",
      password: "",
      role: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    if (session.status === "loading") {
      return (
        <div className={styles.loadingSession}>
          <ProgressSpinner />
        </div>
      );
    }

    if (session.status === "authenticated") {
      router?.push("/dashboard");
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
      setLoading(false);
      const { email, password, role } = formData;

      if (!email) {
        setErrorMessage("Please fill in your email!");
        return;
      } else if (!password) {
        setErrorMessage("Please fill in your password!");
        return;
      } else if (!role) {
        setErrorMessage("Please fill in your role!");
        return;
      } else {
        try {
          setLoading(true);
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            role,
          });
          if (!result.error) {
            // User signed in successfully
            router.push("/dashboard");
            setLoading(false);
          } else {
            // Handle the error result.error
            console.error(`Login error: ${result.error}`);
            setLoading(false);
            setErrorMessage(result.error);
          }
        } catch (error) {
          console.error("An error occurred during authentication:", error);
          setLoading(false);
          setErrorMessage(error);
        }
      }
    };

    const handleRegister = async (e) => {
      setLoadingRegister(true);
      router.push("/register");
    };

    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Join Kideas</h1>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <p>Email</p>
              <InputText
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <p>Password</p>
              <InputText
                type={showPassword ? "text" : "password"}
                name="password"
                className={styles.input}
                value={formData.password}
                onChange={handleInputChange}
                required
                toggleMask
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.showPasswordButton}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <Link className={styles.forgotPassword} href="/forgetPassword">
                Forgot Password?
              </Link>
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
              <Button className={styles.button} onClick={handleSubmit}>
                Sign in
              </Button>
            )}
          </form>
          <div className={styles.orContainer}>
            <div className={styles.orSeparator}></div>
            <span className={styles.orText}>or</span>
            <div className={styles.orSeparator}></div>
          </div>
          {loadingRegister && (
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          )}
          {!loadingRegister && (
            <Button className={styles.registerButton} onClick={handleRegister}>
              New to Kideas? Join Now!
            </Button>
          )}
        </div>
    );
};

export default Login;
