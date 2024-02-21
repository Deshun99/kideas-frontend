"use client";
import React from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateUserPassword } from "../api/forgetPassword/route";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import Enums from "../common/enums/enums";

const ResetPassword = () => {
  const router = useRouter();
  const session = useSession();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [storedToken, setStoredToken] = useState("");
  //   const [storedTokenExpiry, setStoredTokenExpiry] = useState("");
  //   const [storedRole, setStoredRole] = useState("");
  //   const [storedEmail, setStoredEmail] = useState("");
  //   const [storedUserId, setStoredUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    tokenId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

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

  //   useEffect(() => {
  //     const emailFromLocalStorage = localStorage.getItem("resetEmail");
  //     const token = localStorage.getItem("passwordResetToken");
  //     const tokenExpire = localStorage.getItem("passwordResetExpire");
  //     const role = localStorage.getItem("role");
  //     const userId = localStorage.getItem("userId");
  //     if (emailFromLocalStorage) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         email: emailFromLocalStorage,
  //         role: role,
  //       }));
  //       setStoredEmail(emailFromLocalStorage);
  //     }
  //     if (token) {
  //       setStoredToken(token);
  //     }
  //     if (tokenExpire) {
  //       setStoredTokenExpiry(tokenExpire);
  //     }
  //     if (role) {
  //       setStoredRole(role);
  //     }
  //     if (userId) {
  //       setStoredUserId(userId);
  //     }
  //   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(false);
    const { tokenId, email, password, confirmPassword, role } = formData;

    if (!tokenId) {
      setErrorMessage("Please fill in your token ID!");
      return;
    } else if (!password) {
      setErrorMessage("Please fill in your password!");
      return;
    } else if (!confirmPassword) {
      setErrorMessage("Please confirm your password!");
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Please ensure that the password provided match!");
      return;
    } else {
      //   const hashedPassword = await hashing(password);
      const resetPassword = {
        tokenId: formData.tokenId,
        email: formData.email,
        password: formData.password,
        role: role,
      };
      try {
        setLoading(true);
        const response = await updateUserPassword(resetPassword);
        router.push("/login");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("An error occurred during password reset: ", error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset Password</h1>
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
        <div className={styles.inputContainer}>
          <p>Token Id</p>
          <input
            type="text"
            name="tokenId"
            className={styles.input}
            value={formData.tokenId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <p>Password</p>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.showPasswordButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className={styles.inputContainer}>
          <p>Confirm Password</p>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            className={styles.input}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.showPasswordButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
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
    </div>
  );
};

export default ResetPassword;
