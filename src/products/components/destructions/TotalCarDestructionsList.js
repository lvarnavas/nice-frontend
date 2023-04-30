import TotalCarDestructionsItem from "./TotalCarDestructionsItem";
import "../TableList.css";

const TotalCarDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>TotalCarDestructionsList not found</h2>
      </div>
    );
  }
  const columnNames = Object.keys(props.items[0]);

  return (
    <div className="components-container">
      <h2 className="title">TotalCarDestructionsList</h2>
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
              return <TotalCarDestructionsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarDestructionsList;
