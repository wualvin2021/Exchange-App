import React, { useState, useEffect } from 'react';

const CurrencyExchange = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(0);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');

  useEffect(() => {
    // online exchange rate API
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(response => response.json())
      .then(data => {
        setExchangeRates(data.rates);
      })
      .catch(error => console.error('Error with exchange rates:', error));
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

  const USDCurrencyChange = (event) => {
    setCurrency1(event.target.value);
    setAmount2(amount1 * exchangeRates[event.target.value]);
  };

  const EUROCurrencyChange = (event) => {
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

  const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'KRW'];

  return (
    <div className="currency-exchange">
      <h1>Simple Currency Exchange</h1>
      <nav className="navbar">
        <label>Select Base Currency:</label>
        <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
          {majorCurrencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </nav>
      <div className="exchange-rates">
        <h2>Exchange Rates:</h2>
        <ul>
          {majorCurrencies.map(currency => (
            <li key={currency}>{currency}: {exchangeRates[currency]}</li>
          ))}
        </ul>
      </div>
      <div className="currency-converter">
        <h2>Currency Converter</h2>
        <div className="converter-input">
          <label>Amount:</label>
          <input type="number" value={amount1} onChange={handleAmountChange} />
          <select value={currency1} onChange={USDCurrencyChange}>
            {majorCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span>to</span>
          <input type="number" value={amount2} onChange={handleAmount2Change} />
          <select value={currency2} onChange={EUROCurrencyChange}>
            {majorCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
      <footer>
        <p><a href="https://www.instagram.com/chipmonk02/?next=%2F">Instagram</a></p>
      </footer>
    </div>
  );
};

export default CurrencyExchange;
