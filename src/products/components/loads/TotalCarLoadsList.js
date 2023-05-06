import TotalCarLoadsItem from "./TotalCarLoadsItem";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import "../TableList.css";

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
    <div className="components-container">
      <h2 className="title">
        Συνολικά φορτώματα από {formattedStartDate} έως {formattedEndDate}:
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
              return <TotalCarLoadsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarLoadsList;
