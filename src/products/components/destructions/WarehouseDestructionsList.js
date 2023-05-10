import WarehouseDestructionsItem from "./WarehouseDestructionsItem";
import { dateFormater } from "../../../shared/components/hooks.js/dateFormatter";
import Card from "../../../shared/components/hooks.js/UIElements/Card";
import "../shared.css";

const WarehouseDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="products-components__container-list">
        <Card>
          <h2>ΔΕΝ ΒΡΕΘΗΚΑΝ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ</h2>
        </Card>
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
    <div className="products-components__container-list ">
      <Card>
        <h2>
          ΣΥΝΟΛΙΚΕΣ ΚΑΤΑΣΤΡΟΦΕΣ ΑΠΟΘΗΚΗΣ ΑΠΟ <span>{formattedStartDate}</span>{" "}
          ΕΩΣ <span>{formattedEndDate}</span>
        </h2>
      </Card>
      <div className="products-components__container-list-content">
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
              return (
                <WarehouseDestructionsItem
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

export default WarehouseDestructionsList;
