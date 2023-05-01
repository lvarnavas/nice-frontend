import React, { useState, useEffect } from 'react';
import './AccountPage.css';

const AccountPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const isValidProductName = (name) => {
    const regex = /^[a-zA-Zα-ωΑ-Ω0-9\s]{1,15}$/;
    return regex.test(name);
  };

  const handleSubmit = async () => {
    if (!isValidProductName(productName)) {
      setMessage('The entry was not recorded. Invalid product name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product.');
      }

      setMessage('The entry was successful.');
      setProductName('');
    } catch (error) {
      setMessage('The entry was not recorded.');
      console.error(error);
    }
  };

  return (
    <div className="account-page">
      <h2>Διαχείριση λογαριασμού</h2>
      <button className="account-page-button" onClick={toggleForm}>
        {showForm ? 'Ακύρωση εισαγωγής' : 'Εισαγωγή νέου προϊόντος'}
      </button>
      {showForm && (
        <>
          <h3>Όνομα προϊόντος:</h3>
          <input type="text" value={productName} onChange={handleProductNameChange} />
          <button className="account-page-button" onClick={handleSubmit}>
            Εισαγωγή
          </button>
        </>
      )}
      {message && <div className="message-box">{message}</div>}
    </div>
  );
};

export default AccountPage;
