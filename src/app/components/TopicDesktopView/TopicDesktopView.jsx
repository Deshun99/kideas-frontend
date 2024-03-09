"use client";
import CategoryMenu from "../CategoryMenu/CategoryMenu";
import CategoryMenuCarousel from "../CategoryMenuCarousel/CategoryMenuCarousel";
import CreateTopicButton from "../CreateTopicButton/createTopicButton";
import ForumGuidelinesCard from "../ForumGuidelinesCard/forumGuidelinesCard";
import TopicPosts from "../TopicPosts/TopicPosts";
import TopicSearchBar from "../TopicSearchBar/TopicSearchBar";
import styles from "./topicDesktopView.module.css";
import { Card } from "primereact/card";

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
          <div className={styles.leftContainer}>
            {/* <h1 className={styles.categories}>Categories</h1>
            <CategoryMenu
              categories={categories}
              setCategoryTitle={setCategoryTitle}
              setForumGuideLinesByCategory={setForumGuideLinesByCategory}
            /> */}
            <Card title="Simple Card" className={styles.advertistment}>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa
                ratione quam perferendis esse, cupiditate neque quas! Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Inventore
                sed consequuntur error repudiandae numquam deserunt quisquam
                repellat libero asperiores earum nam nobis, culpa ratione quam
                perferendis esse, cupiditate neque quas! Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae numquam deserunt quisquam repellat libero
                asperiores earum nam nobis, culpa ratione quam perferendis esse,
                cupiditate neque quas!
              </p>
            </Card>
          </div>
          <div className={styles.middleContainer}>
            <div className={styles.menuContainer}>
              <CategoryMenuCarousel
                categories={categories}
                setCategoryTitle={setCategoryTitle}
                setForumGuideLinesByCategory={setForumGuideLinesByCategory}
              />
            </div>
            <div className={styles.topMiddleContainer}>
              <div className={styles.searchBarContainer}>
                <TopicSearchBar
                  onSearchQueryChange={onSearchQueryChange}
                  searchQuery={searchQuery}
                />
              </div>
              <div className={styles.createPostBtnContainer}>
                <CreateTopicButton
                  userIdRef={userIdRef}
                  accessToken={accessToken}
                  categories={categories}
                  setRefreshData={setRefreshData}
                />
              </div>
            </div>
            <h2 className={styles.title}>{categoryTitle}</h2>
            <div className={styles.postsContainer}>
              <TopicPosts
                topics={topics}
                userIdRef={userIdRef}
                accessToken={accessToken}
                setRefreshData={setRefreshData}
                categories={categories}
                searchQuery={searchQuery}
              />
            </div>
          </div>
          <div className={styles.rightContainer}>
            {/* <ForumGuidelinesCard
              categoryTitle={categoryTitle}
              forumGuideLinesByCategory={forumGuideLinesByCategory}
            /> */}
            <Card title="Simple Card" className={styles.advertistment}>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa
                ratione quam perferendis esse, cupiditate neque quas! Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Inventore
                sed consequuntur error repudiandae numquam deserunt quisquam
                repellat libero asperiores earum nam nobis, culpa ratione quam
                perferendis esse, cupiditate neque quas! Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae numquam deserunt quisquam repellat libero
                asperiores earum nam nobis, culpa ratione quam perferendis esse,
                cupiditate neque quas!
              </p>
            </Card>
          </div>
        </div>
      </>
    );
};

export default TopicDesktopView;