import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import SingleCarLoadsList from "../../components/loads/SingleCarLoadsList";

const SingleCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();
  const location = useLocation();

  useEffect(() => {
    const fetchCarLoads = async () => {
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
      console.log(startdate);
      console.log(enddate);

      try {
        const carLoadsData = await sendRequest(
          `http://localhost:5000/api/products/loads/${carid}/${startdate}/${enddate}`,
          "POST",
          JSON.stringify({
            flag: "singleCarLoads",
          }),
          { "Content-Type": "application/json" }
        );
        setLoadedCarLoads(carLoadsData.loads);
      } catch (err) {}
    };
    fetchCarLoads();
  }, [sendRequest, location]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCarLoads && (
        <SingleCarLoadsList items={loadedCarLoads} />
      )}
    </React.Fragment>
  );
};

export default SingleCarLoads;
