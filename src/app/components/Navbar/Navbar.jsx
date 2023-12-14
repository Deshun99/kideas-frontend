"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import NavItem from "../NavItem/NavItem";
import HumanIcon from "../../../../public/icon.png";
import { UserContext } from "@/app/context/UserContext";
import Enums from "@/app/common/enums/enums";
import { ThemeContext } from "@/app/context/ThemeContext";
// import { Button } from "primereact/button";
// import { useRouter } from "next/router";

const MENU_LIST_CONTENT_CREATOR = [
  { text: "Home", href: "/" },
  { text: "Chat", href: "/chat" },
  { text: "Multimedia", href: "/multimedia" },
  { text: "My Topics", href: "/myTopic" },
];

const MENU_LIST_ADMIN = [
  { text: "Home", href: "/" },
  { text: "Chat", href: "/chat" },
  { text: "Multimedia", href: "/multimedia" },
  { text: "User Management", href: "/userManagement" },
  { text: "Topic Management", href: "/topicManagement" },
];

const MENU_LIST_VISITOR = [
    { text: "Home", href: "/" }, 
    { text: "Multimedia", href: "/multimedia" },
];

const Navbar = () => {
  const session = useSession();

  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  let roleRef, sessionTokenRef, userIdRef;

  // utilising use context to get the latest information
  const { userData } = useContext(UserContext);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [corporate, setCorporate] = useState(null);
  const [status, setStatus] = useState(null);

  const themeContext = useContext(ThemeContext);
  const { toggle, mode } = themeContext;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  const handleSignOut = async (event) => {
    event.preventDefault();
    await signOut({ redirect: false });
    window.location.replace("/");
  };

  return (
    <header className={styles.header}>
      {navActive && <div className={styles.overlay}></div>}{" "}
      {/* Add the overlay element */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/Kideas_logo.png"
            alt="Kideas"
            width={200}
            height={100}
          />
        </Link>
        <div
          onClick={() => setNavActive(!navActive)}
          className={styles.nav__menu_bar}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          className={`${navActive ? styles.active : ""} ${
            styles.nav__menu_list_light
          }`}
        >
          {session.status == "authenticated" &&
            session.data.user.role === "Admin" &&
            MENU_LIST_ADMIN.map((menu, idx) => (
              <div
                className={styles.menuItem}
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem
                  active={activeIdx === idx}
                  text={menu.text}
                  href={menu.href}
                />
              </div>
            ))}

          {session.status == "authenticated" &&
            session.data.user.role === "Content_Creator" &&
            MENU_LIST_CONTENT_CREATOR.map((menu, idx) => (
              <div
                className={styles.menuItem}
                key={menu.text}
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                onMouseEnter={() => setShowSubMenu(true)} // Show sub-menu on hover
                onMouseLeave={() => setShowSubMenu(false)} // Hide sub-menu on mouse leave
              >
                <div className="nav-item">
                  <Link href={menu.href}>
                    {" "}
                    {/* Use Link for the main menu item */}
                    <a>
                      <NavItem
                        active={activeIdx === idx}
                        text={menu.text}
                        href={menu.href}
                      />
                    </a>
                  </Link>

                  {menu.subMenu && showSubMenu && (
                    <div className={styles.submenu}>
                      {menu.subMenu.map((subMenuItem, subIdx) => (
                        <Link href={subMenuItem.href} key={subIdx}>
                          {" "}
                          {/* Use Link for sub-menu items */}
                          <a>{subMenuItem.text}</a>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

          {session.status == "unauthenticated" &&
            MENU_LIST_VISITOR.map((menu, idx) => (
              <div
                className={styles.menuItem}
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem active={activeIdx === idx} {...menu} />
              </div>
            ))}
          {session.status === "authenticated" && (
            <>
              <div className={styles.imageContainer}>
                {userData?.profilePictureUrl ? (
                  <Link href="/accountManagement">
                    <img
                      src={userData?.profilePictureUrl}
                      alt="User Profile"
                      className={styles.avatar}
                      onClick={() => setNavActive(false)}
                    />
                  </Link>
                ) : (
                  <Link href="/accountManagement">
                    <Image
                      src={HumanIcon}
                      alt="Profile Picture"
                      className={styles.avatar}
                      onClick={() => setNavActive(false)}
                    />
                  </Link>
                )}
                <h6>{userData?.userName}</h6>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                <NavItem text="Logout" href={"/"} />
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 