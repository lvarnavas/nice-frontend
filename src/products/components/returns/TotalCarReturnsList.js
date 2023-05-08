import TotalCarReturnsItem from "./TotalCarReturnsItem";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import Card from "../../../shared/components/hooks.js/UIElements/Card";
import "../shared.css";

const TotalCarReturnsList = (props) => {
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
    if (columnName === "pinakida") {
      return "Πινακίδα";
    }
    return columnName;
  };
  return (
    <div className="products-components__container-list ">
      <Card>
        <h2>
          ΣΥΝΟΛΙΚΕΣ ΕΠΙΣΤΡΟΦΕΣ ΑΠΟ <span>{formattedStartDate}</span> ΕΩΣ{" "}
          <span>{formattedEndDate}</span>
        </h2>
      </Card>
      <div className="products-components__container-list-content">
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
              return <TotalCarReturnsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarReturnsList;
