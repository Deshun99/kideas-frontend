"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MediaQuery, { useMediaQuery } from "react-responsive";

const MultimediaPage = () =>  {
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

    const [forumCategoryTitle, setForumCategoryTitle] =
      useState("Recent Posts");
    const [forumGuideLinesByCategory, setForumGuideLinesByCategory] =
      useState("");
    const [forumCategories, setForumCategories] = useState([]);
    const [forumPosts, setForumPosts] = useState([]);
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

    

}