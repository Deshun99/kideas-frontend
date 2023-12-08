"use client";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { getUserByUserId } from "@/app/api/user/route";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const session = useSession();
  const [userData, setUserData] = useState(null);

  // codes to check once the user is invalid (removed from db), signs the user out to clear all the cookies that contains the user data
  useEffect(() => {
    if (session.data?.error === "INVALID_USER") {
      signOut();
    }
  }, [session.data?.error]);

  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  const fetchUserData = useCallback(() => {
    getUserByUserId(userIdRef, roleRef, sessionTokenRef)
      .then((user) => {
        setUserData(user.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [userIdRef, roleRef, sessionTokenRef]);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchUserData();
    }
  }, [session.status, fetchUserData]);

  return (
    <UserContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
