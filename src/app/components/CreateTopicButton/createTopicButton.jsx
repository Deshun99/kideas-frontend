"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import styles from "./createTopicButton.module.css";
// import CreatePost from "../CreatePost/CreatePost";
import { Dialog } from "primereact/dialog";
import CreateTopic from "../CreateTopic/createTopic";

const CreateTopicButton = ({
  userIdRef,
  accessToken,
  forumCategories,
  setRefreshData,
}) => {
  const [visible, setVisible] = useState(false);

  const handleOnClick = () => {
    setVisible(true);
  };

  const onHideDialog = () => {
    setVisible(false);
  };

  const handleFormSubmitSuccess = () => {
    onHideDialog();
    // Presumably you would want to call setRefreshData() here to refresh the data after successful post creation
    setRefreshData((prevData) => !prevData);
  };

  return (
    <>
      {userIdRef &&
        accessToken && ( // Only show button if userIdRef and accessToken are present
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
        visible={visible}
        onHide={onHideDialog}
        className={styles.createTopicDialog}
        draggable={false}
      >
        {/* Uncomment the following line and import CreatePost once it's ready to be used */}
        <CreateTopic
          userIdRef={userIdRef}
          accessToken={accessToken}
          forumCategories={forumCategories}
          onSubmitSuccess={handleFormSubmitSuccess}
          setRefreshData={setRefreshData}
        />
      </Dialog>
    </>
  );
};

export default CreateTopicButton;
