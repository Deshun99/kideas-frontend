import Image from "next/image";
import styles from "./ErrorPage.module.css";
import ErrorImage from '../../../../public/error.png';
import { Button } from "primereact/button";
const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <>
      <div className={styles.errorContainer} role="alert">
        <div className={styles.errorTextContainer}>
          <h1>Uh ohhh!</h1>
          <p>
            There are errors in the website. The error has been logged and our
            team will look into it. Sorry for any inconvenience caused!
          </p>
          {/* <pre style={{ color: "red" }}>{error.message}</pre> */}
          <Button rounded onClick={resetErrorBoundary}>Go Back</Button>
        </div>
        <div className={styles.errorPhotoContainer}>
            <Image src={ErrorImage} className={styles.errorImg} alt="Error Image" />
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
