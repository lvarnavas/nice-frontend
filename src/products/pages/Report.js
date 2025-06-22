import React, { useEffect, useState } from "react";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import "./Report.css";

const Report = () => {
  const { sendRequest } = useHttpClient();
  const [products, setProducts] = useState([]);
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
          formFields[prod.id] = { value: "", isValid: true };
        });
        setFormData(formFields, true);
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, setFormData]);

  const generatePDF = async () => {
    try {
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
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };

  if (!products.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="report-container">
      <h2 className="report-title">Report Αποθήκης</h2>
      <form>
        {products.map((prod) => (
          <div className="report-form-group" key={prod.id}>
            <label htmlFor={prod.id}>{prod.name}</label>
            <input
              type="number"
              id={prod.id}
              value={formState.inputs[prod.id]?.value || ""}
              onChange={(e) => inputHandler(prod.id, e.target.value, true)}
            />
          </div>
        ))}
      </form>
      <div className="report-generate-btn">
        <Button type="button" onClick={generatePDF}>
          ΥΠΟΒΟΛΗ
        </Button>
      </div>
    </div>
  );
};

export default Report;