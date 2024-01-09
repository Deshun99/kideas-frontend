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
import { getOneTopic } from "@/app/api/topic/route";

const TopicDetails = ({ params }) => { 
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

  console.log(params.id);

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const hideCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  //Boilerplate code
  const [products, setProducts] = useState([]);
  const ds = useRef(null);

  const itemTemplate = (data) => {
    return (
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnailImageContainer}>
          <img
            src={data.thumbnailUrl}
            alt="Profile Picture"
            className={styles.thumbnailImage}
          />
        </div>
        <div className={styles.thumbnailContent}>
          <h5 className={styles.thumbnailTitle}>{data.multimediaTitle}</h5>
          <p className={styles.thumbnailUsername}>{data.user.userName}</p>
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
    if(params) {
      getOneTopic(params.id)
      .then((topic) => {
        console.log(topic.data);
        setTopic(topic.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
    }
  }, [params]);

  return (
    <>
      <Toast ref={toast} />
      {mounted && (
        <MediaQuery minWidth={1}>
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
              <Card
                title="3,316 Comments"
                className={styles.multimediaColumn1}
              ></Card>
            </div>
            <div className={styles.multimediaRightColumn}>
              <Button
                size="small"
                icon="pi pi-plus"
                label="Create Multimedia"
                rounded
                onClick={openCreateDialog}
                className={styles.createMultimediaBtn}
              />
              <DataScroller
                ref={ds}
                value={topic?.multimedias}
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
        topicIdRef={params.id}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        onSubmitSuccess={() => setCreateDialogOpen(false)}
        showToast={toast}
      />
    </>
  );
};

export default TopicDetails;
