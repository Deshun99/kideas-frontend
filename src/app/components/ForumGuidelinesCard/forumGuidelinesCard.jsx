"use client";
import { Card } from "primereact/card";
import styles from "./forumGuidelinesCard.module.css";

const ForumGuidelinesCard = ({
  categoryTitle,
  forumGuideLinesByCategory,
}) => {
  const forumGuideLinesArr = forumGuideLinesByCategory?.split("~");

  const shouldShowDefaultGuidelines =
    !forumGuideLinesByCategory ||
    categoryTitle === "My Posts" ||
    categoryTitle === "Recent Posts";

  const forumGuideLines = () => {
    return (
      <>
        {shouldShowDefaultGuidelines ? (
        <>
          <h1 className={styles.title}>Forum Guidelines</h1>
          <br />
          <p>
            Kideas Forum is created to give people a voice and share their
            interesting content.
          </p>
          <br />
          <p>StarHireWhisper is not affiliated with the StarHire.</p>
          <br />
          <p>DISCLAIMER</p>
          <p>
            We are unable to authenticate the validity of confessions due to its
            anonymous nature. Readers are advised to not take the confessions
            too seriously.
          </p>
          <br />
          <p>REPORT CONTENT</p>
          <p>
            We might accidentally approve confessions that might be insulting or
            uncomfortable to some (we are humans too). If you have spotted such
            confessions, feel free to message us or drop us an e-mail at
            admin@starhire.sg
          </p>
          <br />
          <p>Post&apos;s ID that are posted may not be in sequence.</p>
          <br />
          <p>COMMENTS</p>
          <p>
            Be nice, civil and polite. Do not start a flame war. Personal
            attacks are not tolerated.
          </p>
        </>
        ) : (
        <>
          {forumGuideLinesArr.map((data) => (
            <div key={data}>
              <p>{data}</p> <br />
            </div>
          ))}
        </>
        )}
      </>
    );
  };
  return (
    <>
      <Card className={styles.forumGuideLinesCard}>{forumGuideLines()}</Card>
    </>
  );
};

export default ForumGuidelinesCard;
