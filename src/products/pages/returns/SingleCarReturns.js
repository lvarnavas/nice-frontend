import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import SingleCarReturnsList from "../../components/returns/SingleCarReturnsList";

const SingleCarReturns = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarReturns, setLoadedCarReturns] = useState();
  const location = useLocation();

  useEffect(() => {
    const fetchCarReturns = async () => {
      const queryParams = new URLSearchParams(location.search);
      const carid = queryParams.get("carid");
      let startdate = queryParams.get("startdate");
      let enddate = queryParams.get("enddate");

      if (
        !moment(startdate, "YYYY-MM-DD", true).isValid() ||
        !moment(enddate, "YYYY-MM-DD", true).isValid()
      ) {
        startdate = moment().startOf("month").format("YYYY-MM-DD");
        enddate = moment().endOf("month").format("YYYY-MM-DD");
      }

      try {
        const carReturnsData = await sendRequest(
          `http://localhost:5000/api/products/returns/${carid}/${startdate}/${enddate}`,
          "POST",
          JSON.stringify({
            flag: "singleCarReturns",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarReturns(carReturnsData.returns);
      } catch (err) {}
    };
    fetchCarReturns();
  }, [sendRequest, location]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarReturns && (
        <SingleCarReturnsList items={loadedCarReturns} />
      )}
    </React.Fragment>
  );
};

export default SingleCarReturns;
