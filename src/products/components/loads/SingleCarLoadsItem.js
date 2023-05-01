import "../TableItem.css";
import moment from "moment";
import React, { useState } from "react";

const SingleCarLoadsItem = ({ item }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);

  const deleteLoad = async (loadId) => {
    try {
      await fetch(`http://localhost:5000/api/products/delete-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: "deleteload", transactionid: loadId }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting load:", error);
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 3000);
    }
  };

  const editLoad = (loadId) => {
    window.location.href = `http://localhost:3000/editentry?tid=${loadId}&type=load`;
  };

  return (
    <React.Fragment>
      {showMessageBox && (
        <div className="message-box">Error deleting entry</div>
      )}
      <tr>
        {Object.entries(item).map(([key, value], index) => {
          if (key === "date") {
            value = moment(value).format("DD-MM-YYYY");
          }
          return <td key={index}>{value}</td>;
        })}
        <td>
          
          <img
            src="https://share.uowm.gr/files/33998c4fd440599cea5a4485bca26782d571/edit.png"
            alt="Edit Load"
            style={{ width: "38px", cursor: "pointer" }}
            onClick={() => editLoad(item.id)}
          />
          <img
            src="https://share.uowm.gr/files/2045eb11822f9f73735576b6ada5156feaff/remove.png"
            alt="Delete Load"
            style={{ width: "35px", cursor: "pointer" }}
            onClick={() => deleteLoad(item.id)}
          />
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SingleCarLoadsItem;
