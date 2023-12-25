"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import Enums from "../common/enums/enums";
import { Tooltip } from "primereact/tooltip";
import { getAllCategory } from "../api/category/route";
import CreateCategoryForm from "../components/CreateCategoryForm/CreateCategoryForm";
import UpdateCategoryForm from "../components/UpdateCategoryForm/UpdateCategoryForm";

const TopicManagement = () => {
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

     const dt = useRef(null);
     const [refreshData, setRefreshData] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     const [category, setCategory] = useState(null);
     const [selectedCategory, setSelectedCategory] = useState([]);
     const [selectedRowData, setSelectedRowData] = useState(null);
     const [filters, setFilters] = useState({
       global: { value: null, matchMode: FilterMatchMode.CONTAINS },
       caetgoryTitle: {
         operator: FilterOperator.OR,
         constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
       },
     });

     const [globalFilterValue, setGlobalFilterValue] = useState("");
     const [userStatusDialog, setUserStatusDialog] = useState(false);
     const [createCategoryDialog, setCreateCategoryDialog] = useState(false);

     const onGlobalFilterChange = (e) => {
       const value = e.target.value;
       let _filters = { ...filters };

       _filters["global"].value = value;

       setFilters(_filters);
       setGlobalFilterValue(value);
     };

     useEffect(() => {
        getAllCategory(accessToken)
          .then((category) => {
            setCategory(category.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            setIsLoading(false);
          });
     }, [refreshData, accessToken]);

     const header = () => {
       return renderHeader();
     };

     const paginationStyle = {
       position: "absolute",
       bottom: "0",
       width: "100%",
     };

     const renderHeader = () => {
       return (
         <div
           style={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
           }}
         >
           <h2 className="m-0">All Topics</h2>
           <span className="p-input-icon-left">
             <i className="pi pi-search" />
             <InputText
               value={globalFilterValue}
               onChange={onGlobalFilterChange}
               placeholder="Keyword Search"
             />
           </span>
           <Button
             label="Create Category"
             icon="pi pi-plus-circle"
             className="p-button-help"
             onClick={() => {
                setCreateCategoryDialog(true);
             }}
           />
         </div>
       ); 
     }

     const actionBody = (rowData) => {
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
               tooltip="Update Category"
               tooltipOptions={{ position: "top" }}
             />
           </>
         );
     };

      const hideStatusDialog = () => {
        setUserStatusDialog(false);
      };

      const hideCreateCategoryDialog = () => {
        setCreateCategoryDialog(false);
      }

      const showUserStatusDialog = (rowData) => {
        setUserStatusDialog(true);
      };

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
                value={category}
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
                selection={selectedCategory}
                onSelectionChange={(e) => setSelectedCategory(e.value)}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                  "categoryId",
                  "categoryTitle",
                  "isArchived",
                ]}
                emptyMessage="No category found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                <Column
                  field="categoryId"
                  header="Category Id"
                  sortable
                ></Column>
                <Column field="categoryTitle" header="Title" sortable></Column>
                <Column
                  field="isArchived"
                  header="Is Archived"
                  sortable
                ></Column>
                <Column header="Action" body={actionBody}></Column>
              </DataTable>
              <Dialog
                visible={userStatusDialog}
                style={styles.updateCategoryDialog}
                header="Update Category"
                draggable={false}
                onHide={hideStatusDialog}
              >
                <UpdateCategoryForm
                  accessToken={accessToken}
                  setRefreshData={setRefreshData}
                  selectedRowData={selectedRowData}
                />
              </Dialog>
              <Dialog
                header="Create Category"
                visible={createCategoryDialog}
                onHide={hideCreateCategoryDialog}
                draggable={false}
                style={styles.createCategoryDialog}
              >
                <CreateCategoryForm
                  accessToken={accessToken}
                  setRefreshData={setRefreshData}
                />
              </Dialog>
            </div>
          </>
        );
      }
}

export default TopicManagement;