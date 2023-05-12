import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import el from "date-fns/locale/el";
import { useHttpClient } from "../../shared/components/hooks.js/http-hook";
import Button from "../../shared/components/hooks.js/FormElements/Button";
import ErrorModal from "../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/hooks.js/UIElements/LoadingSpinner";
import Modal from "../../shared/components/hooks.js/UIElements/Modal";
import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/components/hooks.js/form-hook";
import {
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from "../../shared/components/hooks.js/util/validators";
import Input from "../../shared/components/hooks.js/FormElements/Input";
import Card from "../../shared/components/hooks.js/UIElements/Card";
import "./AddEntry.css";

const AddEntry = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedOption, setSelectedOption] = useState("");
  const [carList, setCarList] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [date, setDate] = useState(new Date());
  const [productsList, setProductsList] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [originalCarList, setOriginalCarList] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      product: {
        value: "0",
        isValid: true,
      },
    },
    false
  );

  useEffect(() => {
    // Fetch cars
    const fetchCarList = async () => {
      try {
        const carListData = await sendRequest(
          "http://localhost:5000/api/products/get-car-list"
        );
        console.log(carListData);
        setOriginalCarList(carListData.carslist);
        setCarList(carListData.carslist);
      } catch (err) {}
    };
    fetchCarList();

    const fetchProductsList = async () => {
      try {
        const productListData = await sendRequest(
          "http://localhost:5000/api/products/get-products"
        );
        setProductsList(productListData.productsList);
      } catch (err) {}
    };
    fetchProductsList();
  }, [sendRequest]);

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
    setSelectedCar("");
    if (
      e.target.value === "Επιστροφή" ||
      e.target.value === "Καταστροφή οχήματος" ||
      e.target.value === "Καταστροφή αποθήκης"
    ) {
      setCarList(originalCarList.filter((car) => car.pinakida !== "ΝΤΑΛΙΚΑ"));
    } else {
      setCarList(originalCarList);
    }
  };

  const handleCarSelect = (e) => {
    setSelectedCar(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  // const showWarningHandler = () => {
  //   setShowSuccessModal(true);
  // };

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let history = useHistory();

  const submitHandler = async (event) => {
    event.preventDefault();
    const formattedDate = formatDate(date);

    if (selectedOption === "Φόρτωμα") {
      try {
        setShowSuccessModal(false);
        await sendRequest(
          "http://localhost:5000/api/products/add-loads",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: productsList.map((product, index) => ({
              productId: product.id,
              quantity: parseInt(
                formState.inputs[`product-${product.id}`].value
              ),
            })),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setShowSuccessModal(true);
        //history.push("loads/total-car-loads");
      } catch (err) {}
    } else if (selectedOption === "Επιστροφή") {
      try {
        setShowSuccessModal(false);
        await sendRequest(
          "http://localhost:5000/api/products/add-returns",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: productsList.map((product, index) => ({
              productId: product.id,
              quantity: parseInt(
                formState.inputs[`product-${product.id}`].value
              ),
            })),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setShowSuccessModal(true);
        //history.push("/returns/total-car-returns");
      } catch (err) {}
    } else if (selectedOption === "Καταστροφή οχήματος") {
      try {
        setShowSuccessModal(false);
        console.log(typeof selectedCar);
        await sendRequest(
          "http://localhost:5000/api/products/add-car-destructions",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: productsList.map((product, index) => ({
              productId: product.id,
              quantity: parseInt(
                formState.inputs[`product-${product.id}`].value
              ),
            })),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setShowSuccessModal(true);
        //history.push("/destructions/total-car-destructions");
      } catch (err) {}
    } else if (selectedOption === "Καταστροφή αποθήκης") {
      setShowSuccessModal(false);
      try {
        await sendRequest(
          "http://localhost:5000/api/products/add-warehouse-destructions",
          "POST",
          JSON.stringify({
            date: formattedDate,
            products: productsList.map((product, index) => ({
              productId: product.id,
              quantity: parseInt(
                formState.inputs[`product-${product.id}`].value
              ),
            })),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setShowSuccessModal(true);
        //history.push("/destructions/total-warehouse-destructions");
      } catch (err) {}
    }
  };

  const successHandler = async (event) => {
    if (selectedOption === "Φόρτωμα") {
      history.push("loads/total-car-loads");
    } else if (selectedOption === "Επιστροφή") {
      history.push("returns/total-car-returns");
    } else if (selectedOption === "Καταστροφή οχήματος") {
      history.push("destructions/total-car-destructions");
    } else if (selectedOption === "Καταστροφή αποθήκης") {
      history.push("destructions/total-warehouse-destructions");
    } else {
      history.push("warehouse-status");
    }
  };

  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 1
  );
  const maxDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );

  return (
    <div className="add-entry_container">
      <div className="add-entry_content">
        <Card className="add-entry_container-title">
          <h2>ΔΗΜΙΟΥΡΓΙΑ ΝΕΑΣ ΚΑΤΑΧΩΡΗΣΗΣ</h2>
        </Card>
        <select value={selectedOption} onChange={handleSelect}>
          <option value="" disabled>
            Επιλογή καταχώρησης
          </option>
          <option value="Φόρτωμα">Φόρτωμα</option>
          <option value="Επιστροφή">Επιστροφή</option>
          <option value="Καταστροφή οχήματος">Καταστροφή οχήματος</option>
          <option value="Καταστροφή αποθήκης">Καταστροφή αποθήκης</option>
        </select>
        {selectedOption && (
          <>
            {selectedOption === "Καταστροφή αποθήκης" && (
              <div className="add-entry_spacer">
                <div className="add-entry_content-title">
                  Ημ/νία καταχώρησης
                </div>
                <div className="date-container">
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    locale={el}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
                <Card className="add-entry_spacer">
                  <h2>ΕΙΣΑΓΩΓΗ ΠΟΣΟΤΗΤΩΝ</h2>
                </Card>
                {productsList.map((product) => (
                  <div className="add-entry_spacer" key={product.id}>
                    <Input
                      id={`product-${product.id}`}
                      element="input"
                      type="text"
                      placeholder="0"
                      label={product.name}
                      validators={[
                        VALIDATOR_MIN(0),
                        VALIDATOR_MAX(1999),
                        VALIDATOR_REQUIRE(),
                      ]}
                      errorText="Παρακαλώ εισάγετε έναν έγκυρο αριθμό."
                      onInput={inputHandler}
                      initialValue="0"
                      initialValid={true}
                    />
                  </div>
                ))}
                <React.Fragment>
                  <ErrorModal error={error} onClear={clearError} />
                  <Modal
                    show={showSuccessModal}
                    header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                    contentClass="specific-item__modal-content"
                    footerClass="specific-item__modal-actions"
                    footer={<Button onClick={successHandler}>OK</Button>}
                  ></Modal>
                  {isLoading && <LoadingSpinner asOverlay />}
                  <div className="add-entry_content-btn">
                    <Button
                      disabled={!formState.isValid}
                      onClick={submitHandler}
                    >
                      ΚΑΤΑΧΩΡΗΣΗ
                    </Button>
                  </div>
                </React.Fragment>
              </div>
            )}
            {selectedOption !== "Καταστροφή αποθήκης" && (
              <select value={selectedCar} onChange={handleCarSelect}>
                <option value="" disabled>
                  Επιλογή οχήματος
                </option>
                {carList.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.pinakida}
                  </option>
                ))}
              </select>
            )}
            {selectedCar && (
              <div className="add-entry_spacer">
                <div className="add-entry_content-title">
                  Ημ/νία καταχώρησης:<br></br>
                </div>
                <div className="date-container">
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    locale={el}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
                <Card className="add-entry_spacer">
                  <h2>ΕΙΣΑΓΩΓΗ ΠΟΣΟΤΗΤΩΝ</h2>
                </Card>
                {productsList.map((product) => (
                  <div className="add-entry_spacer" key={product.id}>
                    <Input
                      id={`product-${product.id}`}
                      element="input"
                      type="text"
                      placeholder="0"
                      label={product.name}
                      validators={[
                        VALIDATOR_MIN(0),
                        VALIDATOR_MAX(1999),
                        VALIDATOR_REQUIRE(),
                      ]}
                      errorText="Παρακαλώ εισάγετε έναν έγκυρο αιρθμό."
                      onInput={inputHandler}
                      initialValue="0"
                      initialValid={true}
                    />
                  </div>
                ))}
                <React.Fragment>
                  <ErrorModal error={error} onClear={clearError} />
                  <Modal
                    show={showSuccessModal}
                    header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                    contentClass="specific-item__modal-content"
                    footerClass="specific-item__modal-actions"
                    footer={<Button onClick={successHandler}>OK</Button>}
                  ></Modal>
                  {isLoading && <LoadingSpinner asOverlay />}
                  <div className="add-entry_content-btn">
                    <Button
                      disabled={!formState.isValid}
                      onClick={submitHandler}
                    >
                      ΚΑΤΑΧΩΡΗΣΗ
                    </Button>
                  </div>
                </React.Fragment>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default AddEntry;
