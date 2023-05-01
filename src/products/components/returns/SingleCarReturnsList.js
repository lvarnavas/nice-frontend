import { useEffect, useState } from 'react';
import SingleCarReturnsItem from './SingleCarReturnsItem';
import '../TableList.css';

const SingleCarReturnsList = (props) => {
  const [carName, setCarName] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const carID = searchParams.get('carid');

    if (carID) {
      fetch('http://localhost:5000/api/products/get-car-list')
        .then((response) => response.json())
        .then((data) => {
          const car = data.carslist.find((car) => car.id === parseInt(carID));
          if (car) {
            setCarName(car.pinakida);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
}, []);

if (props.items.length === 0) {
return (
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
<h2>Δεν βρέθηκαν επιστροφές.</h2>
</div>
);
}

const searchParams = new URLSearchParams(window.location.search);
let startDate = searchParams.get('startdate');
let endDate = searchParams.get('enddate');

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
    if (columnName === 'date') {
    return 'Ημ/νία';
    } else if (columnName === 'id') {
    return 'ID';
    }
    return columnName;
    };
    
    return (
    <div className="components-container">
    <h2 className="title">
    Επιστροφές οχήματος {carName} από {startDate} έως {endDate}:
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
    return <SingleCarReturnsItem key={index} item={item} />;
    })}
    </tbody>
    </table>
    </div>
    </div>
    );
    };
    
    export default SingleCarReturnsList;