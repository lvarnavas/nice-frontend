import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddEntry.module.css";
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

const AddEntry = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedOption, setSelectedOption] = useState("");
  const [carList, setCarList] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [date, setDate] = useState(new Date());
  const [productsList, setProductsList] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      product: {
        value: "",
        isValid: false,
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
        const initialQuantities = productListData.productsList.reduce(
          (acc, product) => {
            acc[product.id] = 0;
            return acc;
          },
          {}
        );
        setQuantities(initialQuantities);
      } catch (err) {}
    };
    fetchProductsList();
  }, [sendRequest]);

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
    setSelectedCar("");
  };

  const handleCarSelect = (e) => {
    setSelectedCar(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleChange = (e, productId) => {
    console.log(e, productId);
    setQuantities({ ...quantities, [productId]: e.target.value });
  };

  const showWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let history = useHistory();

  const sumbitHandler = async (event) => {
    event.preventDefault();
    const formattedDate = formatDate(date);

    if (selectedOption === "Φόρτωμα") {
      try {
        setShowConfirmModal(false);
        await sendRequest(
          "http://localhost:5000/api/products/add-loads",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: quantities,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("loads/total-car-loads");
      } catch (err) {}
    } else if (selectedOption === "Επιστροφή") {
      try {
        setShowConfirmModal(false);
        await sendRequest(
          "http://localhost:5000/api/products/add-car-returns",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: quantities,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/returns/total-car-returns");
      } catch (err) {}
    } else if (selectedOption === "Καταστροφή οχήματος") {
      try {
        setShowConfirmModal(false);
        await sendRequest(
          "http://localhost:5000/api/products/add-car-destructions",
          "POST",
          JSON.stringify({
            carId: selectedCar,
            date: formattedDate,
            products: quantities,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/destructions/total-car-destructions");
      } catch (err) {}
    } else if (selectedOption === "Καταστροφή αποθήκης") {
      console.log("test");
      console.log(quantities);
      setShowConfirmModal(false);
      try {
        await sendRequest(
          "http://localhost:5000/api/products/add-warehouse-destructions",
          "POST",
          JSON.stringify({
            date: formattedDate,
            products: quantities,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/destructions/total-warehouse-destructions");
      } catch (err) {}
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
    <div className={styles.container}>
      {console.log()}
      <h1>Νέα καταχώρηση:</h1>
      <select value={selectedOption} onChange={handleSelect}>
        <option value="">Επιλογή καταχώρησης</option>
        <option value="Φόρτωμα">Φόρτωμα</option>
        <option value="Επιστροφή">Επιστροφή</option>
        <option value="Καταστροφή οχήματος">Καταστροφή οχήματος</option>
        <option value="Καταστροφή αποθήκης">Καταστροφή αποθήκης</option>
      </select>
      {selectedOption && (
        <>
          {selectedOption === "Καταστροφή αποθήκης" && (
            <>
              <h3>Ημ/νία καταχώρησης:</h3>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={el}
                minDate={minDate}
                maxDate={maxDate}
              />
              <br />
              <br />
              {productsList.map((product) => (
                <div className={styles.product} key={product.id}>
                  <Input
                    id="product"
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
                    onChange={(e) => handleChange(e, product.id)}
                  />
                </div>
              ))}
              <React.Fragment>
                <ErrorModal error={error} onClear={clearError} />
                <Modal
                  show={showConfirmModal}
                  header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                  contentClass="specific-item__modal-content"
                  footerClass="specific-item__modal-actions"
                  footer={<Button onClick={sumbitHandler}>OK</Button>}
                ></Modal>
                {isLoading && <LoadingSpinner asOverlay />}
                <Button
                  disabled={!formState.isValid}
                  onClick={showWarningHandler}
                >
                  ΚΑΤΑΧΩΡΗΣΗ
                </Button>
              </React.Fragment>
            </>
          )}

          {selectedOption !== "Καταστροφή αποθήκης" && (
            <select value={selectedCar} onChange={handleCarSelect}>
              <option value="">Επιλογή οχήματος</option>
              {carList.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.pinakida}
                </option>
              ))}
            </select>
          )}
          {selectedCar && (
            <>
              <span>
                Ημ/νία καταχώρησης:<br></br>
                <br></br>
              </span>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
              {productsList.map((product) => (
                <div className={styles.product} key={product.id}>
                  <label htmlFor={`product-${product.id}`}>
                    {product.name}
                  </label>
                  <input
                    id={`product-${product.id}`}
                    type="number"
                    min="0"
                    value={quantities[product.id]}
                    onChange={(e) => handleChange(e, product.id)}
                  />
                </div>
              ))}
              <React.Fragment>
                <ErrorModal error={error} onClear={clearError} />
                <Modal
                  show={showConfirmModal}
                  header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                  contentClass="specific-item__modal-content"
                  footerClass="specific-item__modal-actions"
                  footer={<Button onClick={sumbitHandler}>OK</Button>}
                ></Modal>
                {isLoading && <LoadingSpinner asOverlay />}
                <Button onClick={showWarningHandler}>ΚΑΤΑΧΩΡΗΣΗ</Button>
              </React.Fragment>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default AddEntry;
