"use client";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import styles from "./createTopicButton.module.css";
// import CreatePost from "../CreatePost/CreatePost";
import { Dialog } from "primereact/dialog";
import CreateTopic from "../CreateTopic/createTopic";
import { Toast } from "primereact/toast";

const CreateTopicButton = ({
  userIdRef,
  accessToken,
  categories,
  setRefreshData,
}) => {
  const [createTopicDialog, setCreateTopicDialog] = useState(false);
  const toast = useRef(null);
  const handleOnClick = () => {
    setCreateTopicDialog(true);
  };

  const onHideDialog = () => {
    setCreateTopicDialog(false);
  };

  const handleFormSubmitSuccess = () => {
    onHideDialog();
    // Presumably you would want to call setRefreshData() here to refresh the data after successful post creation
    setRefreshData((prevData) => !prevData);
  };

  return (
    <>
      <Toast ref={toast} />
      {userIdRef && accessToken && (
        <Button
          size="small"
          rounded
          className={styles.createTopicBtn}
          label="Create Topic"
          icon="pi pi-plus"
          onClick={handleOnClick}
        />
      )}
      <Dialog
        header="Create Topic"
        visible={createTopicDialog}
        onHide={onHideDialog}
        className={styles.createTopicDialog}
        draggable={false}
      >
        {/* Uncomment the following line and import CreatePost once it's ready to be used */}
        <CreateTopic
          userIdRef={userIdRef}
          accessToken={accessToken}
          categories={categories}
          onSubmitSuccess={() => setCreateTopicDialog(false)}
          setRefreshData={setRefreshData}
          showToast={toast}
        />
      </Dialog>
    </>
  );
};

export default CreateTopicButton;
