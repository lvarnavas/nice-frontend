import React, { useEffect, useState } from "react";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./Report.css";
import { niceLogoBase64 } from "../../niceLogoBase64";

pdfMake.vfs = pdfFonts.vfs;

const Report = () => {
  const { sendRequest } = useHttpClient();
  const [products, setProducts] = useState([]);
  const [warehouseStatus, setWarehouseStatus] = useState([]);
  const [formState, inputHandler, setFormData] = useForm({}, false);

  // Helper to get current date in DD-MM-YYYY
  const getCurrentDateString = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch products and warehouse status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product list
        const productsRes = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/get-products"
        );
        setProducts(productsRes.productsList);

        // Fetch warehouse status
        const statusRes = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/products/warehouse-status"
        );
        setWarehouseStatus(statusRes.warehouseStatus);

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

  const generatePDF = () => {
    const currentDate = getCurrentDateString();
    // Prepare table body with difference and color
    const tableBody = [
      [
        { text: "Προϊόν", style: "tableHeader", alignment: "center" },
        { text: "Τιμές αποθήκης", style: "tableHeader", alignment: "center" },
        { text: "Τιμές πλατφόρμας", style: "tableHeader", alignment: "center" },
        { text: "Απόκλιση", style: "tableHeader", alignment: "center" }
      ],
      ...products.map((prod) => {
        const userQty = Number(formState.inputs[prod.id]?.value || 0);
        const ws = warehouseStatus.find((ws) => ws.product_id === prod.id);
        const actualQty = Number(ws ? ws.current_quantity : 0);
        const diff = userQty - actualQty;
        return [
          { text: prod.name, alignment: "center" },
          { text: userQty, alignment: "center" },
          { text: actualQty, alignment: "center" },
          {
            text: diff,
            color: diff !== 0 ? "red" : "black",
            alignment: "center"
          }
        ];
      }),
    ];

    const docDefinition = {
      content: [
        {
          image: niceLogoBase64,
          width: 180, // Slightly smaller logo
          alignment: "center",
          margin: [0, 0, 0, 18]
        },
        { text: "Warehouse Report", style: "header", alignment: "center", margin: [0, 0, 0, 12] },
        { text: currentDate, style: "date", alignment: "center", margin: [0, 0, 0, 18] },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"],
            body: tableBody,
          },
          layout: {
            hLineColor: () => '#aaa',
            vLineColor: () => '#aaa',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 6,
            paddingBottom: () => 6,
            fillColor: (rowIndex) => rowIndex === 0 ? '#f5f5f5' : null,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 24, // Larger title
          bold: true,
          margin: [0, 0, 0, 2],
          alignment: "center"
        },
        date: {
          fontSize: 10,
          italics: true,
          color: 'black', // Date in black
          margin: [0, 0, 0, 10],
          alignment: "center"
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          alignment: "center"
        }
      },
    };

    pdfMake.createPdf(docDefinition).download(`warehouse_report_${currentDate}.pdf`);
  };

  if (!products.length || !warehouseStatus.length) {
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