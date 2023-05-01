import WarehouseStatusItem from "./WarehouseStatusItem";
import "./WarehouseStatusList.css";

const WarehouseStatusList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>Αδυναμία φόρτωσης δεδομένων.</h2>
      </div>
    );
  }
  return (
    <div className="components-container">
      <h2 className="title">Κατάσταση θαλάμου:</h2>
      <div id="content">
        <table>
          <thead>
            <tr>
              {/*<th>ID</th> */ }
              <th>Όνομα Προίόντος</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          {props.items.map((warehouse) => {
            return (
              <WarehouseStatusItem
                key={warehouse.product_id}
                id={warehouse.product_id}
                productName={warehouse.product_name}
                quantity={warehouse.current_quantity}
              />
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default WarehouseStatusList;
