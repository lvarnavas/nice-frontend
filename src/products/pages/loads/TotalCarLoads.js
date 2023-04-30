import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import TotalCarLoadsList from "../../components/loads/TotalCarLoadsList";

const TotalCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();

  useEffect(() => {
    const fetchCarLoads = async () => {
      try {
        const carLoadsData = await sendRequest(
          "http://localhost:5000/api/products/loads/2023-04-01/2023-04-20",
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
  }, [sendRequest]);

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
