import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./EditEntry.css";
import { useHttpClient } from "../../shared/components/hooks.js/http-hook";
import Input from "../../shared/components/hooks.js/FormElements/Input";
import { useForm } from "../../shared/components/hooks.js/form-hook";
import LoadingSpinner from "../../shared/components/hooks.js/UIElements/LoadingSpinner";
import {
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from "../../shared/components/hooks.js/util/validators";
import Modal from "../../shared/components/hooks.js/UIElements/Modal";
import ErrorModal from "../../shared/components/hooks.js/UIElements/ErrorModal";
import Button from "../../shared/components/hooks.js/FormElements/Button";

const EditQuantities = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [requestCompleted, setRequestCompleted] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const tid = searchParams.get("tid");
  const type = searchParams.get("type");
  const [productsList, setProductsList] = useState([]);
  const [loadedQuantities, setLoadedQuantities] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      product: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (tid && type) {
      const fetchProductsList = async () => {
        try {
          const productListData = await sendRequest(
            "http://localhost:5000/api/products/get-products"
          );
          setProductsList(productListData.productsList);
        } catch (err) {}
      };
      fetchProductsList();

      const fetchQuantities = async () => {
        try {
          const quantitiesData = await sendRequest(
            "http://localhost:5000/api/products/get-quantities",
            "POST",
            JSON.stringify({
              id: `${tid}`,
              flag: `${type}`,
            }),
            { "Content-Type": "application/json" }
          );
          setLoadedQuantities(quantitiesData.quantities);
          console.log(quantitiesData);
          setFormData({
            product: {
              value: quantitiesData.quantities[0].quantity,
              isValid: true,
            },
          });
        } catch (err) {}
      };
      fetchQuantities();
    }
  }, [sendRequest, tid, type, setFormData]);

  const getTitle = () => {
    if (!tid || !type) {
      return (
        <div className="edit-entry-page empty">
          <h2>Δεν επιλέχθηκε καταχώρηση</h2>
          {!tid && !type && (
            <button onClick={() => history.push("/")}>
              Επιστροφή στην αρχική
            </button>
          )}
        </div>
      );
    } else {
      if (type === "load") {
        return (
          <div className="edit-entry-page empty">
            <h2>Επεξεργασία φορτώματος: {tid}</h2>
          </div>
        );
      } else if (type === "return") {
        return (
          <div className="edit-entry-page empty">
            <h2>Επεξεργασία επιστροφής: {tid}</h2>
          </div>
        );
      } else if (type === "cardestruction") {
        return (
          <div className="edit-entry-page empty">
            <h2>Επεξεργασία καταστροφής οχήματος: {tid}</h2>
          </div>
        );
      } else if (type === "warehousedestruction") {
        return (
          <div className="edit-entry-page empty">
            <h2>Επεξεργασία καταστροφής αποθήκης: {tid}</h2>
          </div>
        );
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setShowConfirmModal(false);
      await sendRequest(
        "http://localhost:5000/api/products/edit-entry",
        "PATCH",
        JSON.stringify({
          transactionid: tid, // ok
          date: new Date(),
          flag: `edit${type}`,
          products: productsList.map((product, index) => ({
            productId: product.id,
            quantity: formState.inputs[`product-${product.id}`].value,
          })),
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setRequestCompleted(true);
      showWarningHandler();
    } catch (err) {}
  };

  const handleOkClick = () => {
    history.goBack();
    //setShowConfirmModal(false)
  };

  const showWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const handleBackClick = () => {
    history.goBack();
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedQuantities && !error) {
    return (
      <div className="center">
        <h2>Could not find Event!</h2>
      </div>
    );
  }

  const toStringQuantitiesArray = loadedQuantities.map((obj) => {
    return {
      ...obj,
      quantity: obj.quantity.toString(),
    };
  });

  return (
    <div className="edit-entry-page">
      {getTitle()}
      <div className="edit-entry-container">
        {productsList.map((product, index) => (
          <div key={product.id}>
            <Input
              id={`product-${product.id}`}
              element="input"
              type="text"
              label={product.name}
              validators={[
                VALIDATOR_MIN(0),
                VALIDATOR_MAX(1999),
                VALIDATOR_REQUIRE(),
              ]}
              errorText="Παρακαλώ εισάγετε έναν έγκυρο αιρθμό."
              onInput={inputHandler}
              initialValue={
                requestCompleted
                  ? formState.inputs[`product-${product.id}`].value
                  : toStringQuantitiesArray[index].quantity
              }
              initialValid={true}
            />
          </div>
        ))}
      </div>
      {tid && type && (
        <div className="button-container">
          <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {/* Show the Modal only when requestCompleted is true */}
            {requestCompleted && (
              <Modal
                show={showConfirmModal}
                header={<div>ΕΠΙΤΥΧΗΣ ΚΑΤΑΧΩΡΗΣΗ</div>}
                contentClass="specific-item__modal-content"
                footerClass="specific-item__modal-actions"
                footer={<Button onClick={handleOkClick}>OK</Button>}
              ></Modal>
            )}
            {isLoading && <LoadingSpinner asOverlay />}
            <Button disabled={!formState.isValid} onClick={handleSubmit}>
              ΥΠΟΒΟΛΗ
            </Button>
          </React.Fragment>
          <button onClick={handleBackClick}>ΕΠΙΣΤΡΟΦΗ ΠΙΣΩ</button>
        </div>
      )}
    </div>
  );
};

export default EditQuantities;
