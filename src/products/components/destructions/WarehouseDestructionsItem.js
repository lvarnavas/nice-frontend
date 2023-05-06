import React, { useState } from "react";
import Button from "../../../shared/components/hooks.js/FormElements/Button";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import Modal from "../../../shared/components/hooks.js/UIElements/Modal";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import "../TableItem.css";

const WarehouseDestructionsItem = ({ item, onDelete }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    console.log(item);
    try {
      await sendRequest(
        `http://localhost:5000/api/products/delete-item/${item.ID}`,
        "DELETE",
        JSON.stringify({
          flag: "deleteWarehouseDestructionItem",
        }),
        { "Content-Type": "application/json" }
      );
      onDelete(item.ID);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο;"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Θέλετε να συνεχίσετε και να διαγράψετε αυτό το στοιχείο;</p>
      </Modal>
      <tr>
        {Object.entries(item).map(([key, value], index) => {
          if (key === "Date") {
            const date = new Date(item.Date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            value = `${day}-${month}-${year}`;
          }
          return <td key={index}>{value}</td>;
        })}
        <td>
          {isLoading && <LoadingSpinner asOverlay />}
          <Button danger onClick={showDeleteWarningHandler}>
            x
          </Button>
          <Button
            to={`/edit-quantities?tid=${item.ID}&type=warehousedestruction`}
          >
            Edit
          </Button>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default WarehouseDestructionsItem;
