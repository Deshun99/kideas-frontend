"use client";
import { Button } from "primereact/button";
import styles from "./createMultimediaCard.module.css";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import Enums from "@/app/common/enums/enums";
import { removeFile, uploadFile } from "@/app/api/upload/route";

const CreateMultimediaCard = ({
  hideCreateDialog,
  openCreateDialog,
  userIdRef,
  topicIdRef,
  accessToken,
  setRefreshData,
  onSubmitSuccess,
  showToast,
}) => {
  const [multimediaTitle, setMultimediaTitle] = useState("");
  const [multimediaDescription, setMultimediaDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoLinkUrl, setVideoLinkUrl] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [formData, setFormData] = useState({
    multimediaTitle: "",
    multimediaDescription: "",
    thumbnailUrl: "",
    videoLinkUrl: "",
    status: "",
    createdAt: new Date(),
    topicId: topicIdRef,
    userId: userIdRef,
  });
  const maxCharacterCount = 8000;

  const handleMultimediaTitleChange = (e) => {
    setMultimediaTitle(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      multimediaTitle: e.target.value,
    }));
  };

  const handleMultimediaDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setMultimediaDescription(e.target.value);
      setFormData((prevData) => ({
        ...prevData,
        multimediaDescription: e.target.value,
      }));
    }
  };

  const handleThumbnailUrlChange = async (e) => {
    const file = e.target.files[0];
    const inputId = e.target.id; // Get the ID of the input that triggered the event
    if (!file) return;
    try {
      if (formData.thumbnailUrl) {
        console.log("Removing");
        console.log(formData.thumbnailUrl);
        await removeFile(formData.thumbnailUrl, accessToken);
      }
      const response = await uploadFile(file, accessToken);

      if (inputId === "thumbnailUrl") {
        setFormData((prevState) => ({
          ...prevState,
          thumbnailUrl: response.url,
        }));
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const handleVideoLinkUrlChange = async (e) => {
    const file = e.target.files[0];
    const inputId = e.target.id; // Get the ID of the input that triggered the event
    if (!file) return;
    try {
      if (formData.videoLinkUrl) {
        console.log("Removing");
        console.log(formData.videoLinkUrl);
        await removeFile(formData.videoLinkUrl, accessToken);
      }
      const response = await uploadFile(file, accessToken);

      if (inputId === "videoLinkUrl") {
        setFormData((prevState) => ({
          ...prevState,
          videoLinkUrl: response.url,
        }));
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Dialog
        header="Create Multimedia"
        visible={openCreateDialog}
        onHide={hideCreateDialog}
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
                value={multimediaTitle}
                onChange={(e) => handleMultimediaTitleChange(e)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.topicDescriptionContainer}>
              <h4 className={styles.topicDescriptionHeader}>Content</h4>
              <InputTextarea
                rows={10}
                cols={75}
                value={multimediaDescription}
                onChange={(e) => handleMultimediaDescriptionChange(e)}
                className={styles.textarea}
              />
              <div className={styles.characterCount}>
                {maxCharacterCount - multimediaDescription.length} characters
                left
              </div>
            </div>
            {/* <div className={styles.categoriesContainer}>
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

export default CreateMultimediaCard;
