import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch data when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchStockData();
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const fetchStockData = useCallback(async () => {
    if (!debouncedSearchTerm) return;
    
    setLoading(true);
    try {
      // Use API_URL as placeholder for now
      const API_URL = `https://API_URL/api/stocks?query=${debouncedSearchTerm}`;
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="App">
      <div className="stock-analyzer-container">
        <header className="stock-analyzer-header">
          <h1>StockSense Pro</h1>
          <p className="subtitle">Powerful insights for smarter investments</p>
        </header>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for stocks by name or symbol..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {loading && <div className="loading-indicator">Searching...</div>}
        </div>

        <div className="results-container">
          {results.length > 0 ? (
            <div className="stock-results">
              {results.map((result, index) => (
                <div key={index} className="stock-card">
                  <h3>{result.symbol}</h3>
                  <p className="company-name">{result.name}</p>
                  <div className="stock-info">
                    <div className="info-item">
                      <span className="label">Price:</span>
                      <span className="value">${result.price}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Change:</span>
                      <span className={`value ${result.change >= 0 ? 'positive' : 'negative'}`}>
                        {result.change >= 0 ? '+' : ''}{result.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : debouncedSearchTerm ? (
            <div className="no-results">No results found. Try a different search term.</div>
          ) : (
            <div className="initial-state">
              <p>Enter a stock name or symbol to begin your analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
