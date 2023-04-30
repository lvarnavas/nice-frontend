import TotalCarReturnsItem from "./TotalCarReturnsItem";
import "../TableList.css";

const TotalCarReturnsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Δεν βρέθηκαν επιστροφές</h2>
      </div>
    );
  }
  const columnNames = Object.keys(props.items[0]).map((key) => {
    return props.customColumnNames && props.customColumnNames[key]
      ? props.customColumnNames[key]
      : key;
  });

  return (
    <div className="components-container">
      <h2 className="title">Συνολικές Επιστροφές Οχημάτων</h2>
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
return <TotalCarReturnsItem key={index} item={item} />;
})}
</tbody>
</table>
</div>
</div>
);
};

export default TotalCarReturnsList;
