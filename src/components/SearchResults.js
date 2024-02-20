import React from 'react';
import './SearchResults.css';

function SearchResults({ results, onAddToPlaylist }) {

  // decodeHtml 함수는 그대로 유지
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // 결과 아이템 클릭 시 onAddToPlaylist 호출
  const handleResultClick = (result) => {
    onAddToPlaylist(result);
  };

  return (
    <div className="search-results">
      {results.map((result, index) => (
        <div className="result-item" key={index} onClick={() => handleResultClick(result)} >
          <img src={result.snippet.thumbnails.default.url} alt={result.snippet.title} />
          <div className="result-info">
            <div className="result-title">{decodeHtml(result.snippet.title)}</div>
            <div className="result-channel">{result.snippet.channelTitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
