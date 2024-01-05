"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MediaQuery, { useMediaQuery } from "react-responsive";
import ReactPlayer from "react-player";
import styles from "./page.module.css";

const TopicDetails = ({ topicId }) => {
  const session = useSession();
  const router = useRouter();

  const roleRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userId =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

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

  useEffect(() => {}, [topicId]);

  return (
    <>
      {mounted && (
        <MediaQuery minWidth={1}>
          <h1>Test video</h1>
          <div className={styles.playerWrapper} ref={playerWrapperRef}>
            <ReactPlayer
              className={styles.reactPlayer}
              url="https://kideas-upload.s3.ap-southeast-2.amazonaws.com/StarHire+Demo+Video.mp4"
              width="50%"
              height="50%"
              controls={true}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", // This will work for browsers that support it
                  },
                },
              }}
            />
          </div>
        </MediaQuery>
      )}
    </>
  );
};

export default TopicDetails;
