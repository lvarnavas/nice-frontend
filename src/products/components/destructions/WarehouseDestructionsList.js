import WarehouseDestructionsItem from "./WarehouseDestructionsItem";
import "../TableList.css";

const WarehouseDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Δεν βρέθηκαν καταστροφές αποθήκης</h2>
      </div>
    );
  }
  const columnNames = Object.keys(props.items[0]);

  return (
    <div className="components-container">
      <h2 className="title">Καταστροφές Αποθήκης</h2>
      <div id="content">
        <table>
          <thead>
            <tr>
              {columnNames.map((columnName, index) => (
                            <th key={index}> {columnName} </th>
                            ))}
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
