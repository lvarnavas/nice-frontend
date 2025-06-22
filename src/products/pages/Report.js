import React, { useEffect, useState } from "react";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import {
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import "./Report.css";

const Report = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [products, setProducts] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formState, inputHandler, setFormData] = useForm({}, false);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product list
        const productsRes = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/get-products"
        );
        setProducts(productsRes.productsList);

        // Initialize form fields
        const formFields = {};
        productsRes.productsList.forEach((prod) => {
          formFields[prod.id] = { value: "0", isValid: true };
        });
        setFormData(formFields, true);
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, setFormData]);

  const generatePDF = async () => {
    try {
      setShowSuccessModal(false);
      // Convert form state to simple object with just the values
      const formData = {};
      Object.keys(formState.inputs).forEach(key => {
        formData[key] = formState.inputs[key].value;
      });

      // Make request to backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/products/generate-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData }),
        }
      );

      if (!response.ok) {
        throw new Error('Could not generate report');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to download the file
      const a = document.createElement('a');
      a.href = url;
      a.download = `warehouse_report_${new Date().toLocaleDateString('en-GB').split('/').join('-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };

  if (!products.length) {
    return (
      <div className="center">
        {isLoading && <LoadingSpinner asOverlay />}
      </div>
    );
  }

  return (
    <div className="report-container">
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showSuccessModal}
        header={<div>ΕΠΙΤΥΧΗΣ ΔΗΜΙΟΥΡΓΙΑ ΑΝΑΦΟΡΑΣ</div>}
        contentClass="specific-item__modal-content"
        footerClass="specific-item__modal-actions"
        footer={
          <Button onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        }
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="report-title-card">
        <h2 className="report-title">ΑΝΑΦΟΡΑ ΑΠΟΘΗΚΗΣ</h2>
      </Card>
      <form>
        {products.map((prod) => (
          <div className="report-form-group" key={prod.id}>
            <Input
              id={prod.id}
              element="input"
              type="text"
              placeholder="0"
              label={prod.name}
              validators={[
                VALIDATOR_MIN(0),
                VALIDATOR_MAX(5000),
                VALIDATOR_REQUIRE(),
              ]}
              errorText="Παρακαλώ εισάγετε έναν έγκυρο αριθμό."
              onInput={inputHandler}
              initialValue="0"
              initialValid={true}
            />
          </div>
        ))}
      </form>
      <div className="report-generate-btn">
        <Button type="button" onClick={generatePDF} disabled={!formState.isValid}>
          ΔΗΜΙΟΥΡΓΙΑ PDF
        </Button>
      </div>
    </div>
  );
};

export default Report;