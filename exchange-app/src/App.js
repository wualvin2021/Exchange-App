import React, { useState, useEffect } from 'react';

const CurrencyExchange = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(0);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(response => response.json())
      .then(data => {
        setExchangeRates(data.rates);
      })
      .catch(error => console.error('Error fetching exchange rates:', error));
  }, [baseCurrency]);

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount1(value);
      setAmount2(value * exchangeRates[currency2]);
    }
  };

  const handleCurrency1Change = (event) => {
    setCurrency1(event.target.value);
    setAmount2(amount1 * exchangeRates[event.target.value]);
  };

  const handleCurrency2Change = (event) => {
    setCurrency2(event.target.value);
    setAmount2(amount1 * exchangeRates[event.target.value]);
  };

  const handleAmount2Change = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount2(value);
      setAmount1(value / exchangeRates[currency2]);
    }
  };

  return (
    <div className="currency-exchange">
      <h1>Simple Currency Exchange</h1>
      <div className="base-currency">
        <label>Select Base Currency:</label>
        <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      <div className="exchange-rates">
        <h2>Exchange Rates:</h2>
        <ul>
          {Object.keys(exchangeRates).map(currency => (
            <li key={currency}>{currency}: {exchangeRates[currency]}</li>
          ))}
        </ul>
      </div>
      <div className="currency-converter">
        <h2>Currency Converter</h2>
        <div className="converter-input">
          <label>Amount:</label>
          <input type="number" value={amount1} onChange={handleAmountChange} />
          <select value={currency1} onChange={handleCurrency1Change}>
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span>to</span>
          <input type="number" value={amount2} onChange={handleAmount2Change} />
          <select value={currency2} onChange={handleCurrency2Change}>
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
      <footer>
        <p><a href="https://www.instagram.com/chipmonk02/?next=%2F">instagram</a></p>
      </footer>
    </div>
  );
};

export default CurrencyExchange;
