"use client";
import { InputText } from "primereact/inputtext";
import styles from "./multimediaSearchBar.module.css";

const MultimediaSearchBar = ({ onSearchQueryChange, searchQuery }) => {
  const handleInputChange = (event) => {
    const query = event.target.value;
    onSearchQueryChange(query);
  };

  return (
    <>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          className={styles.forumSearchBar}
          placeholder="Search multimedia"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </span>
    </>
  );
};

export default MultimediaSearchBar;
