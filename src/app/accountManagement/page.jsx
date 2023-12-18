'use client'
import React, { useRef, useState, useEffect, useContext } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import EditAccountForm from "../components/EditAccountForm/EditAccountForm";
import { removeFile, uploadFile } from "../api/upload/route";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UserContext } from "../context/UserContext";
import { getUserByUserId, updateUser } from "../api/user/route";
import Enums from "../common/enums/enums";

const AccountManagement = () => {
  const session = useSession();
  const router = useRouter();
  const [refreshData, setRefreshData] = useState(false);
  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userId =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const roleRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deactivateAccountDialog, setDeactivateAccountDialog] = useState(false);
  const { userData, fetchUserData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    contactNo: "",
    profilePictureUrl: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputNumberChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const inputId = e.target.id; // Get the ID of the input that triggered the event
    if (!file) return;
    try {
      if(formData.profilePictureUrl) {
        console.log("Removing");
        console.log(formData.profilePictureUrl);
        await removeFile(
          formData.profilePictureUrl,
          accessToken
        );
      }
      const response = await uploadFile(file, accessToken);

      if (inputId === "profilePicture") {
        setFormData((prevState) => ({
          ...prevState,
          profilePictureUrl: response.url,
        }));
      } else if (inputId === "resumePdf") {
        setFormData((prevState) => ({
          ...prevState,
          resumePdf: response.url,
        }));
      }
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const hideDeactivateAccountDialog = () => {
    setDeactivateAccountDialog(false);
  };

  const deactivateAccountDialogFooter = () => (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        rounded
        outlined
        onClick={hideDeactivateAccountDialog}
      />
      <Button label="Yes" rounded icon="pi pi-check" onClick={saveChanges} />
    </React.Fragment>
  );

  const confirmChanges = async (e) => {
    e.preventDefault();
    if (formData.status === Enums.INACTIVE) {
      setDeactivateAccountDialog(true);
    } else {
      await saveChanges();
    }
  };

   const saveChanges = async (e) => {
     const userId = formData.userId;

     const updateUserDetails = {
       userName: formData.userName,
       email: formData.email,
       contactNo: formData.contactNo,
       profilePictureUrl: formData.profilePictureUrl,
       status: formData.status,
     };

     if (formData.contactNo && formData.contactNo.toString().length !== 8) {
       toast.current.show({
         severity: "error",
         summary: "Error",
         detail: "Contact number must contain 8 digits.",
         life: 5000,
       });
     } else {
       try {
         console.log(userId);
         console.log(updateUserDetails);

         const response = await updateUser(
           updateUserDetails,
           userId,
           accessToken
         );

         if (response) {
           if (deactivateAccountDialog) {
             hideDeactivateAccountDialog();
           }
           toast.current.show({
             severity: "success",
             summary: "Success",
             detail: "Account details updated successfully!",
             life: 5000,
           });
           setRefreshData((prev) => !prev);
           // this is to do a reload of userContext if it is updated so that navbar can change
           fetchUserData();
         }
       } catch (error) {
         console.log("Failed to update user");
         // alert("Failed to update user particulars");
         toast.current.show({
           severity: "error",
           summary: "Error",
           detail: error.message,
           life: 5000,
         });
       }
     }
   };

  useEffect(() => {
    if (session.status === "loading") {
      setIsLoading(true);
    } else if (session.status === "unauthenticated") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    if (session.status === "authenticated") {
      getUserByUserId(userId, roleRef, accessToken)
        .then((userResponse) => {
          console.log(userResponse.data);
          setFormData({
            userId: userResponse.data.userId,
            userName: userResponse.data.userName,
            email: userResponse.data.email,
            contactNo: userResponse.data.contactNo,
            profilePictureUrl: userResponse.data.profilePictureUrl,
            status: userResponse.data.status,
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setIsLoading(false);
        });
    }
  }, [session, userId, roleRef, refreshData]);

  if (isLoading) {
    return <ProgressSpinner />;
  }

  return (
    <div className={styles.container}>
      <EditAccountForm
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleInputNumberChange={handleInputNumberChange}
        handleFileChange={handleFileChange}
        toast={toast}
        confirmChanges={confirmChanges}
        Enums={Enums}
      />

      <Dialog
        visible={deactivateAccountDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Warning on self-deactivation of account"
        className="p-fluid"
        footer={deactivateAccountDialogFooter}
        onHide={hideDeactivateAccountDialog}
      >
        <p>
          You may have accidentally selected Inactive for your account status.
          Are you sure you want to deactivate your account? Please note that
          this action is irreversible, and you need to contact our Admin to
          activate back your account if needed.
        </p>
      </Dialog>
    </div>
  );
};

export default AccountManagement;