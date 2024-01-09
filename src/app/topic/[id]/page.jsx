"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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
import MultimediaSearchBar from "@/app/components/MultimediaSearchBar/multimediaSearchBar";

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

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const hideCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  //Boilerplate code
  const [selectedMultimedia, setSelectedMultimedia] = useState(null);
  const ds = useRef(null);

  // Filter multimedia items based on search query
  const filteredMultimedias = useMemo(() => {
    if (!topic || !topic.multimedias) return [];

    return topic.multimedias.filter((multimedia) =>
      multimedia.multimediaTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [topic, searchQuery]);

  const itemTemplate = (data) => {
    const isSelected =
      selectedMultimedia &&
      selectedMultimedia.multimediaId === data.multimediaId;

    const handleItemClick = () => {
      console.log("Item clicked:", data); // Log the clicked item
      setSelectedMultimedia(data);
    };
    return (
      <div
        className={`${styles.thumbnailContainer} ${
          isSelected ? styles.selectedItem : ""
        }`}
        onClick={handleItemClick}
      >
        <div className={styles.thumbnailImageContainer}>
          <img
            src={data.thumbnailUrl}
            alt="Profile Picture"
            className={styles.thumbnailImage}
          />
        </div>
        <div className={styles.thumbnailContent}>
          <h4 className={styles.thumbnailTitle}>{data.multimediaTitle}</h4>
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
    if (params) {
      getOneTopic(params.id)
        .then((topic) => {
          console.log(topic.data);
          setTopic(topic.data);

          // Check if multimedias array is present and has more than 0 items
          if (topic.data.multimedias && topic.data.multimedias.length > 0) {
            setSelectedMultimedia(topic.data.multimedias[0]); // Set the first multimedia item
          } else {
            setSelectedMultimedia(null); // Set to null if no multimedia items are available
          }
        })
        .catch((error) => {
          console.error("Error fetching topic:", error);
        });
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
                  url={
                    selectedMultimedia ? [selectedMultimedia.videoLinkUrl] : []
                  }
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
                <div className={styles.imageContainer}>
                  <Image
                    src={HumanIcon}
                    alt="Profile Picture"
                    className={styles.avatar}
                  />
                  <p className="m-0">
                    {selectedMultimedia
                      ? selectedMultimedia.user.userName
                      : "Username"}
                  </p>
                </div>
                <div className={styles.descriptionContainer}>
                  <h5 className="m-0">
                    Posted:{" "}
                    {selectedMultimedia ? selectedMultimedia.createdAt : "Date"}
                  </h5>
                  <p className="m-0">
                    {selectedMultimedia
                      ? selectedMultimedia.multimediaDescription
                      : "Description"}
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
              <MultimediaSearchBar
                onSearchQueryChange={handleSearchQueryChange}
                searchQuery={searchQuery}
              />
              <DataScroller
                ref={ds}
                value={filteredMultimedias}
                itemTemplate={itemTemplate}
                rows={5}
                loader
                header=""
                grid
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
