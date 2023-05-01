import TotalCarDestructionsItem from "./TotalCarDestructionsItem";
import "../TableList.css";

const TotalCarDestructionsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Δεν βρέθηκαν καταστροφές οχημάτων.</h2>
      </div>
    );
  }
  const searchParams = new URLSearchParams(window.location.search);
  //const carID = searchParams.get('carid');
  let startDate = searchParams.get('startdate');
  let endDate = searchParams.get('enddate');
  
  if (!Boolean(startDate) || !Boolean(endDate)) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    startDate = `${firstDayOfMonth.getDate().toString().padStart(2, '0')}-${(firstDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${firstDayOfMonth.getFullYear().toString()}`;
    endDate = `${lastDayOfMonth.getDate().toString().padStart(2, '0')}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getFullYear().toString()}`;
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
  } else {
    console.log("Both variables have values.");
  }

  // Try to parse the start date and end date as dates
  try {
    if (startDate) {
      const startTimestamp = Date.parse(startDate);
      if (!isNaN(startTimestamp)) {
        startDate = new Date(startTimestamp).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-');
      }
    }

    if (endDate) {
      const endTimestamp = Date.parse(endDate);
      if (!isNaN(endTimestamp)) {
        endDate = new Date(endTimestamp).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-');
      }
    }
  } catch (error) {
    console.error(error);
  }
  const columnNames = Object.keys(props.items[0]);

  const getCustomColumnName = (columnName) => {
    if (columnName === "car_name") {
      return "Πινακίδα";
    }
    return columnName;
  };
  

  return (
    <div className="components-container">
      <h2 className="title">Συνολικές καταστροφές οχημάτων από {startDate} έως {endDate}:</h2>
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
              return <TotalCarDestructionsItem key={index} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalCarDestructionsList;
