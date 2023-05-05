import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import WarehouseDestructionsList from "../../components/destructions/WarehouseDestructionsList";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";

const WarehouseDestructions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedDestructions, setLoadedDestructions] = useState();
  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "YYYY-MM-DD"
  );
  console.log(formattedStartDate, formattedEndDate);

  useEffect(() => {
    const fetchDestructions = async () => {
      try {
        const destructionsData = await sendRequest(
          `http://localhost:5000/api/products/destructions/${formattedStartDate}/${formattedEndDate}`,
          "POST",
          JSON.stringify({
            flag: "warehouseDestructions",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedDestructions(destructionsData.destructions);
      } catch (err) {}
    };
    fetchDestructions();
  }, [sendRequest, formattedStartDate, formattedEndDate]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedDestructions && (
        <WarehouseDestructionsList items={loadedDestructions} />
      )}
    </React.Fragment>
  );
};

export default WarehouseDestructions;
