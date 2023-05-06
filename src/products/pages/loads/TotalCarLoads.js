import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import TotalCarLoadsList from "../../components/loads/TotalCarLoadsList";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";

const TotalCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );

  console.log(formattedStartDate);
  useEffect(() => {
    const fetchCarLoads = async () => {
      try {
        const carLoadsData = await sendRequest(
          `http://localhost:5000/api/products/loads/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "totalCarLoads",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarLoads(carLoadsData.loads);
      } catch (err) {}
    };
    fetchCarLoads();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarLoads && (
        <TotalCarLoadsList items={loadedCarLoads} />
      )}
    </React.Fragment>
  );
};

export default TotalCarLoads;
