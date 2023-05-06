import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import SingleCarReturnsItem from "./SingleCarReturnsItem";
import "../TableList.css";

const SingleCarReturnsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΕΠΙΣΤΡΟΦΕΣ</h2>
      </div>
    );
  }

  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "DD-MM-YYYY"
  );

  const columnNames = Object.keys(props.items[0]);

  const getCustomColumnName = (columnName) => {
    if (columnName === "date") {
      return "Ημ/νία";
    } else if (columnName === "id") {
      return "ID";
    }
    return columnName;
  };

  return (
    <div className="components-container">
      <h2 className="title">
        Επιστροφές οχήματος {props.carName} από {formattedStartDate} έως{" "}
        {formattedEndDate}:
      </h2>
      <div id="content">
        <table>
          <thead>
            <tr>
              {columnNames.map((columnName, index) => (
                <th key={index}> {getCustomColumnName(columnName)} </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, index) => {
              return (
                <SingleCarReturnsItem
                  key={index}
                  item={item}
                  onDelete={props.onDeleteItem}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SingleCarReturnsList;
