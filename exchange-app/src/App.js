import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const CurrencyExchange = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [baseCurrencyRates, setBaseCurrencyRates] = useState({});
  const [converterRates, setConverterRates] = useState({});
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(0);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Exchange Rate',
      data: [],
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }],
  });

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
    // Online exchange rate API
    if (currency1 !== currency2) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${currency1}`)
        .then(response => response.json())
        .then(data => {
          setConverterRates(data.rates);
        })
        .catch(error => console.error('Error fetching converter rates:', error));
    }
  }, [currency1, currency2]);

  useEffect(() => {
    const startDate = new Date('2023-05-01');
    const endDate = new Date('2024-05-01');
    const dateLabels = [];
    const dateRates = [];

    for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      dateLabels.push(dateString);
      const rate = (Math.random() * (1.5 - 1.2) + 1.2).toFixed(2);
      dateRates.push(rate);
    }

    // chart data
    const ChartData = {
      labels: dateLabels,
      datasets: [{
        label: `Exchange Rate ${currency1} to ${currency2}`,
        data: dateRates,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      }],
    };
    setChartData(ChartData);
  }, [converterRates, currency1, currency2]);

  const BaseCurrencyChange = (event) => {
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

  const LeftCurrency = (event) => {
    const newCurrency = event.target.value;
    setCurrency1(newCurrency);
  };

  const RightCurrency = (event) => {
    const newCurrency = event.target.value;
    setCurrency2(newCurrency);
  };

  const handleAmount2Change = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount2(value);
      setAmount1(parseFloat((value / converterRates[currency2]).toFixed(2))); // Round to 2 decimal places
    }
  };

  const ClearInput = (event) => {
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
        <select value={baseCurrency} onChange={BaseCurrencyChange}>
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
          <input type="number" value={amount1} onChange={handleAmountChange} onKeyDown={ClearInput} />
          <select value={currency1} onChange={LeftCurrency}>
            {majorCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span>to</span>
          <input type="number" value={amount2} onChange={handleAmount2Change} onKeyDown={ClearInput} />
          <select value={currency2} onChange={RightCurrency}>
            {majorCurrencies.filter(currency => currency !== currency1).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart">
        <Line data={chartData} />
      </div>
      <footer>
        <p><a href="https://www.instagram.com/chipmonk02/?next=%2F">Instagram</a></p>
      </footer>
    </div>
  );
};

export default CurrencyExchange;
