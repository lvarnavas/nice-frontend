import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { dateFormater } from "../../shared/components/hooks.js/dateFormatter";
import { useHttpClient } from "../../shared/components/hooks.js/http-hook";
import DatePicker from "react-datepicker";
import Button from "../../shared/components/hooks.js/FormElements/Button";
import LoadingSpinner from "../../shared/components/hooks.js/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/hooks.js/UIElements/ErrorModal";
import el from "date-fns/locale/el";
import "./Search.css";

const SearchPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchType, setSearchType] = useState("");
  const [carList, setCarList] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
  const history = useHistory();

  useEffect(() => {
    const fetchCarList = async () => {
      try {
        const carListData = await sendRequest(
          "http://localhost:5000/api/products/get-car-list"
        );
        setCarList(carListData.carslist);
      } catch (err) {}
    };
    if (searchType === "Αναζήτηση βάσει οχήματος") {
      fetchCarList();
    }
  }, [sendRequest, searchType]);

  const noCarSearch = () => {
    const { formattedStartDate, formattedEndDate } = dateFormater(
      "startdate",
      "enddate",
      "YYYY-MM-DD"
    );

    const dropDownOptions = {
      "Αναζήτηση βάσει οχήματος": "",
      "Αναζήτηση συνολικών φορτωμάτων": "/loads/total-car-loads",
      "Αναζήτηση συνολικών καταστροφών οχημάτων":
        "/destructions/total-car-destructions",
      "Αναζήτηση συνολικών επιστροφών": "/returns/total-car-returns",
      "Αναζήτηση καταστροφών αποθήκης":
        "/destructions/total-warehouse-destructions",
    };

    const selectedOption = dropDownOptions[searchType];
    if (selectedOption) {
      history.push(
        `${selectedOption}?startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );
    }
  };

  const carSearch = () => {
    const { formattedStartDate, formattedEndDate } = dateFormater(
      "startdate",
      "enddate",
      "YYYY-MM-DD"
    );

    const categoryUrls = {
      Φορτώματα: `/loads/single-car-loads`,
      Επιστροφές: `/returns/single-car-returns`,
      Καταστροφές: `/destructions/single-car-destructions`,
    };

    const selectedCategoryUrl = categoryUrls[selectedCategory];

    if (selectedCategoryUrl) {
      history.push(
        `${selectedCategoryUrl}?carid=${selectedCar}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );
    }
  };

  const renderForm = () => {
    switch (searchType) {
      case "Αναζήτηση συνολικών φορτωμάτων":
      case "Αναζήτηση συνολικών καταστροφών οχημάτων":
      case "Αναζήτηση συνολικών επιστροφών":
      case "Αναζήτηση καταστροφών αποθήκης":
        return (
          <>
            <span>Αναζήτηση από:</span>
            <div className="date-container">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
            </div>
            <span>Αναζήτηση εώς:</span>
            <div className="date-container">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
            </div>
            {isLoading && <LoadingSpinner asOverlay />}
            <Button onClick={noCarSearch}>Αναζήτηση</Button>
          </>
        );
      case "Αναζήτηση βάσει οχήματος":
        return (
          <>
            <select
              value={selectedCar || ""}
              onChange={(e) => setSelectedCar(e.target.value)}
            >
              <option value="" disabled>
                Επιλέξτε οχήμα
              </option>
              {carList.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.pinakida}
                </option>
              ))}
            </select>
            {selectedCar && (
              <>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Επιλέξτε κατηγορία
                  </option>
                  <option value="Φορτώματα">Φορτώματα</option>
                  <option value="Επιστροφές">Επιστροφές</option>
                  <option value="Καταστροφές">Καταστροφές</option>
                </select>
                {selectedCategory && (
                  <div>
                    <span>Αναζήτηση από:</span>
                    <div className="date-container">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={el}
                      />
                    </div>
                    <span>Αναζήτηση εώς:</span>
                    <div className="date-container">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={el}
                      />
                    </div>
                    <React.Fragment>
                      <ErrorModal error={error} onClear={clearError} />
                      {isLoading && (
                        <div className="center">
                          <LoadingSpinner />
                        </div>
                      )}
                      <Button onClick={carSearch}>Αναζήτηση</Button>
                    </React.Fragment>
                  </div>
                )}
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-container">
      <h2>Αναζήτηση καταχωρήσεων:</h2>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="" disabled>
          Επιλέξτε τύπο αναζήτησης
        </option>
        <option value="Αναζήτηση συνολικών φορτωμάτων">
          Αναζήτηση συνολικών φορτωμάτων
        </option>
        <option value="Αναζήτηση συνολικών καταστροφών οχημάτων">
          Αναζήτηση συνολικών καταστροφών οχημάτων
        </option>
        <option value="Αναζήτηση καταστροφών αποθήκης">
          Αναζήτηση καταστροφών αποθήκης
        </option>
        <option value="Αναζήτηση συνολικών επιστροφών">
          Αναζήτηση συνολικών επιστροφών
        </option>
        <option value="Αναζήτηση βάσει οχήματος">
          Αναζήτηση βάσει οχήματος
        </option>
      </select>
      {renderForm()}
    </div>
  );
};

export default SearchPage;
