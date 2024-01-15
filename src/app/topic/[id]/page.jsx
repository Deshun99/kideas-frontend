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
import Utility from "@/app/common/helper/utility";
import { Skeleton } from "primereact/skeleton";
import EditMultimediaCard from "@/app/components/EditMultimediaCard/editMultimediaCard";
import CommentColumn from "@/app/components/CommentColumn/commentColumn";
import MultimediaLeftColumn from "@/app/components/MultimediaLeftColumn/MultimediaLeftColumn";
import MultimediaRightColumn from "@/app/components/MultimediaRightColumn/MultimediaRightColumn";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const hideEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleMultimediaUpdate = (updatedMultimedia) => {
    setSelectedMultimedia(updatedMultimedia);
    setRefreshData((prev) => !prev); // Assuming this triggers a re-fetch or update of the data.
  };

  const handleCommentsUpdate = (newComments) => {
    if (selectedMultimedia) {
      setSelectedMultimedia({
        ...selectedMultimedia,
        comments: newComments,
      });
    }
  };

  //Boilerplate code
  const [selectedMultimedia, setSelectedMultimedia] = useState(null);

  // Filter multimedia items based on search query
  const filteredMultimedias = useMemo(() => {
    if (!topic || !topic.multimedias) return [];

    return topic.multimedias.filter((multimedia) =>
      multimedia.multimediaTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [topic, searchQuery]);

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

  useEffect(() => {
    // When selectedMultimedia changes, update the corresponding item in the list
    if (selectedMultimedia && topic?.multimedias) {
      setTopic((currentTopic) => {
        const updatedMultimedias = currentTopic.multimedias.map((item) =>
          item.multimediaId === selectedMultimedia.multimediaId
            ? selectedMultimedia
            : item
        );
        return { ...currentTopic, multimedias: updatedMultimedias };
      });
    }
  }, [selectedMultimedia]);

  return (
    <>
      <Toast ref={toast} />
      {mounted && (
        <MediaQuery minWidth={1}>
          <div className={styles.multimediaContainer}>
            <MultimediaLeftColumn
              selectedMultimedia={selectedMultimedia}
              userIdRef={userIdRef}
              accessToken={accessToken}
              openEditDialog={openEditDialog}
              setRefreshData={setRefreshData}
              handleCommentsUpdate={handleCommentsUpdate}
              playerWrapperRef={playerWrapperRef}
            />
            <MultimediaRightColumn
              selectedMultimedia={selectedMultimedia}
              setSelectedMultimedia={setSelectedMultimedia}
              userIdRef={userIdRef}
              accessToken={accessToken}
              searchQuery={searchQuery}
              handleSearchQueryChange={handleSearchQueryChange}
              openCreateDialog={openCreateDialog}
              filteredMultimedias={filteredMultimedias}
            />
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
      <EditMultimediaCard
        multimedia={selectedMultimedia}
        hideEditDialog={hideEditDialog}
        openEditDialog={editDialogOpen}
        userIdRef={userIdRef}
        topicIdRef={params.id}
        accessToken={accessToken}
        onMultimediaUpdate={handleMultimediaUpdate}
        onSubmitSuccess={() => setEditDialogOpen(false)}
        showToast={toast}
      />
    </>
  );
};

export default TopicDetails;
