"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllUsers, updateUser } from "../api/user/route";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import Enums from "../common/enums/enums";
import { Tooltip } from "primereact/tooltip";

const UserManagement = () => {
  const session = useSession();
  const router = useRouter();
  const toast = useRef(null);
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

  const [refreshData, setRefreshData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const dt = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [userStatusDialog, setUserStatusDialog] = useState(false);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    getAllUsers(accessToken)
      .then((user) => {
        setUser(user.data);
        console.log(user.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      });
  }, [refreshData, accessToken]);

  const header = () => {
    return renderAdminHeader();
  };

  const paginationStyle = {
    position: "absolute",
    bottom: "0",
    width: "100%",
  };

  const renderAdminHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="m-0">All Users</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <Button
          label="Export CSV"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </div>
    );
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const actionBody = (rowData) => {
    if (userId === rowData.userId) {
      return (
        <>
          <Button
            icon="pi pi-search"
            rounded
            outlined
            className={styles.buttonIcon}
            onClick={() => {
              setSelectedRowData(rowData);
              showViewUserDialog(rowData);
            }}
            tooltip="View Details"
            tooltipOptions={{ position: "top" }}
          />
        </>
      );
    } else {
      return (
        <>
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            className={styles.buttonIcon}
            onClick={() => {
              setSelectedRowData(rowData);
              showUserStatusDialog(rowData);
            }}
            tooltip="Update Status"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            icon="pi pi-search"
            rounded
            outlined
            className={styles.buttonIcon}
            onClick={() => {
              setSelectedRowData(rowData);
              setViewUserDialog(rowData);
            }}
            tooltip="View Details"
            tooltipOptions={{ position: "top" }}
          />
        </>
      );
    }
  };

  const hideViewDialog = () => {
    setViewUserDialog(false);
  };

  const showViewUserDialog = (rowData) => {
    setViewUserDialog(true);
  };

  const hideStatusDialog = () => {
    setUserStatusDialog(false);
  };

  const showUserStatusDialog = (rowData) => {
    setUserStatusDialog(true);
  }

  const saveStatusChange = async () => {
    try {
      const toggledStatus =
        selectedRowData.status === Enums.ACTIVE ? Enums.INACTIVE : Enums.ACTIVE;
      const request = {
        status: toggledStatus,
      };
      const response = await updateUser(
        request,
        selectedRowData.userId,
        accessToken
      );

      if (response) {
        setSelectedRowData();
        setUserStatusDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `User ${selectedRowData.userId} updated successfully!`,
          life: 5000,
        });
      }
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.log("Failed to update user");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    // setSelectedRowData();
    // setUserDialog(false);
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={hideStatusDialog}
      />
      <Button label="Yes" icon="pi pi-check" onClick={saveStatusChange} />
    </React.Fragment>
  );

  if (session.status === "loading") {
    return <ProgressSpinner />;
  }

  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  if (session.status === "authenticated" && roleRef === "Content_Creator") {
    router?.push("/dashboard");
  }

  if (session.status === "authenticated" && roleRef === "Admin") {
    return (
      <>
        <Toast ref={toast} />
        <div
          className="datatable"
          style={{
            position: "relative",
            minHeight: "100%",
            width: "100%",
            height: "600px",
          }}
        >
          <DataTable
            value={user}
            paginator
            ref={dt}
            header={header}
            tableStyle={{
              width: "100%",
              minHeight: "100px",
            }}
            rows={5}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            paginatorBottom={true} // Ensure pagination is at the bottom
            paginatorStyle={paginationStyle} // Apply the pagination style
            rowsPerPageOptions={[5]}
            dataKey="id"
            selectionMode="checkbox"
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "userName",
              "email",
              "contactNo",
              "status",
              "role",
            ]}
            emptyMessage="No users found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column field="userName" header="User Name" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="contactNo" header="Contact No" sortable></Column>
            <Column field="role" header="Role" sortable></Column>
            <Column field="status" header="Active" sortable></Column>
            <Column header="Action" body={actionBody}></Column>
          </DataTable>

          <Dialog
            visible={viewUserDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="User Details"
            modal
            className="p-fluid"
            onHide={hideViewDialog}
          ></Dialog>

          <Dialog
            visible={userStatusDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header={`Change Status to ${
              selectedRowData &&
              (selectedRowData.status === "Active" ? "Inactive" : "Active")
            }`}
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideStatusDialog}
          >
            <h3 className={styles.statusDialog}>
              Are you sure you want to change the status of {selectedRowData && selectedRowData.userName}?
            </h3>
          </Dialog>
        </div>
      </>
    );
  }
};

export default UserManagement;
