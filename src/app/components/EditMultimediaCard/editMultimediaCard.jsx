"use client";
import { Button } from "primereact/button";
import styles from "./editMultimediaCard.module.css";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import Enums from "@/app/common/enums/enums";
import { removeFile, uploadFile } from "@/app/api/upload/route";
import { createMultimedia, updateMultimedia } from "@/app/api/multimedia/route";
import { ProgressBar } from "primereact/progressbar";
import ReactPlayer from "react-player";
import { ProgressSpinner } from "primereact/progressspinner";

const EditMultimediaCard = ({
  multimedia,
  hideEditDialog,
  openEditDialog,
  userIdRef,
  topicIdRef,
  accessToken,
  onMultimediaUpdate,
  onSubmitSuccess,
  showToast,
}) => {
  const [multimediaTitle, setMultimediaTitle] = useState("");
  const [multimediaDescription, setMultimediaDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoLinkUrl, setVideoLinkUrl] = useState("");
  const [status, setStatus] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [formData, setFormData] = useState({
    multimediaTitle: "",
    multimediaDescription: "",
    thumbnailUrl: "",
    videoLinkUrl: "",
    status: Enums.ACTIVE,
    userId: userIdRef,
  });
  const maxCharacterCount = 8000;

  const [multimediaTitleValid, setMultimediaTitleValid] = useState(true);
  const [multimediaDescriptionValid, setMultimediaDescriptionValid] =
    useState(true);
  const [thumbnailUrlValid, setThumbnailUrlValid] = useState(true);
  const [videoLinkUrlValid, setVideoLinkValid] = useState(true);
  const [statusValid, setStatusValid] = useState(true);
  const [guideLinesValid, setGuideLinesValid] = useState(true);
  const [formValid, setFormValid] = useState(true);

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [videoLinkUploading, setVideoLinkUploading] = useState(false);

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

    setThumbnailUploading(true);
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
        setThumbnailUrl(response.url);
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    } finally {
      setThumbnailUploading(false); // End upload indicator
    }
  };

  const handleVideoLinkUrlChange = async (e) => {
    const file = e.target.files[0];
    const inputId = e.target.id; // Get the ID of the input that triggered the event
    if (!file) return;

    setVideoLinkUploading(true);
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
        setVideoLinkUrl(response.url);
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    } finally {
      setVideoLinkUploading(false); // End upload indicator
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.value,
    }));
  };

  useEffect(() => {
    if (multimedia) {
      setMultimediaTitle(multimedia.multimediaTitle || "");
      setMultimediaDescription(multimedia.multimediaDescription || "");
      setThumbnailUrl(multimedia.thumbnailUrl || "");
      setVideoLinkUrl(multimedia.videoLinkUrl || "");
      setStatus(multimedia.status || "");
      setFormData((prevData) => ({
        ...prevData,
        multimediaTitle: multimedia.multimediaTitle || "",
        multimediaDescription: multimedia.multimediaDescription || "",
        status: multimedia.status || "",
        thumbnailUrl: multimedia.thumbnailUrl || "",
        videoLinkUrl: multimedia.videoLinkUrl || "",
        userId: userIdRef,
      }));
    }
  }, [multimedia]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check title validity
    if (!multimediaTitle.trim()) {
      setMultimediaTitleValid(false);
    } else {
      setMultimediaTitleValid(true);
    }

    // Check description validity
    if (!multimediaDescription.trim()) {
      setMultimediaDescriptionValid(false);
    } else {
      setMultimediaDescriptionValid(true);
    }

    // Check thumbnail Url validity
    if (!thumbnailUrl) {
      setThumbnailUrlValid(false);
    } else {
      setThumbnailUrlValid(true);
    }

    // Check video link validity
    if (!videoLinkUrl) {
      setVideoLinkValid(false);
    } else {
      setVideoLinkValid(true);
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
      multimediaTitle.trim() &&
      multimediaDescription.trim() &&
      thumbnailUrl.trim() &&
      videoLinkUrl.trim() &&
      status &&
      checkedGuideLines
    ) {
      setFormValid(true);

      try {
        const response = await updateMultimedia(
          multimedia.multimediaId,
          formData,
          accessToken
        );

        if (response) {
          if (showToast.current) {
            showToast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Successfully Updated Multimedia",
              life: 5000,
            });
          }
        }
        // setRefreshData((prev) => !prev);
        const updatedMultimedia = response.data; 
        onMultimediaUpdate(updatedMultimedia); 
        onSubmitSuccess();
      } catch (error) {
        if (showToast.current) {
          showToast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 5000,
          });
        }
      }
    } else {
      // The form is invalid, do not submit
      setFormValid(false);

      // Show a toast message for each empty field
      if (!multimediaTitle.trim()) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please fill up the title",
            life: 5000,
          });
        }
      }

      // Show a toast message for each empty field
      if (!multimediaDescription.trim()) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please fill up the description",
            life: 5000,
          });
        }
      }

      // Show a toast message for each empty field
      if (!thumbnailUrl) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please upload a thumbnail",
            life: 5000,
          });
        }
      }

      // Show a toast message for each empty field
      if (!videoLinkUrl) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please upload a video",
            life: 5000,
          });
        }
      }

      // Show a toast message for each empty field
      if (!checkedGuideLines) {
        if (showToast.current) {
          showToast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Please agree to the guidelines",
            life: 5000,
          });
        }
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
      }
    }
  };

  return (
    <>
      <Dialog
        header="Edit Multimedia"
        visible={openEditDialog}
        onHide={hideEditDialog}
        className={styles.editTopicDialog}
        draggable={false}
      >
        <div className={styles.formContainer}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.header}>
              <h5 className={styles.newTopicMessage}>
                Your video is tied to your account. Please read the guidelines
                and be responsible when uploading a video on Kideas&apos; forum
                to avoid removal. Happy posting!
              </h5>
            </div>
            <div className={styles.multimediaTitleContainer}>
              <h4 className={styles.multimediaTitleHeader}>Multimedia Title</h4>
              <InputTextarea
                rows={1}
                cols={75}
                value={multimediaTitle}
                onChange={(e) => handleMultimediaTitleChange(e)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.multimediaDescriptionContainer}>
              <h4 className={styles.multimediaDescriptionHeader}>
                Description
              </h4>
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
            <div className={styles.thumbnailUrlContainer}>
              <h4 className={styles.thumbnailUrlHeader}>Thumbnail</h4>
              <div className={styles.thumbnailRow}>
                <input
                  type="file"
                  id="thumbnailUrl"
                  onChange={handleThumbnailUrlChange}
                  className={styles.thumbnailImageUpload}
                />
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className={styles.thumbnailUrl}
                  />
                )}
                {thumbnailUploading && (
                  <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                )}
              </div>
            </div>
            <div className={styles.videoLinkUrlContainer}>
              <h4 className={styles.videoLinkUrlHeader}>Video Link</h4>
              <div className={styles.videoLinkRow}>
                <input
                  type="file"
                  id="videoLinkUrl"
                  onChange={handleVideoLinkUrlChange}
                  className={styles.videoUpload}
                />
                {videoLinkUrl && (
                  <ReactPlayer
                    url={videoLinkUrl}
                    width="240px"
                    height="135px"
                    controls={true}
                  />
                )}
                {videoLinkUploading && (
                  <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                )}
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
                  aware that my videos may be edited or rejected to uphold
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

export default EditMultimediaCard;
