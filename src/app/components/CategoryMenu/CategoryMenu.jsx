"use client";
import { Menu } from "primereact/menu";
const CategoryMenu = ({
  setCategoryTitle,
  categories,
  setForumGuideLinesByCategory,
}) => {
  const finalForumCategories = categories?.map((category) => {
    const finalForumCategory = {
      label: category.categoryTitle,
      command: () => {
        setCategoryTitle(category.categoryTitle);
        setForumGuideLinesByCategory(category.forumGuidelines);
      },
    };
    return finalForumCategory;
  });

  return (
    <>
      <Menu model={finalForumCategories} />
    </>
  );
};

export default CategoryMenu;
