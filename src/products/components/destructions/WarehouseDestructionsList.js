import WarehouseDestructionsItem from "./WarehouseDestructionsItem";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import "../TableList.css";

const WarehouseDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ</h2>
      </div>
    );
  }

  const { formattedStartDate, formattedEndDate } = dateFormater(
    "startdate",
    "enddate",
    "DD-MM-YYYY"
  );

  const columnNames = Object.keys(props.items[0]);

  return (
    <div className="components-container">
      <h2 className="title">
        Συνολικές καταστροφές αποθήκης από {formattedStartDate} έως{" "}
        {formattedEndDate}:
      </h2>
      <div id="content">
        <table>
          <thead>
            <tr>
              {columnNames.map((columnName, index) => {
                if (columnName === "Date") {
                  return <th key={index}>Ημ/νία</th>;
                } else {
                  return <th key={index}>{columnName}</th>;
                }
              })}
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, index) => {
              return <WarehouseDestructionsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseDestructionsList;
