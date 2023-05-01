import "../TableItem.css";
import moment from "moment";

const SingleCarReturnsItem = ({ item }) => {
  return (
    <tr>
      {Object.entries(item).map(([key, value], index) => {
        if (key === "date") {
          value = moment(value).format("DD-MM-YYYY");
        }
        return <td key={index}>{value}</td>;
      })}
    </tr>
  );
};

export default SingleCarReturnsItem;
