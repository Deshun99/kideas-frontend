"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./commentColumn.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import moment from "moment";
import { Button } from "primereact/button";
import {
  createComment,
  getAllForumCommentsByForumPostId,
  getAllForumCommentsByMultimediaId,
} from "@/app/api/comment/route";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
// import ForumComments from "../ForumComments/ForumComments";
import Utility from "@/app/common/helper/utility";
import MultimediaComments from "../MultimediaComments/multimediaComments";

const CommentColumn = ({
  userIdRef,
  accessToken,
  selectedMultimedia,
  setRefreshData,
  onCommentsUpdate,
}) => {
  const [comment, setComment] = useState("");
  const [commentValid, setCommentValid] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [refreshComments, setRefreshComments] = useState(false);
  const [comments, setComments] = useState([]);
  const maxCharacterCount = 8000;
  const toast = useRef(null);

  useEffect(() => {
    // retrieve api comment here
    console.log("Comments refreshed!");
    if (selectedMultimedia) {
      getAllForumCommentsByMultimediaId(selectedMultimedia.multimediaId).then(
        (comments) => setComments(comments.data)
      );
    }
  }, [refreshComments, accessToken, selectedMultimedia]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      userId: userIdRef,
    }));
  }, [userIdRef]);

  const updateComments = (newComments) => {
    onCommentsUpdate(newComments);
  };

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const [formData, setFormData] = useState({
    createdAt: new Date(),
    multimediaId: selectedMultimedia.multimediaId,
    userId: userIdRef,
    commentMessage: "",
  });

  const handleCommentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setComment(inputValue);
      setCommentValid(inputValue.trim() !== "");
      setFormData((prevData) => ({
        ...prevData,
        commentMessage: e.target.value,
      }));
    }
  };

  const resetForm = () => {
    setComment("");
    setCommentValid(false);
    setFormData({
      createdAt: new Date(),
      multimediaId: selectedMultimedia.multimediaId,
      userId: userIdRef,
      commentMessage: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentValid) {
      setFormValid(true);
      
      try {
        const response = await createComment(formData, accessToken);

        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Your comment has been posted",
            life: 5000,
          });
        }

        console.log("Comment has been created");
        resetForm();
        setRefreshData((prev) => !prev);
        setRefreshComments((prev) => !prev);
      } catch (error) {
        console.error(
          "There was an error creating the forum comment",
          error.message
        );
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "There was an error creating the forum comment",
          life: 5000,
        });
      }
    } else {
      setFormValid(false);

      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please leave a comment",
        life: 5000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {selectedMultimedia.status !== "Inactive" && (
        <>
          {userIdRef && accessToken && (
            <div className={styles.leaveCommentContainer}>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.leaveCommentHeader}>
                  <h3>Leave a comment!</h3>
                </div>
                <div className={styles.leaveCommentContent}>
                  <InputTextarea
                    rows={5}
                    cols={75}
                    value={comment}
                    onChange={(e) => handleCommentChange(e)}
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.leaveCommentFooter}>
                  <div className={styles.characterCount}>
                    {maxCharacterCount - comment.length} characters left
                  </div>
                  <div className={styles.commentButtonContainer}>
                    <Button
                      icon="pi pi-arrow-right"
                      size="small"
                      className={styles.commentButton}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          <div className={styles.allCommentsContainer}>
            <div className={styles.allCommentsHeader}>
              <h3>{comments.length} comments</h3>
            </div>
            <MultimediaComments comments={comments} />
          </div>
        </>
      )}
    </>
  );
};

export default CommentColumn;
