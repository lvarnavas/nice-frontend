import React, { useState } from "react";
import Modal from "../../../shared/components/hooks.js/UIElements/Modal";
import ErrorModal from "../../../shared/components/hooks.js/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/hooks.js/UIElements/LoadingSpinner";
import Button from "../../../shared/components/hooks.js/FormElements/Button";
import { useHttpClient } from "../../../shared/components/hooks.js/http-hook";

import "../TableItem.css";

const SingleCarDestructionsItem = ({ item, onDelete }) => {
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
          flag: "deleteCarDestructionItem",
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
          if (key === "date") {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            value = `${day}-${month}-${year}`;
          }
          return <td key={index}>{value}</td>;
        })}
        <td>
          {isLoading && <LoadingSpinner asOverlay />}
          <Button to={`/edit-quantities?tid=${item.id}&type=cardestruction`}>
            Επεξεργασία
          </Button>
          <Button danger onClick={showDeleteWarningHandler}>
            Διαγραφή
          </Button>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SingleCarDestructionsItem;
