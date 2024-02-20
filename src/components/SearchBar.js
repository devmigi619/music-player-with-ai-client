// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css';

function SearchBar({ onResults, toggleLoading, query }) {
  const [searchQuery, setSearchQuery] = useState(query || '');

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    toggleLoading(true);
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      onResults(response.data); // 검색 결과를 부모 컴포넌트로 전달
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      toggleLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for music..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
