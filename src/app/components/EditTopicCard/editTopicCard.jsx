"use client";
import { Button } from "primereact/button";
import styles from "./editTopicCard.module.css";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { updateTopic } from "@/app/api/topic/route";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import Enums from "@/app/common/enums/enums";

const EditTopicCard = ({
  topic,
  hideEditDialog,
  editTopicDialogOpen,
  categories,
  userIdRef,
  accessToken,
  setRefreshData,
  onSubmitSuccess,
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
  const [status, setStatus] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [formData, setFormData] = useState({
    topicTitle: "",
    topicDescription: "",
    status: "",
    categoryId: "",
    userId: userIdRef,
  });
  const maxCharacterCount = 8000;

  const [titleValid, setTitleValid] = useState(true);
  const [contentValid, setContentValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const [statusValid, setStatusValid] = useState(true);
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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.value,
    }));
  };

  useEffect(() => {
    if (topic) {
      setTopicTitle(topic.topicTitle || "");
      setTopicDescription(topic.topicDescription || "");
      setSelectedCategory(topic.category.categoryTitle || "");
      setStatus(topic.status || "");
      setFormData((prevData) => ({
        ...prevData,
        topicTitle: topic.topicTitle || "",
        topicDescription: topic.topicDescription || "",
        status: topic.status || "",
        categoryId: topic.category.categoryId || "",
        userId: userIdRef,
      }));
    }
  }, [topic]);

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

    if (!status) {
      setStatusValid(false);
    } else {
      setStatusValid(true);
    }

    if (
      topicTitle.trim() &&
      topicDescription.trim() &&
      selectedCategory &&
      status &&
      checkedGuideLines
    ) {
      setFormValid(true);

      try {
        const response = await updateTopic(
          topic.topicId,
          formData,
          accessToken
        );

        if (response) {
           if (showToast.current) {
             showToast.current.show({
               severity: "success",
               summary: "Success",
               detail: "Successfully Updated Topic",
               life: 5000,
             });
           }
        //   toast.current?.show({
        //     severity: "success",
        //     summary: "Success",
        //     detail: "Successfully Edited Topic",
        //     life: 5000,
        //   });
        }
        setRefreshData((prev) => !prev);
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
        // toast.current?.show({
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
        // toast.current?.show({
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
        // toast.current?.show({
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
        // toast.current?.show({
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
        // toast.current?.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please agree to the guidelines",
        //   life: 5000,
        // });
      }

      if (!status) {
           if (showToast.current) {
             showToast.current.show({
               severity: "warn",
               summary: "Warning",
               detail: "Please select a status",
               life: 5000,
             });
           }
        // toast.current?.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please select the post status",
        //   life: 5000,
        // });
      }
    }
  };

  return (
    <>
      <Dialog
        header="Edit Topic"
        visible={editTopicDialogOpen}
        onHide={hideEditDialog}
        className={styles.editTopicDialog}
        draggable={false}
      >
        <div className={styles.formContainer}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.header}>
              <h5 className={styles.newTopicMessage}>
                Your post is tied to your account. Please read the guidelines
                and be responsible when creating a post on Kideas&apos; forum to
                avoid post removal. Happy posting!
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
            <div className={styles.statusContainer}>
              <h4 className={styles.statusHeader}>Status</h4>
              <div className={styles.status}>
                <div className={styles.statusOption}>
                  <RadioButton
                    value="Active"
                    name="status"
                    onChange={handleStatusChange}
                    checked={status === "Active"}
                  />
                  <label className={styles.statusLabel}>Active</label>
                </div>
                <div className={styles.statusOption1}>
                  <RadioButton
                    value="Inactive"
                    name="status"
                    onChange={handleStatusChange}
                    checked={status === "Inactive"}
                  />
                  <label className={styles.statusLabel1}>Inactive</label>
                </div>
              </div>
            </div>
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
                  I have read and understand the community guidelines. I am
                  aware that my post may be edited or rejected to uphold
                  community guidelines.
                </label>
              </div>
            </div>
            <div className={styles.submitButtonContainer}>
              <Button label="Submit" size="small" rounded />
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default EditTopicCard;
