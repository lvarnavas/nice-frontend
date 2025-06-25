import React, { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./ViewAllReports.css";

const ViewAllReports = () => {
  const [reports, setReports] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products/reports-list`
        );
        setReports(responseData.reports);
      } catch (err) {}
    };
    fetchReports();
  }, [sendRequest]);

  const downloadHandler = (filename) => {
    window.open(
      `${process.env.REACT_APP_BACKEND_URL}/products/report/${filename}`
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Card className="view-all-reports">
        <h2 style={{ textAlign: "center" }}>Αναφορές Αποθήκης</h2>
        {!isLoading && reports && reports.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Όνομα Αρχείου</th>
                <th>Ημερομηνία Δημιουργίας</th>
                <th>Λήψη</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.filename}>
                  <td>{report.filename}</td>
                  <td>{report.createdAt}</td>
                  <td>
                    <Button onClick={() => downloadHandler(report.filename)}>
                      Λήψη
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && (!reports || reports.length === 0) && (
          <div className="center">
            <h2>Δεν βρέθηκαν αναφορές.</h2>
          </div>
        )}
      </Card>
    </React.Fragment>
  );
};

export default ViewAllReports; 