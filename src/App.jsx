import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { FaArrowDown } from 'react-icons/fa';  // Import arrow icon
import { useSpring, animated } from '@react-spring/web';  // Import React Spring

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState(1);
  const [result, setResult] = useState(1);

  useEffect(() => {
    const getCurrencies = async () => {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setCurrencies(Object.keys(response.data.rates));
      setConversionRate(response.data.rates[toCurrency]);
    };

    getCurrencies();
  }, [toCurrency]);

  useEffect(() => {
    setResult(amount * conversionRate);
  }, [amount, conversionRate]);

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
    fetchConversionRate(e.target.value, toCurrency);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
    fetchConversionRate(fromCurrency, e.target.value);
  };

  const fetchConversionRate = async (from, to) => {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
    setConversionRate(response.data.rates[to]);
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  const slideIn = useSpring({
    from: { transform: 'translateY(-10px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    config: { tension: 170, friction: 26 },
  });

  const scale = useSpring({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
    reset: true,
    reverse: true,
    config: { tension: 170, friction: 26 },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <animated.div style={fadeIn} className="absolute top-0 left-0 w-full h-full bg-gray-900" />
      <animated.div style={slideIn} className="z-10">
        <h1 className="flex justify-center self-center text-3xl font-bold mb-6">Currency Translator</h1>
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded shadow-md w-[18vw] max-w-md relative">
          <div className="mb-4 w-full">
            <label className="block text-gray-400 mb-2">From Currency:</label>
            <select
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              className="block w-full p-2 border border-gray-700 bg-gray-900 rounded"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <FaArrowDown className="text-gray-400 my-2 animate-bounce" />
          <div className="mb-4 w-full">
            <label className="block text-gray-400 mb-2">To Currency:</label>
            <select
              value={toCurrency}
              onChange={handleToCurrencyChange}
              className="block w-full p-2 border border-gray-700 bg-gray-900 rounded"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <FaArrowDown className="text-gray-400 my-2 animate-bounce" />
          <div className="mb-4 w-full">
            <label className="block text-gray-400 mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full p-2 border border-gray-700 bg-gray-900 rounded"
            />
          </div>
          <div className="w-full">
            <h2 className="flex justify-center self-center text-lg font-bold mb-2">Converted Amount:</h2>
            <animated.p style={scale} className="flex justify-center self-center text-[2rem] mt-4 mb-4 text-xl">{result.toFixed(2)} {toCurrency}</animated.p>
          </div>
        </div>
        <p className="flex justify-center self-center text-sm text-gray-500 mt-6">Created by Daniel Lytvyushko</p>
      </animated.div>
    </div>
  );
}

export default App;
