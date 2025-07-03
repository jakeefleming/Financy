// Cursor and ChatGPT helped write this code
import React, { useState } from 'react';

function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
