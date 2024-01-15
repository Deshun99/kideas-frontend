import React from 'react';
import { Button } from "primereact/button";
import { DataScroller } from "primereact/datascroller";
import MultimediaSearchBar from "@/app/components/MultimediaSearchBar/multimediaSearchBar";
import styles from "./multimediaRightColumn.module.css";

const MultimediaRightColumn = ({
  selectedMultimedia,
  setSelectedMultimedia,
  userIdRef,
  accessToken,
  searchQuery,
  handleSearchQueryChange,
  openCreateDialog,
  filteredMultimedias,
}) => {

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

    return (
      <div className={styles.multimediaRightColumn}>
        {userIdRef && accessToken && (
          <Button
            size="small"
            icon="pi pi-plus"
            label="Create Multimedia"
            rounded
            onClick={openCreateDialog}
            className={styles.createMultimediaBtn}
          />
        )}
        <MultimediaSearchBar
          onSearchQueryChange={handleSearchQueryChange}
          searchQuery={searchQuery}
        />
        <DataScroller
          value={filteredMultimedias}
          itemTemplate={itemTemplate}
          rows={5}
          loader
          header=""
          grid
        />
      </div>
    );
};

export default MultimediaRightColumn;