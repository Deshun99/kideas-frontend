"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./createTopic.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Enums from "@/app/common/enums/enums";
import { createTopic } from "@/app/api/topic/route";

const CreateTopic = ({
  userIdRef,
  accessToken,
  categories,
  onSubmitSuccess,
  setRefreshData,
  showToast,
}) => {
  categories = categories?.filter(
    (category) => category.categoryTitle !== "My Posts"
  ); // don't want show 'My Posts' as an option for user to select

  const forumCategoryTitleToId = {};
  categories.forEach((category) => {
    forumCategoryTitleToId[category.categoryTitle] = category.categoryId;
  });

  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [formData, setFormData] = useState({
    topicTitle: "",
    topicDescription: "",
    status: Enums.ACTIVE,
    createdAt: new Date(),
    userId: userIdRef,
  });
  const toast = useRef(null);
  const maxCharacterCount = 8000;

  const [titleValid, setTitleValid] = useState(true);
  const [contentValid, setContentValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const [guideLinesValid, setGuideLinesValid] = useState(true);
  const [formValid, setFormValid] = useState(true);

  const handleTopicTitleChange = (e) => {
    setTopicTitle(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      topicTitle: e.target.value,
    }));
  };

  const handleTopicDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setTopicDescription(e.target.value);
      setFormData((prevData) => ({
        ...prevData,
        topicDescription: e.target.value,
      }));
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    const selectedCategoryId = forumCategoryTitleToId[e.target.value];
    setFormData((prevData) => ({
      ...prevData,
      categoryId: selectedCategoryId,
    }));
  };

  const resetForm = () => {
    setTopicTitle("");
    setTopicDescription("");
    setSelectedCategory("");
    setCheckedGuideLines("");
    setFormData({
      topicTitle: "",
      topicDescription: "",
      status: Enums.ACTIVE,
      createdAt: new Date(),
      userId: userIdRef,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check title validity
    if (!topicTitle.trim()) {
      setTitleValid(false);
    } else {
      setTitleValid(true);
    }

    // Check content validity
    if (!topicDescription.trim()) {
      setContentValid(false);
    } else {
      setContentValid(true);
    }

    // Check category validity
    if (!selectedCategory) {
      setCategoryValid(false);
    } else {
      setCategoryValid(true);
    }

    // Check guidelines validity
    if (!checkedGuideLines) {
      setGuideLinesValid(false);
    } else {
      setGuideLinesValid(true);
    }

    if (
      topicTitle.trim() &&
      topicDescription.trim() &&
      selectedCategory &&
      checkedGuideLines
    ) {
      setFormValid(true);

      try {
        const response = await createTopic(formData, accessToken);

        if (response) {
          if(showToast.current) {
            showToast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Successfully Created Topic",
              life: 5000,
            });
          }
        //   toast.current.show({
        //     severity: "success",
        //     summary: "Success",
        //     detail: "Successfully Created Topic",
        //     life: 5000,
        //   });
        }
        setRefreshData((prev) => !prev);
        resetForm();
        onSubmitSuccess();
      } catch (error) {
        if (showToast.current) {
          showToast.current.show({
            severity: "error",
            summary: "Error",
            detail: "There was an error creating topic",
            life: 5000,
          });
        }
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error",
        //   detail: "There was an error creating topic",
        //   life: 5000,
        // });
      }
    } else {
      // The form is invalid, do not submit
      setFormValid(false);

      // Show a toast message for each empty field
      if (!topicTitle.trim()) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please fill up the title",
            life: 5000,
          });
        }
        // toast.current.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please fill up the title",
        //   life: 5000,
        // });
      }

      if (!topicDescription.trim()) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please fill up the content",
            life: 5000,
          });
        }
        // toast.current.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please fill up the content",
        //   life: 5000,
        // });
      }

      if (!selectedCategory) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please select a category",
            life: 5000,
          });
        }
        // toast.current.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please select a category",
        //   life: 5000,
        // });
      }

      if (!checkedGuideLines) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please agree to the guidelines",
            life: 5000,
          });
        }
        // toast.current.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please agree to the guidelines",
        //   life: 5000,
        // });
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <Toast ref={toast} />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.header}>
          <h5 className={styles.newTopicMessage}>
            Your post is tied to your account. Please read the guidelines and be
            responsible when creating a post on Kideas&apos; forum to avoid
            post removal. Happy posting!
          </h5>
        </div>
        <div className={styles.topicTitleContainer}>
          <h4 className={styles.topicTitleHeader}>Title</h4>
          <InputTextarea
            rows={1}
            cols={75}
            value={topicTitle}
            onChange={(e) => handleTopicTitleChange(e)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.topicDescriptionContainer}>
          <h4 className={styles.topicDescriptionHeader}>Content</h4>
          <InputTextarea
            rows={10}
            cols={75}
            value={topicDescription}
            onChange={(e) => handleTopicDescriptionChange(e)}
            className={styles.textarea}
          />
          <div className={styles.characterCount}>
            {maxCharacterCount - topicDescription.length} characters left
          </div>
        </div>
        <div className={styles.categoriesContainer}>
          <h4 className={styles.categoriesHeader}>Category</h4>
          <div className={styles.categories}>
            {categories.map((category) => (
              <div
                key={category.categoryTitle}
                className={styles.categoryLabelContainer}
              >
                <RadioButton
                  value={category.categoryTitle}
                  name="category"
                  onChange={(e) => handleCategoryChange(e)}
                  checked={selectedCategory === category.categoryTitle}
                />
                <label className={styles.categoryLabel}>
                  {category.categoryTitle}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* <div className={styles.anonymousContainer}>
          <div className={styles.anonymous}>
            <div>
              <Checkbox
                inputId="anonymous"
                onChange={(e) => handleAnonymousChange(e)}
                checked={anonymous}
              />
            </div>
            <label htmlFor="anonymous" className={styles.anonymousText}>
              Do you wish your post to be anonymous?
            </label>
          </div>
        </div> */}
        <div className={styles.guideLinesContainer}>
          <h4 className={styles.guideLinesHeader}>Guidelines</h4>
          <div className={styles.guideLines}>
            <div>
              <Checkbox
                inputId="guideLines"
                onChange={(e) => setCheckedGuideLines(e.checked)}
                checked={checkedGuideLines}
              />
            </div>
            <label htmlFor="guideLines" className={styles.guideLinesText}>
              I have read and understand the community guidelines. I am aware
              that my post may be edited or rejected to uphold community
              guidelines.
            </label>
          </div>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button label="Submit" size="small" rounded />
        </div>
      </form>
    </div>
  );
};

export default CreateTopic;
