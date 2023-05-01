import React from "react";
import "../TableItem.css";
import moment from "moment";

const WarehouseDestructionsItem = ({ item }) => {
  return (
    <tr>
      {Object.entries(item).map(([key, value], index) => {
        if (index === 0) {
          return <td key={index}>{moment(value).format("DD-MM-YYYY")}</td>;
        } else {
          return <td key={index}>{value}</td>;
        }
      })}
    </tr>
  );
};

export default WarehouseDestructionsItem;
