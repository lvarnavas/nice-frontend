import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import './EditEntry.css';

const EditEntry = () => {
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const tid = searchParams.get('tid');
  const type = searchParams.get('type');
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tid && type) {
      const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5000/api/products/get-products');
        setProducts(response.data.productsList);
      };
      fetchProducts();
    }
  }, [tid, type]);

  const getTitle = () => {
    if (!tid || !type) {
        return (
          <div className="edit-entry-page empty">
            <h2>Δεν επιλέχθηκε καταχώρηση</h2>
            {!tid && !type && <button onClick={() => history.push('/')}>Επιστροφή στην αρχική</button>}
          </div>
        );
      }
      else
      {
        if(type==='load')
        {
            return (
                <div className="edit-entry-page empty">
                  <h2>Επεξεργασία φορτώματος: {tid}</h2>
                </div>
              );
        }
        else if(type==='return')
        {
            return (
                <div className="edit-entry-page empty">
                  <h2>Επεξεργασία επιστροφής: {tid}</h2>
                </div>
              );
        }
        else if(type==='destruction')
        {
            return (
                <div className="edit-entry-page empty">
                  <h2>Επεξεργασία καταστροφής οχήματος: {tid}</h2>
                </div>
              );
        }
      }
  };

  const handleChange = (productId, event) => {
    setQuantities({ ...quantities, [productId]: event.target.value });
  };

  const isInteger = (value) => {
    return /^\d+$/.test(value);
  };

  const areQuantitiesValid = () => {
    return Object.values(quantities).every(quantity => isInteger(quantity));
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!areQuantitiesValid()) {
      showMessage("Πρόβλημα επεξεργασίας: Όλες οι τιμές πρέπει να είναι ακέραιοι αριθμοί");
      return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/products/edit-entry', {
          transactionid: tid,
          date: new Date(),
          products: Object.entries(quantities).map(([productId, quantity]) => ({
            productId: parseInt(productId),
            quantity: parseInt(quantity),
          })),
          flag: `edit${type}`,
        });
      
        if (response.data.OK) {
          showMessage("Επιτυχής επεξεργασία");
        } else {
          showMessage("Πρόβλημα επεξεργασίας");
        }
      } catch (error) {
        showMessage("Πρόβλημα επεξεργασίας");
      }
    };

    const handleBackClick = () => {
    history.goBack();
    };
    
    return (
    <div className="edit-entry-page">
    {getTitle()}
    <div className="edit-entry-container">
    {products.map(product => (
    <div key={product.id}>
    <span>{product.name}</span>
    <input
    type="number"
    min="0"
    defaultValue="0"
    onChange={(event) => handleChange(product.id, event)}
    />
    </div>
    ))}
    </div>
    {tid && type && (
    <div className="button-container">
    <button onClick={handleSubmit}>Υποβολή</button>
    {message && <div className="message-box">{message}</div>}
    <button onClick={handleBackClick}>Επιστροφή πίσω</button>
    </div>
    )}
    </div>
    );
    };
    
    export default EditEntry;