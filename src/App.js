import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import { createChart } from 'lightweight-charts';
import original from 'react95/dist/themes/original';
import './App.css';

const TradingSimulator = ({ title, imageSrc, initialPrice }) => {
  const [price, setPrice] = useState(initialPrice || (Math.random() * 0.0001 + 0.00005).toFixed(8));
  const [priceHistory, setPriceHistory] = useState(() => [{
    time: Math.floor(Date.now() / 1000),
    open: price,
    high: price,
    low: price,
    close: price,
  }]);
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
        },
        grid: {
          vertLines: {
            color: '#e1e1e1',
          },
          horzLines: {
            color: '#e1e1e1',
          },
        },
        priceScale: {
          borderColor: '#cccccc',
        },
        timeScale: {
          borderColor: '#cccccc',
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50',
        downColor: '#f44336',
        borderDownColor: '#f44336',
        borderUpColor: '#4caf50',
        wickDownColor: '#f44336',
        wickUpColor: '#4caf50',
      });

      chartRef.current = candlestickSeries;

      return () => chart.remove();
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const sortedHistory = [...priceHistory].sort((a, b) => a.time - b.time);
      chartRef.current.setData(sortedHistory);
    }
  }, [priceHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prevPrice => {
        const change = (Math.random() - 0.5) * 2; // Random price change between -1 and 1
        const newPrice = Math.max(0, prevPrice + change); // Ensure price doesn't go below 0
        const lastEntry = priceHistory[priceHistory.length - 1];
        const newTime = lastEntry.time + 60; // New entry every 60 seconds
        const newEntry = {
          time: newTime,
          open: lastEntry.close,
          high: Math.max(lastEntry.close, newPrice),
          low: Math.min(lastEntry.close, newPrice),
          close: newPrice,
        };
        setPriceHistory(prev => {
          const updatedHistory = [
            ...prev.filter(entry => entry.time < newTime),
            newEntry,
          ].sort((a, b) => a.time - b.time);
          return updatedHistory;
        });
        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [priceHistory]);

  const handleBuy = () => {
    setPrice(prev => prev * 1.05); // Increase price by 5%
  };

  const handleSell = () => {
    setPrice(prev => prev * 0.95); // Decrease price by 5%
  };

  return (
    <Window className="w-full max-w-xl p-4">
      <WindowHeader className="font-custom text-xs">
        <span>{title}</span>
      </WindowHeader>
      <WindowContent className="bg-gray-800 p-4 flex flex-col items-center">
        <div className="flex items-center">
          <img src={imageSrc} alt="Chart Image" className="size-16 md:size-20 mr-4" />
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleBuy} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Pump
            </Button>
            <Button 
              onClick={handleSell} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Dump
            </Button>
          </div>
        </div>
        <div ref={chartContainerRef} className="w-[250px] md:w-[300px] h-[200px] md:h-[200px] mt-4"></div>
      </WindowContent>
    </Window>
  );
};

const FloatingImageWithChat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const fullMessage = "Wow! Another day of pump and dump. Shill me some coins to pump!";

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      className={`z-20 w-[80%] sm:w-[40%] floating-container ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        left: '70%', // Center it horizontally
        transform: 'translate(-50%, 0)', // Adjust position to center on small screens
      }}
    >
      <img
        src="m.png"
        alt="Floating Dog"
        className='w-full'
      />
      <div
        className='absolute -top-[70px] -left-[50px] md:top-[10px] md:left-[10px]'
        style={{
          backgroundColor: 'transparent',
          padding: '10px',
          maxWidth: '200px',
          textAlign: 'center',
        }}
      >
        <Window>
          <p className='p-1'>{fullMessage}</p>
        </Window>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={original}>
      <div className="min-h-screen flex justify-center items-center">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="vid.mp4" type="video/mp4" />
        </video>
        <div className="flex justify-center items-center h-full py-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-center">
            <TradingSimulator title="mDOG" imageSrc="dog.png" initialPrice={0.00012}/>
            <TradingSimulator title="MOODENG" imageSrc="/m.jpeg" initialPrice={0.00012}/>
            <TradingSimulator title="michi" imageSrc="/mi.jpeg" initialPrice={0.00012}/>
            <TradingSimulator title="MOTHER" imageSrc="/mo.png" initialPrice={0.00012}/>
            <TradingSimulator title="FWOG" imageSrc="/f.jpeg" initialPrice={0.00012}/>
            <TradingSimulator title="SCF" imageSrc="/scf.png" initialPrice={0.00012}/>
          </div>
        </div>
        <FloatingImageWithChat />
      </div>
    </ThemeProvider>
  );
}

export default App;