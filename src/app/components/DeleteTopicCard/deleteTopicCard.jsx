"use client";

import { Button } from "primereact/button";
import styles from "./deleteTopicCard.module.css";
import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { deleteTopicByContentCreator } from "@/app/api/topic/route";

const DeleteTopicCard = ({
  topic,
  hideDeleteDialog,
  deleteDialogOpen,
  userIdRef,
  accessToken,
  setRefreshData,
  hideCommentDialog,
}) => {
  const toast = useRef(null);
  
  const deletePost = async () => {
    try {
      await deleteTopicByContentCreator(
        topic.topicId,
        userIdRef,
        accessToken
      );
      setRefreshData((prev) => !prev);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Your post has been deleted",
        life: 5000,
      });
      hideDeleteDialog();
      hideCommentDialog();
    } catch (error) {
      console.error("There was an error deleting this post", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error deleting this post",
        life: 5000,
      });
    }
  };
  const deleteForumPostDialogFooter = () => (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        rounded
        outlined
        onClick={hideDeleteDialog}
      />
      <Button label="Yes" rounded icon="pi pi-check" onClick={deletePost} />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={deleteDialogOpen}
        onHide={hideDeleteDialog}
        draggable={false}
        footer={deleteForumPostDialogFooter}
        header={`Delete Post ID ${topic.topicId}`}
      >
        <p>
          Are you sure you want to archive this topic with ID{" "}
          <strong>{topic.topicId}</strong> and topic title{" "}
          <strong>{topic.topicTitle}</strong>?
        </p>
      </Dialog>
    </>
  );
};

export default DeleteTopicCard;
