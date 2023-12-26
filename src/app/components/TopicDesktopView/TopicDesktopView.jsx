"use client";
import CategoryMenu from "../CategoryMenu/CategoryMenu";
import TopicSearchBar from "../TopicSearchBar/TopicSearchBar";
import styles from "./topicDesktopView.module.css";

const TopicDesktopView = ({
  categoryTitle,
  setCategoryTitle,
  forumGuideLinesByCategory,
  setForumGuideLinesByCategory,
  userIdRef,
  accessToken,
  categories,
  topics,
  setRefreshData,
  onSearchQueryChange,
  searchQuery,
}) => {
    return (
      <>
        <div className={styles.pageContainer}>
          <div className={styles.categoriesMenuContainer}>
            <h1 className={styles.categories}>Categories</h1>
            <CategoryMenu
              categories={categories}
              setCategoryTitle={setCategoryTitle}
              setForumGuideLinesByCategory={setForumGuideLinesByCategory}
            />
          </div>
          <div className={styles.middleContainer}>
            <div className={styles.topMiddleContainer}>
              <div className={styles.searchBarContainer}>
                <TopicSearchBar
                  onSearchQueryChange={onSearchQueryChange}
                  searchQuery={searchQuery}
                />
              </div>
              <div className={styles.createPostBtnContainer}>
                {/* <ForumCreatePostButton
                  userIdRef={userIdRef}
                  accessToken={accessToken}
                  forumCategories={forumCategories}
                  setRefreshData={setRefreshData}
                /> */}
              </div>
            </div>
            <h2 className={styles.title}>{categoryTitle}</h2>
            <div className={styles.postsContainer}>
              {/* <ForumPosts
                forumPosts={forumPosts}
                userIdRef={userIdRef}
                accessToken={accessToken}
                setRefreshData={setRefreshData}
                searchQuery={searchQuery}
              /> */}
            </div>
          </div>
          <div className={styles.guideLinesContainer}>
            {/* <ForumGuidelinesCard
              forumCategoryTitle={forumCategoryTitle}
              forumGuideLinesByCategory={forumGuideLinesByCategory}
            /> */}
          </div>
        </div>
      </>
    );
};

export default TopicDesktopView;