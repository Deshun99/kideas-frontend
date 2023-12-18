import React, { useState } from "react";
import styles from "./editAccountForm.module.css";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";

const EditAccountForm = ({
  formData,
  setFormData,
  handleInputChange,
  handleInputNumberChange,
  handleFileChange,
  toast,
  confirmChanges,
  Enums,
}) => {
  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <Card className={styles.card}>
        <p className={styles.title}>My Account Details</p>
        <form className={styles.form} onSubmit={confirmChanges}>
          <div className={styles.avatarContainer}>
            {formData?.profilePictureUrl && (
              <img
                src={formData.profilePictureUrl}
                alt="User Profile"
                className={styles.avatar}
              />
            )}
          </div>

          <div className={styles.inputFields}>
            <div className={styles.field}>
              <label htmlFor="userName">User Name:</label>
              <InputText
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email Address:</label>
              <InputText
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="contactNo">Contact Number:</label>
              <InputNumber
                name="contactNo"
                value={formData.contactNo}
                onChange={(e) => handleInputNumberChange("contactNo", e.value)}
                useGrouping={false}
              />
            </div>
            {/* This is just to check the image link */}
            {/* <div className={styles.field}>
            <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
            <input
              type="url"
              id="profilePictureUrl"
              name="profilePictureUrl"
              className={styles.input}
              value={formData.profilePictureUrl}
              onChange={handleInputChange}
            />
            </div> */}

            <div className={styles.field}>
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
              />
            </div>

            <div className={styles.radioFields}>
              <div className={styles.radioHeader}>
                <p>Status</p>
              </div>
              <div className={styles.radioOption}>
                <RadioButton
                  inputId="status"
                  name="status"
                  value={Enums.ACTIVE}
                  onChange={handleInputChange}
                  checked={formData.status === Enums.ACTIVE}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Active
                </label>
                <br />
                <RadioButton
                  inputId="status"
                  name="status"
                  value={Enums.INACTIVE}
                  onChange={handleInputChange}
                  checked={formData.status === Enums.INACTIVE}
                />
                <label htmlFor="notificationMode" className="ml-2">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div>
            <Button label="Save" className={styles.customButton} raised />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditAccountForm;