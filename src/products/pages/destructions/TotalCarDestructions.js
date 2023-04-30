import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import TotalCarDestructionsList from "../../components/destructions/TotalCarDestructionsList";

const TotalCarDestructions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarDestructions, setLoadedCarDestructions] = useState();

  useEffect(() => {
    const fetchCarDestructions = async () => {
      try {
        const carDestructionsData = await sendRequest(
          "http://localhost:5000/api/products/destructions/2023-04-01/2023-04-20",
          "POST",
          JSON.stringify({
            flag: "totalCarDestructions",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarDestructions(carDestructionsData.destructions);
      } catch (err) {}
    };
    fetchCarDestructions();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarDestructions && (
        <TotalCarDestructionsList items={loadedCarDestructions} />
      )}
    </React.Fragment>
  );
};

export default TotalCarDestructions;
