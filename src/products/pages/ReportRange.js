import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import el from "date-fns/locale/el";
import "./ReportRange.css";

const ReportRange = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [shouldGenerate, setShouldGenerate] = useState(false);
  
  // Initialize with first and last day of current month
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);

  useEffect(() => {
  const generatePDF = async () => {
    try {
      setShowSuccessModal(false);
      setPdfUrl(null);

      const formatApiDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatApiDate(startDate);
      const formattedEndDate = formatApiDate(endDate);

      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/generate-date-range-report/${formattedStartDate}/${formattedEndDate}`,
        'GET',
        null,
        { Accept: 'application/pdf' },
        'blob' // Specify response type as blob
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
}, [shouldGenerate, sendRequest, startDate, endDate]);

const handleGenerateClick = () => {
  setShouldGenerate(true);
};

  const handleSuccessModalOk = () => {
    if (pdfUrl) {
      // Open a new tab and trigger download with custom filename
      const filename = `report_${formatDate(startDate)}_to_${formatDate(endDate)}.pdf`;
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

  return (
    <div className="report-range-container">
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
      <div className="report-range-content">
        <Card className="report-range-title-card">
          <h2 className="report-range-title">ΑΝΑΦΟΡΑ ΔΙΑΣΤΗΜΑΤΟΣ</h2>
        </Card>
        <div className="report-range-form-group">
          <div className="report-range-label">Αναζήτηση από:</div>
          <div className="report-range-date-centered">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              locale={el}
            />
          </div>
          <div className="report-range-label">Αναζήτηση έως:</div>
          <div className="report-range-date-centered">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              locale={el}
            />
          </div>
        </div>
        <div className="report-range-btn">
          <Button type="button" onClick={handleGenerateClick}>
            ΛΗΨΗ ΑΝΑΦΟΡΑΣ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportRange; 