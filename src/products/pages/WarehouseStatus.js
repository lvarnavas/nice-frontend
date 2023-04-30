import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/hooks.js/UIElements/LoadingSpinner";
import WarehouseStatusList from "../components/WarehouseStatusList";

const WarehouseStatus = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedWarehouse, setLoadedWarehouse] = useState();

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const warehouseData = await sendRequest(
          "http://localhost:5000/api/products/warehouse-status"
        );
        setLoadedWarehouse(warehouseData.warehouseStatus);
      } catch (err) {}
    };
    fetchWarehouse();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedWarehouse && (
        <WarehouseStatusList items={loadedWarehouse} />
      )}
    </React.Fragment>
  );
};

export default WarehouseStatus;
