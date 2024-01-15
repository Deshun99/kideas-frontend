"use client";
import { DataScroller } from "primereact/datascroller";
import styles from "./multimediaComments.module.css";
import moment from "moment";
import Image from "next/image";
import HumanIcon from "../../../../public/icon.png";
import { Card } from "primereact/card";
import Utility from "@/app/common/helper/utility";

const MultimediaComments = ({ comments }) => {
  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const itemTemplate = (data) => {
    return (
      <>
        <div className={styles.commentContainer}>
          <div className={styles.userSection}>
            <div className={styles.userProfilePhoto}>
              {data?.user.profilePictureUrl ? (
                <Image
                  className={styles.userProfilePhoto}
                  alt="Profile Photo"
                  width={40}
                  height={40}
                  src={data?.user.profilePictureUrl}
                />
              ) : (
                <Image
                  alt="Profile Photo"
                  width={40}
                  height={40}
                  src={HumanIcon}
                />
              )}
            </div>
            <div className={styles.userNameText}>
              {data?.user.userName}
            </div>
          </div>
          <div className={styles.commentAndDateTimeSection}>
            <Card className={styles.commentMsgCard}>
              {data?.commentMessage}
            </Card>
            <div className={styles.commentTimeStamp}>
              {Utility.timeAgo(data?.createdAt)}
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className={styles.card}>
        <DataScroller
          value={comments}
          itemTemplate={itemTemplate}
          rows={5}
          inline
          scrollHeight="500px"
          emptyMessage="Be the first comment."
        />
      </div>
    </>
  );
};

export default MultimediaComments;
