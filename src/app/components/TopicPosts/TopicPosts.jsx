"use client";
import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import styles from "./TopicPosts.module.css";
import moment from "moment";
import { Dialog } from "primereact/dialog";
// import CreateComment from "../CreateCommentModal/CreateComment";
import { useState, useRef } from "react";
import Utility from "@/app/common/helper/utility";
// import DeletePostCard from "../DeletePostCard/DeletePostCard";
// import ReportPostCard from "../ReportPostCard/ReportPostCard";
import { Badge } from "primereact/badge";
import DeleteTopicCard from "../DeleteTopicCard/deleteTopicCard";
import { useRouter } from "next/navigation";
import EditTopicCard from "../EditTopicCard/editTopicCard";
import { Toast } from "primereact/toast";
import { DataView } from "primereact/dataview";

const TopicPosts = ({
  topics,
  userIdRef,
  accessToken,
  setRefreshData,
  categories,
  searchQuery,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [editTopicDialogOpen, setEditTopicDialogOpen] = useState(false);
  const router = useRouter();
  const toast = useRef(null);

  const [postData, setPostData] = useState("");

  const filteredPosts = Array.isArray(topics)
    ? topics.filter((post) =>
        post.topicTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // State to track the number of displayed posts
  const [displayedPostsCount, setDisplayedPostsCount] = useState(5); // Start with 5 posts
  const postsToDisplay = filteredPosts.slice(0, displayedPostsCount);

  // Function to load more posts
  const loadTopicsLazy = () => {
    setDisplayedPostsCount((prevCount) => prevCount + 5); // Load 5 more posts each time
  };

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const openDialog = (data) => {
    setDialogOpen(true);
    setPostData(data); //pass the data of the post to CreateCommentModal
  };

  const hideDialog = () => {
    setDialogOpen(false);
  };

  const openDeleteDialog = (data) => {
    setDeleteDialogOpen(true);
    setPostData(data);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const openReportDialog = (data) => {
    setReportDialogOpen(true);
    setPostData(data);
  };

  const hideReportDialog = () => {
    setReportDialogOpen(false);
  };

  const openEditDialog = (data) => {
    setEditTopicDialogOpen(true);
    setPostData(data);
  }

  const hideEditDialog = () => {
    setEditTopicDialogOpen(false);
  }

  const multimediaPage = (topic) => {
    router.push(`/topic/${topic.topicId}`);
  }

  const truncatedMessage = (data) => {
    return data.topicDescription.length > 500
      ? data.topicDescription.substring(0, 500) + " ..."
      : data.topicDescription;
  };

  const itemTemplate = (data) => {
    return (
      <div className={styles.postContainer}>
        <div className={styles.postTitle}>
          <div className={styles.postTitleText}>{data.topicTitle}</div>
          <div className={styles.postTitleButtonContainer}>
            {data.status === "Inactive" && (
              <div className={styles.inactiveTag}>Inactive</div>
            )}
            {/*
            {data.jobSeeker.userId !== userIdRef && (
              <Button
                size="small"
                icon="pi pi-exclamation-circle"
                rounded
                onClick={() => openReportDialog(data)}
                className={styles.reportButton}
              />
            )} */}
            {data.user.userId === userIdRef && (
              <>
                {/* */}
                <Button
                  size="small"
                  icon="pi pi-pencil"
                  rounded
                  onClick={() => openEditDialog(data)}
                  className={styles.editButton}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.userId}>Posted By: {data.user.userName}</div>
        <div className={styles.postInfo}>
          <div className={styles.idTag}>#{data.topicId}</div>
          <div className={styles.categoryTag}>
            <p>{data.category.categoryTitle}</p>
          </div>
        </div>

        <div className={styles.content}>
          {truncatedMessage(data)}
          {data.topicDescription.length > 500 && (
            <span className={styles.showMore} onClick={() => openDialog(data)}>
              Show More
            </span>
          )}
        </div>

        {/* <div className={styles.thumbnailDataScrollerContent}>
          <DataView
            value={data.multimedias}
            itemTemplate={multimediaTemplate}
            rows={5}
            loader
            header=""
            layout="grid"
          />
        </div> */}

        <div className={styles.footer}>
          <div className={styles.dateTimeText}>
            {Utility.timeAgo(data.createdAt)}
          </div>
          {data.status !== "Inactive" && (
            <div className={styles.videoInfo}>
              <Button
                rounded
                onClick={() => multimediaPage(data)}
                className={styles.multimediaButton}
              >
                {/* <Badge value={data?.multimedias.length} severity="info"></Badge> */}
                Videos
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const multimediaTemplate = (data) => {
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
          <h4 className={styles.thumbnailTitle}>{data.multimediaTitle}</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <div className={styles.card}>
        <DataScroller
          value={filteredPosts}
          itemTemplate={itemTemplate}
          lazy
          onLazyLoad={loadTopicsLazy}
          inline
          scrollHeight="900px"
          header="Scroll Down to Load More"
          emptyMessage="Be the first to leave a post."
        />
      </div>

      <DeleteTopicCard
        topic={postData}
        hideDeleteDialog={hideDeleteDialog}
        deleteDialogOpen={deleteDialogOpen}
        userIdRef={userIdRef}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        hideCommentDialog={hideDialog}
      />

      <EditTopicCard
        topic={postData}
        hideEditDialog={hideEditDialog}
        editTopicDialogOpen={editTopicDialogOpen}
        categories={categories}
        userIdRef={userIdRef}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        hideCommentDialog={hideEditDialog}
        onSubmitSuccess={() => setEditTopicDialogOpen(false)}
        showToast={toast}
      />

      {/* <ReportPostCard
        forumPost={postData}
        hideReportDialog={hideReportDialog}
        reportDialogOpen={reportDialogOpen}
        userIdRef={userIdRef}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        hideCommentDialog={hideDialog}
      /> */}

      <Dialog
        visible={dialogOpen}
        onHide={hideDialog}
        className={styles.createCommentModal}
        draggable={false}
      >
        {/* <CreateComment
          userIdRef={userIdRef}
          accessToken={accessToken}
          postData={postData}
          setRefreshData={setRefreshData}
          openDeleteDialog={openDeleteDialog}
          openReportDialog={openReportDialog}
        /> */}
      </Dialog>
    </>
  );
};

export default TopicPosts;
