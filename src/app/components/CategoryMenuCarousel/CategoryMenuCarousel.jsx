"use client";
import { Carousel } from "primereact/carousel";
import styles from './categoryMenuCarousel.module.css';

const CategoryMenuCarousel = ({
  setCategoryTitle,
  categories,
  setForumGuideLinesByCategory,
}) => {
  const categoryTemplate = (category) => {
    return (
      <div
        className={styles.categoryItem}
        onClick={() => {
          setCategoryTitle(category.categoryTitle);
          setForumGuideLinesByCategory(category.forumGuidelines);
        }}
      >
        <div className={styles.categoryTitle}>{category.categoryTitle}</div>
      </div>
    );
  };

  return (
    <Carousel
      value={categories}
      itemTemplate={categoryTemplate}
      numVisible={5}
      numScroll={1}
      circular
    />
  );
};

export default CategoryMenuCarousel;
