import React from "react";

import Modal from "./Modal";
import Button from "../FormElements/Button";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Πρόβλημα σύνδεσης!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>OK</Button>}
    >
      {console.log(props)}
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
