import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ReactPlayer from "react-player";
import Image from "next/image";
import HumanIcon from "../../../../public/icon.png";
import styles from "./multimediaLeftColumn.module.css";
import CommentColumn from "@/app/components/CommentColumn/commentColumn";
import Utility from "@/app/common/helper/utility";
import { Skeleton } from "primereact/skeleton";

const MultimediaLeftColumn = ({
  selectedMultimedia,
  userIdRef,
  accessToken,
  openEditDialog,
  setRefreshData,
  handleCommentsUpdate,
  playerWrapperRef,
}) => {
  return (
    <div className={styles.multimediaLeftColumn}>
      {selectedMultimedia ? (
        <>
          <div className={styles.playerWrapper} ref={playerWrapperRef}>
            <ReactPlayer
              className={styles.reactPlayer}
              url={selectedMultimedia ? [selectedMultimedia.videoLinkUrl] : []}
              controls={true}
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", // This will work for browsers that support it
                  },
                },
              }}
            />
          </div>
          <Card
            title={
              selectedMultimedia
                ? selectedMultimedia.multimediaTitle
                : "Empty Title"
            }
            className={styles.multimediaColumn1}
          >
            <div className={styles.multimediaRow}>
              <div className={styles.imageContainer}>
                {selectedMultimedia &&
                selectedMultimedia.user.profilePictureUrl ? (
                  <Image
                    className={styles.avatar}
                    alt="Profile Photo"
                    width={40}
                    height={40}
                    src={selectedMultimedia.user.profilePictureUrl}
                  />
                ) : (
                  <Image
                    alt="Profile Photo"
                    width={40}
                    height={40}
                    src={HumanIcon}
                  />
                )}
                <p className="m-0">
                  {selectedMultimedia
                    ? selectedMultimedia.user.userName
                    : "Username"}
                </p>
              </div>
              {selectedMultimedia &&
                selectedMultimedia.user.userId === userIdRef && (
                  <Button
                    size="small"
                    icon="pi pi-file-edit"
                    label="Edit Multimedia"
                    rounded
                    onClick={openEditDialog}
                    className={styles.editMultimediaBtn}
                  />
                )}
            </div>
            <div className={styles.descriptionContainer}>
              <h5 className="m-0">
                Posted:{" "}
                {selectedMultimedia
                  ? Utility.timeAgo(selectedMultimedia.createdAt)
                  : "Date"}
              </h5>
              <p className="m-0">
                {selectedMultimedia
                  ? selectedMultimedia.multimediaDescription
                  : "Description"}
              </p>
            </div>
          </Card>
          <Card className={styles.multimediaColumn1}>
            <CommentColumn
              userIdRef={userIdRef}
              accessToken={accessToken}
              selectedMultimedia={selectedMultimedia}
              setRefreshData={setRefreshData}
              onCommentsUpdate={handleCommentsUpdate}
            />
          </Card>
        </>
      ) : (
        <Skeleton width="100%" height="40rem" />
      )}
    </div>
  );
};

export default MultimediaLeftColumn;