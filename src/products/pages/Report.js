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
  const [pdfUrl, setPdfUrl] = useState(null);
  const [shouldGenerate, setShouldGenerate] = useState(false);
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

  useEffect(() => {
    const generatePDF = async () => {
      try {
        setShowSuccessModal(false);
        setPdfUrl(null);

        // Convert form state to simple object with just the values
        const formData = {};
        Object.keys(formState.inputs).forEach(key => {
          formData[key] = formState.inputs[key].value;
        });

        // Make request to backend using sendRequest with 'blob' responseType
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products/generate-report`,
          'POST',
          JSON.stringify({ formData }),
          { 'Content-Type': 'application/json', Accept: 'application/pdf' },
          'blob'
        );

        const blob = response instanceof Blob ? response : new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowSuccessModal(true);
      } catch (err) {
        // Error is handled by ErrorModal via useHttpClient
      } finally {
        setShouldGenerate(false);
      }
    };

    if (shouldGenerate) {
      generatePDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldGenerate, sendRequest, formState]);

  const handleGenerateClick = () => {
    setShouldGenerate(true);
  };

  const handleSuccessModalOk = () => {
    if (pdfUrl) {
      // Open a new tab and trigger download with custom filename
      const filename = `warehouse_report_${formatDate(new Date())}.pdf`;
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<!DOCTYPE html><html><body></body></html>`);
        const script = newTab.document.createElement('script');
        script.innerHTML = `
          const blobUrl = "${pdfUrl}";
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = "${filename}";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { window.close(); }, 100);
        `;
        newTab.document.body.appendChild(script);
      }
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setShowSuccessModal(false);
  };

  // Helper to format date for filename
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

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
          <Button onClick={handleSuccessModalOk}>
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
        <Button type="button" onClick={handleGenerateClick} disabled={!formState.isValid}>
          ΛΗΨΗ ΑΝΑΦΟΡΑΣ
        </Button>
      </div>
    </div>
  );
};

export default Report;