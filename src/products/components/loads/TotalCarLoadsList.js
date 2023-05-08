import TotalCarLoadsItem from "./TotalCarLoadsItem";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import Card from "../../../shared/components/hooks.js/UIElements/Card";
import "../shared.css";

const TotalCarLoadsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΦΟΡΤΩΜΑΤΑ</h2>
      </div>
    );
  }

  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "DD-MM-YYYY"
  );

  console.log(formattedStartDate);

  const columnNames = Object.keys(props.items[0]);

  const getCustomColumnName = (columnName) => {
    if (columnName === "Pinakida") {
      return (columnName = "Πινακίδα");
    }
    return columnName;
  };

  return (
    <div className="products-components__container-list">
      <Card>
        <h2>
          ΣΥΝΟΛΙΚΑ ΦΟΡΤΩΜΑΤΑ ΑΠΟ <span>{formattedStartDate}</span> ΕΩΣ{" "}
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
              return <TotalCarLoadsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarLoadsList;
