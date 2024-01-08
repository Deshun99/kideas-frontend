"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MediaQuery, { useMediaQuery } from "react-responsive";
import ReactPlayer from "react-player";
import styles from "./page.module.css";
import { Card } from "primereact/card";
import HumanIcon from "../../../../public/icon.png";
import Image from "next/image";
import { DataScroller } from "primereact/datascroller";
import CreateMultimediaCard from "@/app/components/CreateMultimediaCard/createMultimediaCard";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const TopicDetails = ({ topicId }) => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
  const toast = useRef(null);

  const roleRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const [topic, setTopic] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  }

  const hideCreateDialog = () => {
    setCreateDialogOpen(false);
  }

  //Boilerplate code
  const [products, setProducts] = useState([]);
  const ds = useRef(null);

  const itemTemplate = (data) => {
    return (
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnailImage}>

        </div>
        <div className={styles.thumbnailContent}>

        </div>
      </div>
    );
  };

  const [mounted, setMounted] = useState(false);
  const playerWrapperRef = useRef();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If the player has rendered, attempt to disable download
    const videoElement = playerWrapperRef.current?.querySelector("video");
    if (videoElement) {
      videoElement.setAttribute("controlsList", "nodownload");
    }
  }, [mounted]); // Dependency on mounted to make sure ReactPlayer has been rendered

  useEffect(() => {
  
  }, [topicId]);

  return (
    <>
      <Toast ref={toast} />
      {mounted && (
        <MediaQuery minWidth={1200}>
          <div className={styles.multimediaContainer}>
            <div className={styles.multimediaLeftColumn}>
              <div className={styles.playerWrapper} ref={playerWrapperRef}>
                <ReactPlayer
                  className={styles.reactPlayer}
                  url={[
                    "https://www.youtube.com/watch?v=11cta61wi0g",
                    // "https://kideas-upload.s3.ap-southeast-2.amazonaws.com/StarHire+Demo+Video.mp4",
                  ]}
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
                title="Test Video to test whether things are functioning as normal"
                className={styles.multimediaColumn1}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={HumanIcon}
                    alt="Profile Picture"
                    className={styles.avatar}
                  />
                  <p className="m-0">Lorem Ipsum</p>
                </div>
                <div className={styles.descriptionContainer}>
                  <h5 className="m-0">Posted: 10 months ago</h5>
                  <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Inventore sed consequuntur error repudiandae numquam
                    deserunt quisquam repellat libero asperiores earum nam
                    nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!
                  </p>
                </div>
              </Card>
              <Card title="3,316 Comments" className={styles.multimediaColumn1}>
                <Button
                  size="small"
                  icon="pi pi-pencil"
                  rounded
                  onClick={openCreateDialog}
                  className={styles.editButton}
                />
              </Card>
            </div>
            <div className={styles.multimediaRightColumn}>
              <DataScroller
                ref={ds}
                value={products}
                itemTemplate={itemTemplate}
                rows={5}
                loader
                header="Click Load Button at Footer to Load More"
              />
            </div>
          </div>
        </MediaQuery>
      )}
      <CreateMultimediaCard
        hideCreateDialog={hideCreateDialog}
        openCreateDialog={createDialogOpen}
        userIdRef={userIdRef}
        topicIdRef={topicId}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        onSubmitSuccess={() => setCreateDialogOpen(false)}
      />
    </>
  );
};

export default TopicDetails;
