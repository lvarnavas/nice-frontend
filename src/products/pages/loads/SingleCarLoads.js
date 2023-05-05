import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";
import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import SingleCarLoadsList from "../../components/loads/SingleCarLoadsList";

const SingleCarLoads = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCarLoads, setLoadedCarLoads] = useState();
  const [carName, setCarName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("carid");
    const startDate = urlParams.get("startdate");
    const endDate = urlParams.get("enddate");

    const fetchCarLoads = async () => {
      try {
        const carLoadsData = await sendRequest(
          `http://localhost:5000/api/products/loads/${carId}/${startDate}/${endDate}`,
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

    const fetchCarList = async () => {
      try {
        const carListData = await sendRequest(
          "http://localhost:5000/api/products/get-car-list"
        );
        const car = carListData.find((car) => car.id === parseInt(carId));
        console.log(car);
        if (car) {
          setCarName(car.pinakida);
        }
      } catch (err) {}
    };
    fetchCarList();
  }, [sendRequest]);

  const itemDeleteHandler = (deletedItemId) => {
    setLoadedCarLoads((prevLoads) =>
      prevLoads.filter((load) => load.id !== deletedItemId)
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
      {!isLoading && loadedCarLoads && (
        <SingleCarLoadsList
          items={loadedCarLoads}
          carName={carName}
          onDeleteItem={itemDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default SingleCarLoads;
