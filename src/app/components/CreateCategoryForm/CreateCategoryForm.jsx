import React, { useState, useRef } from "react";
import styles from "./createCategoryForm.module.css";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { createCategory } from "@/app/api/category/route";
import { Checkbox } from "primereact/checkbox";

const CreateCategoryForm = ({
  accessToken,
  setRefreshData,
  closeDialog,
  showToast,
}) => {
  const [formData, setFormData] = useState({
    categoryTitle: "",
    forumGuidelines: [""],
    isArchived: false,
  });
  const [validityMessages, setValidityMessages] = useState({});
  const toast = useRef(null);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "forumGuidelines") {
      const updatedGuidelines = [...formData.forumGuidelines];
      updatedGuidelines[index] = value;
      setFormData({
        ...formData,
        forumGuidelines: updatedGuidelines,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isArchived: e.checked });
  };

  const resetForm = () => {
    setFormData({
      categoryTitle: "",
      forumGuidelines: [""],
    });
  };

  const addNewGuideline = () => {
    setFormData({
      ...formData,
      forumGuidelines: [...formData.forumGuidelines, ""],
    });
  };

  const removeGuideline = (index) => {
    const updatedGuidelines = formData.forumGuidelines.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      forumGuidelines: updatedGuidelines,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize a new object to store validation messages
    let newValidityMessages = {};
    let errorMessages = [];

    // Check all guidelines for validity
    formData.forumGuidelines.forEach((guideline, index) => {
      let message = "";
      if (guideline.length === 0) {
        message = `Guideline ${index + 1} cannot be empty!`;
      } else if (guideline.length > 1000) {
        message = `Guideline ${index + 1} is too long! Max 1000 characters.`;
      } else if (guideline.includes("~")) {
        message = `Guideline ${
          index + 1
        } contains the ~ character which is not allowed.`;
      }
      if (message) {
        errorMessages.push(message);
      }
      newValidityMessages[index] = message;
    });

    // Update the validity messages state
    setValidityMessages(newValidityMessages);

    // Show toast with specific error messages if any
    if (errorMessages.length > 0) {
      const detail = errorMessages.join(" ");
      if(showToast.current) {
        showToast.current.show({
          severity: "error",
          summary: "Validation Failed",
          detail: detail,
          life: 5000,
          sticky: true,
        });
      }
      return;
    }

    // Proceed with form submission logic if no errors are found
    try {
      const reqBody = {
        categoryTitle: formData.categoryTitle,
        forumGuidelines: formData.forumGuidelines.join("~"),
        isArchived: formData.isArchived,
      };

      const response = await createCategory(reqBody, accessToken);

      if (response) {
        if(showToast.current) {
          showToast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Successfully Created Category",
            life: 5000,
          });
        }
        setRefreshData((prev) => !prev); // Assuming this is a function passed as a prop
        // Assuming resetForm is a function you have defined to reset the form
        resetForm();
        closeDialog();
      }
    } catch (error) {
      // Handle errors that occur during the API call
      if(showToast.current) {
        showToast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error.message || "An error occurred while creating the category.",
          life: 5000,
          sticky: true,
        });
      }
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.categoryTitleContainer}>
          <h4 className={styles.categoryTitleHeader}>Category Title</h4>
          <InputText
            name="categoryTitle"
            value={formData.categoryTitle}
            onChange={handleInputChange}
            className={styles.textarea}
          />
        </div>
        <div className={styles.forumGuidelinesContainer}>
          <div className={styles.addGuidelineContainer}>
            <h4 className={styles.forumGuidelinesHeader}>Guidelines</h4>
            <Button
              label="Add Guideline"
              onClick={addNewGuideline}
              size="small"
              className={styles.addButton}
              type="button"
            />
          </div>
          {formData.forumGuidelines.map((guideline, index) => (
            <div key={index} className={styles.guidelineInputContainer}>
              <InputTextarea
                name="forumGuidelines"
                value={guideline}
                onChange={(e) => handleInputChange(e, index)}
                className={styles.guidelinetextarea}
              />
              {formData.forumGuidelines.length > 1 && (
                <Button
                  label="Remove"
                  onClick={() => removeGuideline(index)}
                  className={styles.removeButton} // ensure you have this class styled in your CSS
                  size="small"
                  severity="danger"
                  type="button"
                />
              )}
            </div>
          ))}
        </div>
        <div className={styles.checkboxContainer}>
          <h4 className={styles.checkboxLabel}>Archived:</h4>
          <Checkbox
            onChange={handleCheckboxChange}
            checked={formData.isArchived}
          />
        </div>
        <div className={styles.submitButtonContainer}>
          <Button label="Submit" size="small" />
        </div>
      </form>
    </>
  );
};

export default CreateCategoryForm;
