import React, { useState, useEffect, useRef } from "react";
import styles from "./createCategoryForm.module.css";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";

const CreateCategoryForm = ({
    setRefreshData,

}) => {
    const [formData, setFormData] = useState({
        categoryTitle: "",
        isArchived: Boolean,
    });
    const toast = useRef(null);


    return (
      <>
        <Toast ref={toast} />
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.categoryTitleContainer}>
                
            </div>
        </form>
      </>
    );
}

export default CreateCategoryForm;