import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './searchpage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory } from 'react-router-dom';
import el from 'date-fns/locale/el';

const SearchPage = () => {
  const history = useHistory();
  const [searchType, setSearchType] = useState('');
  const [carList, setCarList] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

  useEffect(() => {
    const fetchCarList = async () => {
      const response = await axios.get('http://localhost:5000/api/products/get-car-list');
      setCarList(response.data.carslist);
    };

    if (searchType === 'Αναζήτηση βάσει οχήματος') {
      fetchCarList();
    }
  }, [searchType]);

  const noCarSearch = () => {
    const searchParams = {
      searchType,
      startDate,
      endDate,
    };

    console.log('Search parameters:', searchParams);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    if (searchType==="Αναζήτηση συνολικών φορτωμάτων")
    {
      history.push(`/loads/total-car-loads?startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    else if (searchType==="Αναζήτηση συνολικών καταστροφών οχημάτων")
    {
      history.push(`/destructions/total-car-destructions?startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    else if (searchType==="Αναζήτηση συνολικών επιστροφών")
    {
      history.push(`/returns/total-car-returns?startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    else if (searchType==="Αναζήτηση καταστροφών αποθήκης")
    {
      history.push(`/destructions/total-warehouse-destructions?startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };
  

  const carSearch = () => {
    const searchParams = {
      selectedCar,
      selectedCategory,
      startDate,
      endDate,
    };

    console.log('Search parameters:', searchParams);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    if(selectedCategory==='Φορτώματα')
    {
      history.push(`/loads/single-car-loads?carid=${selectedCar}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    else if (selectedCategory==='Επιστροφές')
    {
      history.push(`/returns/single-car-returns?carid=${selectedCar}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }
    else if (selectedCategory==='Καταστροφές')
    {
      history.push(`/destructions/single-car-destructions?carid=${selectedCar}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`);
    }

  };

  const renderForm = () => {
    switch (searchType) {
      case 'Αναζήτηση συνολικών φορτωμάτων':
        case 'Αναζήτηση συνολικών καταστροφών οχημάτων':
        case 'Αναζήτηση συνολικών επιστροφών':
        case 'Αναζήτηση καταστροφών αποθήκης':
          return (
            <><span>Αναζήτηση από:</span>
              <div className="date-container">
                   
                   <DatePicker
                     selected={startDate}
                     onChange={(date) => setStartDate(date)}
                     dateFormat="dd/MM/yyyy"
                     locale={el}
                   />
                 </div>
                  <span>Αναζήτηση εώς:</span>
                  <div className="date-container">
                   
                   <DatePicker
                     selected={endDate}
                     onChange={(date) => setEndDate(date)}
                     dateFormat="dd/MM/yyyy"
                     locale={el}
                   />
                 </div>
                 <button onClick={noCarSearch}>Αναζήτηση</button>
            </>
          );
      case 'Αναζήτηση βάσει οχήματος':
        return (
          <>
            <select value={selectedCar || ''} onChange={(e) => setSelectedCar(e.target.value)}>
              <option value="" disabled>
                Επιλέξτε οχήμα
              </option>
              {carList.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.pinakida}
                </option>
              ))}
            </select>
            {selectedCar && (
              <>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="" disabled>
                    Επιλέξτε κατηγορία
                  </option>
                  <option value="Φορτώματα">Φορτώματα</option>
                  <option value="Επιστροφές">Επιστροφές</option>
                  <option value="Καταστροφές">Καταστροφές</option>
                </select>
                <span>Αναζήτηση από:</span>
                <div className="date-container">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale={el}
                  />
                </div>
                <span>Αναζήτηση εώς:</span>
                <div className="date-container">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale={el}
                  />
                </div>
                <button onClick={carSearch}>Αναζήτηση</button>
          </>
        )}
      </>
    );
  default:
    return null;
}
};

return (
<div className="search-container">
<h2>Αναζήτηση καταχωρήσεων:</h2>
<select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
<option value="" disabled>
Επιλέξτε τύπο αναζήτησης
</option>
<option value="Αναζήτηση συνολικών φορτωμάτων">Αναζήτηση συνολικών φορτωμάτων</option>
<option value="Αναζήτηση συνολικών καταστροφών οχημάτων">Αναζήτηση συνολικών καταστροφών οχημάτων</option>
<option value="Αναζήτηση καταστροφών αποθήκης">Αναζήτηση καταστροφών αποθήκης</option>
<option value="Αναζήτηση συνολικών επιστροφών">Αναζήτηση συνολικών επιστροφών</option>
<option value="Αναζήτηση βάσει οχήματος">Αναζήτηση βάσει οχήματος</option>
</select>
{renderForm()}
</div>
);
};

export default SearchPage;