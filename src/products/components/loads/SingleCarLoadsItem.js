import React, { useState } from "react";
import Modal from "../../../shared/components/hooks.js/UIElements/Modal";
import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import Button from "../../../shared/components/hooks.js/FormElements/Button";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";
import moment from "moment"; // make sure to import moment.js
import "../shared.css";

const SingleCarLoadsItem = ({ item, onDelete }) => {
  // Get the current date and the date of the item
  const currentDate = moment();
  const itemDate = moment(item.date);

  // Compute the difference in days
  const diffInDays = itemDate.diff(currentDate, "days");

  // Determine if the item date is within one day of the current date
  const isWithinOneDay = diffInDays >= -1 && diffInDays <= 1;
  //END DATE

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/products/delete-item/${item.id}`,
        "DELETE",
        JSON.stringify({
          flag: "deleteLoadItem",
        }),
        { "Content-Type": "application/json" }
      );
      onDelete(item.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="ΕΠΙΒΕΒΑΙΩΣΗ ΔΙΑΓΡΑΦΗΣ"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <div className="products-components__item-modal-btn">
              <Button inverse onClick={cancelDeleteHandler}>
                ΑΚΥΡΩΣΗ
              </Button>
              <Button danger onClick={confirmDeleteHandler}>
                ΔΙΑΓΡΑΦΗ
              </Button>
            </div>
          </React.Fragment>
        }
      >
        <p>Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο;</p>
      </Modal>

      <tr>
        {Object.entries(item).map(([key, value], index) => {
          if (key === "date") {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            value = `${day}-${month}-${year}`;
          }
          return <td key={index}>{value}</td>;
        })}
        <td className="products-compontents__edit-item">
          {isLoading && <LoadingSpinner asOverlay />}
          {isWithinOneDay ? (
            <Button inverse to={`/edit-quantities?tid=${item.id}&type=load`}>
              <img src={require("../../../edit-btn.png")} alt="edit-btn" />
            </Button>
          ) : (
            <Button disabled inverse>
              <img src={require("../../../edit-btn.png")} alt="edit-btn" />
            </Button>
          )}
          <div className="spacer"></div>
          {isWithinOneDay ? (
            <Button danger onClick={showDeleteWarningHandler}>
              <img src={require("../../../delete-btn.png")} alt="delete-btn" />
            </Button>
          ) : (
            <Button disabled danger>
              <img src={require("../../../delete-btn.png")} alt="delete-btn" />
            </Button>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SingleCarLoadsItem;
