"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MediaQuery, { useMediaQuery } from "react-responsive";
import { getAllActiveCategoryPublic } from "../api/category/route";
import { getSortedTopics, getUserTopics } from "../api/topic/route";
import TopicDesktopView from "../components/TopicDesktopView/TopicDesktopView";

const Multimedia = () =>  {
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

    const [categoryTitle, setCategoryTitle] =
      useState("Recent Posts");
    const [forumGuideLinesByCategory, setForumGuideLinesByCategory] =
      useState("");
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchQueryChange = (query) => {
      setSearchQuery(query);
    };

    useEffect(() => {
      setMounted(true);
    }, []);

    // const categoryTitleToId = {};
    // categories.forEach((category) => {
    //   categoryTitleToId[category.categoryTitle] =
    //     category.categoryId;
    // });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getAllActiveCategoryPublic();
            const activeCategories = response.data;
            const filteredResponse = response.data.map((category) => ({
              categoryId: category.categoryId,
              categoryTitle: category.categoryTitle,
            }));
            const myPostMenu = { 
              categoryId: 0,
              categoryTitle: "My Posts" };
            filteredResponse.unshift(myPostMenu); // show 'My Posts' menu as first option
            setCategories(filteredResponse);

            const categoryTitleToId = activeCategories.reduce(
              (acc, category) => {
                acc[category.categoryTitle] = category.categoryId;
                return acc;
              },
              {}
            );
            
            // Fetch topics for the selected categoryTitle, if applicable
            if (
              categoryTitle !== "My Posts" &&
              categoryTitle !== "Recent Posts" &&
              categoryTitle
            ) {
              const selectedCategoryId = categoryTitleToId[categoryTitle];
              const selectedCategory = activeCategories.find(c => c.categoryId === selectedCategoryId);
              if (selectedCategory) {
                setTopics(selectedCategory.topics);
                setForumGuideLinesByCategory(selectedCategory.forumGuidelines);
              }
            } else if (categoryTitle === "My Posts" && accessToken) {
              const response = await getUserTopics(
                userId,
                accessToken
              );
              setTopics(response.data);
            } else if (categoryTitle === "Recent Posts") {
              const response = await getSortedTopics();
              setTopics(response);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };

        fetchData();
    }, [userId, accessToken, categoryTitle, refreshData]);

    // useEffect(() => {
    //   const fetchData = async () => {
    //     if (
    //       categoryTitle !== "My Posts" &&
    //       categoryTitle !== "Recent Posts" &&
    //     ) {
    //       //don't fetch "My Posts" & "Recents Posts" here. It will be a different API method. Don't remove this line else will have console log error.
    //       const forumCategoryId = categoryTitleToId[categoryTitle];
    //       setTopics(response);
    //     } else if (categoryTitle === "My Posts" && accessToken) {
    //       const response = await getAllForumPostsByJobSeeker(
    //         userIdRef,
    //         accessToken
    //       );
    //       setForumPosts(response);
    //     } else if (categoryTitle === "Recent Posts" && accessToken) {
    //       const response = await getAllSortedForumPosts(accessToken);
    //       setForumPosts(response);
    //     }
    //   };
    //   fetchData();
    // }, [userIdRef, accessToken, forumCategoryTitle, refreshData]);

     return (
       <>
         {mounted && (
           <>
             <MediaQuery minWidth={1}>
               <TopicDesktopView
                 categoryTitle={categoryTitle}
                 setCategoryTitle={setCategoryTitle}
                 forumGuideLinesByCategory={forumGuideLinesByCategory}
                 setForumGuideLinesByCategory={setForumGuideLinesByCategory}
                 userIdRef={userId}
                 accessToken={accessToken}
                 categories={categories}
                 topics={topics}
                 setRefreshData={setRefreshData}
                 onSearchQueryChange={handleSearchQueryChange}
                 searchQuery={searchQuery}
               />
             </MediaQuery>
             {/* <MediaQuery maxWidth={1224}>
               <ForumMobileView
                 forumCategoryTitle={forumCategoryTitle}
                 setForumCategoryTitle={setForumCategoryTitle}
                 forumGuideLinesByCategory={forumGuideLinesByCategory}
                 setForumGuideLinesByCategory={setForumGuideLinesByCategory}
                 userIdRef={userIdRef}
                 accessToken={accessToken}
                 forumCategories={forumCategories}
                 forumPosts={forumPosts}
                 setRefreshData={setRefreshData}
                 onSearchQueryChange={handleSearchQueryChange}
                 searchQuery={searchQuery}
               />
             </MediaQuery> */}
           </>
         )}
       </>
     );
}

export default Multimedia;