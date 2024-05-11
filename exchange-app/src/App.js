import React, { useState, useEffect } from 'react';

const CurrencyExchange = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [baseCurrencyRates, setBaseCurrencyRates] = useState({});
  const [converterRates, setConverterRates] = useState({});
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(0);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');

  useEffect(() => {
    // Online exchange rate API
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(response => response.json())
      .then(data => {
        setBaseCurrencyRates(data.rates);
      })
      .catch(error => console.error('Error fetching base currency rates:', error));
  }, [baseCurrency]);

  useEffect(() => {
    // Online exchange rate API for currency2
    fetch(`https://api.exchangerate-api.com/v4/latest/${currency1}`)
      .then(response => response.json())
      .then(data => {
        setConverterRates(data.rates);
        setAmount2(parseFloat((amount1 * data.rates[currency2]).toFixed(2))); // Round to 2 decimal places
      })
      .catch(error => console.error('Error fetching converter rates:', error));
  }, [currency1, amount1, currency2]);

  const handleBaseCurrencyChange = (event) => {
    const newBaseCurrency = event.target.value;
    setBaseCurrency(newBaseCurrency);
  };

  const handleAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount1(value);
      setAmount2(parseFloat((value * converterRates[currency2]).toFixed(2))); // Round to 2 decimal places
    }
  };

  const handleCurrency1Change = (event) => {
    const newCurrency = event.target.value;
    setCurrency1(newCurrency);
    if (newCurrency === currency2) {
      setCurrency2(currency1);
      setAmount2(amount1);
    }
  };

  const handleCurrency2Change = (event) => {
    const newCurrency = event.target.value;
    setCurrency2(newCurrency);
    if (newCurrency === currency1) {
      setCurrency1(currency2);
      setAmount2(amount1);
    }
  };

  const handleAmount2Change = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount2(parseFloat(value.toFixed(2)));
      setAmount1(parseFloat((value / converterRates[currency2]).toFixed(2)));
    }
  };

  const clearInput = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      event.target.value = '';
      if (event.target.id === 'amount1') {
        setAmount1('');
      } else if (event.target.id === 'amount2') {
        setAmount2('');
      }
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
            <li key={currency}>{currency}: {baseCurrencyRates[currency]}</li>
          ))}
        </ul>
      </div>
      <div className="currency-converter">
        <h2>Currency Converter</h2>
        <div className="converter-input">
          <label>Amount:</label>
          <input type="number" value={amount1} onChange={handleAmountChange} onKeyDown={clearInput} />
          <select value={currency1} onChange={handleCurrency1Change}>
            {majorCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span>to</span>
          <input type="number" value={amount2} onChange={handleAmount2Change} onKeyDown={clearInput} />
          <select value={currency2} onChange={handleCurrency2Change}>
            {majorCurrencies.filter(currency => currency !== currency1).map(currency => (
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
