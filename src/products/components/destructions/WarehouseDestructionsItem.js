import React from "react";
import "../TableItem.css";

const WarehouseDestructionsItem = ({ item }) => {
  return (
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
    </tr>
  );
};

export default WarehouseDestructionsItem;
