import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddEntry.module.css';
import el from 'date-fns/locale/el';

const AddEntry = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [date, setDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    
    // Fetch cars
    fetch('http://localhost:5000/api/products/get-car-list')
      .then((response) => response.json())
      .then((data) => setCars(data.carslist));

    // Fetch products
    fetch('http://localhost:5000/api/products/get-products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.productsList);
        const initialQuantities = data.productsList.reduce((acc, product) => {
            acc[product.id] = 0;
            return acc;
          }, {});
          
        setQuantities(initialQuantities);
      });
  }, []);

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
    setSelectedCar('');
  };

  const handleCarSelect = (e) => {
    setSelectedCar(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleChange = (e, productId) => {
    setQuantities({ ...quantities, [productId]: e.target.value });
  };

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const handleSubmit = async () => {
    console.log(selectedOption, selectedCar, date, quantities);
    const formattedDate = formatDate(date);

    if(selectedOption==='Φόρτωμα')
    {
        const payload = {
            carId: selectedCar,
            date: formattedDate,
            products: quantities
          };
        
          try {
            const response = await fetch('http://localhost:5000/api/products/add-loads', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(result);
            
            if (!response.ok) {
              throw new Error('Failed to submit the data.');
            }
            else if (response.ok)
            {
                const messageBox = document.createElement('div');
                messageBox.innerText = 'Επιτυχής καταχώρηση!';
                messageBox.classList.add(styles['message-box']);
                document.body.appendChild(messageBox);
                // Remove message box after 3 seconds
                setTimeout(() => {
                  document.body.removeChild(messageBox);
                }, 3000);
            }

          } catch (error) {
            console.error('Error submitting data:', error);
          }
        
    }
    else if (selectedOption==='Επιστροφή')
    {
        const payload = {
            carId: selectedCar,
            date: formattedDate,
            products: quantities
          };
        
          try {
            const response = await fetch('http://localhost:5000/api/products/add-car-returns', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(result);
            
            if (!response.ok) {
              throw new Error('Failed to submit the data.');
            }
            else if (response.ok)
            {
                const messageBox = document.createElement('div');
                messageBox.innerText = 'Επιτυχής καταχώρηση!';
                messageBox.classList.add(styles['message-box']);
                document.body.appendChild(messageBox);
                // Remove message box after 3 seconds
                setTimeout(() => {
                  document.body.removeChild(messageBox);
                }, 3000);
            }

          } catch (error) {
            console.error('Error submitting data:', error);
          }
    }
    else if (selectedOption==='Καταστροφή οχήματος')
    {
        const payload = {
            carId: selectedCar,
            date: formattedDate,
            products: quantities
          };
        
          try {
            const response = await fetch('http://localhost:5000/api/products/add-car-destructions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(result);
            
            if (!response.ok) {
              throw new Error('Failed to submit the data.');
            }
            else if (response.ok)
            {
                const messageBox = document.createElement('div');
                messageBox.innerText = 'Επιτυχής καταχώρηση!';
                messageBox.classList.add(styles['message-box']);
                document.body.appendChild(messageBox);
                // Remove message box after 3 seconds
                setTimeout(() => {
                  document.body.removeChild(messageBox);
                }, 3000);
            }

          } catch (error) {
            console.error('Error submitting data:', error);
          }
    }
    else if (selectedOption==='Καταστροφή αποθήκης')
    {
        const payload = {
            date: formattedDate,
            products: quantities
          };
        
          try {
            const response = await fetch('http://localhost:5000/api/products/add-warehouse-destructions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(result);
            
            if (!response.ok) {
              throw new Error('Failed to submit the data.');
            }
            else if (response.ok)
            {
                const messageBox = document.createElement('div');
                messageBox.innerText = 'Επιτυχής καταχώρηση!';
                messageBox.classList.add(styles['message-box']);
                document.body.appendChild(messageBox);
                // Remove message box after 3 seconds
                setTimeout(() => {
                  document.body.removeChild(messageBox);
                }, 3000);
            }

          } catch (error) {
            console.error('Error submitting data:', error);
          }
    }
  };
  

  return (
    <div className={styles.container}>
      <h1>Νέα καταχώρηση:</h1>
      <select value={selectedOption} onChange={handleSelect}>
        <option value="">Επιλογή καταχώρησης</option>
        <option value="Φόρτωμα">Φόρτωμα</option>
        <option value="Επιστροφή">Επιστροφή</option>
        <option value="Καταστροφή οχήματος">Καταστροφή οχήματος</option>
        <option value="Καταστροφή αποθήκης">Καταστροφή αποθήκης</option>
        
      </select>
      {selectedOption && (
        <>{selectedOption === 'Καταστροφή αποθήκης' && (
            <>
              <span>Ημ/νία καταχώρησης:<br></br><br></br></span>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
              {products.map((product) => (
                <div className={styles.product} key={product.id}>
                  <label htmlFor={`product-${product.id}`}>{product.name}</label>
                  <input
                    id={`product-${product.id}`}
                    type="number"
                    min="0"
                    value={quantities[product.id]}
                    onChange={(e) => handleChange(e, product.id)}
                  />
                </div>
              ))}
              <button onClick={handleSubmit}>Καταχώρηση</button>
            </>
          )}
          
          {selectedOption !== 'Καταστροφή αποθήκης' && (
            <select value={selectedCar} onChange={handleCarSelect}>
              <option value="">Επιλογή οχήματος</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.pinakida}
                </option>
              ))}
            </select>
          )}
          {selectedCar && (
            <>
              <span>Ημ/νία καταχώρησης:<br></br><br></br></span>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={el}
              />
              {products.map((product) => (
                <div className={styles.product} key={product.id}>
                  <label htmlFor={`product-${product.id}`}>{product.name}</label>
                  <input
                id={`product-${product.id}`}
                type="number"
                  min="0"
                 value={quantities[product.id]}
                 onChange={(e) => handleChange(e, product.id)}
               
/>
                </div>
              ))}
              <button onClick={handleSubmit}>Καταχώρηση</button>
            </>
          )}
        </>
      )}
    </div>
  );
              }
  export default AddEntry;  