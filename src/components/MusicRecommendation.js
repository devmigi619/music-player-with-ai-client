import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MusicRecommendation.css';

function MusicRecommendation({ recommendations, setRecommendations, onSearch }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const endOfMessagesRef = useRef(null); // 새로운 메시지를 위한 ref 생성

  useEffect(() => {
    let intervalId;

    if (loading) {
      setDots('.');
      intervalId = setInterval(() => {
        setDots(dots => (dots.length >= 50 ? '.' : dots + '.'));
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [loading]);

  const getMusicRecommendations = async () => {
    setLoading(true);
    // 입력된 prompt를 바로 추가하고 로딩 상태를 표시
    const newRec = { prompt: prompt, response: "Loading...", loading: true };
    setRecommendations(prev => [...prev, newRec]);
    setPrompt(''); // 입력 필드 초기화

    try {
      const response = await axios.post('/api/recommendations', { prompt });
      // 로딩 상태를 실제 응답으로 업데이트
      setRecommendations(prev =>
        prev.map(rec =>
          rec.prompt === prompt && rec.loading
            ? { ...rec, response: response.data.recommendations, loading: false }
            : rec
        )
      );
    } catch (error) {
      console.error('Error fetching music recommendations:', error);
      // 에러 발생 시 로딩 상태를 에러 메시지로 업데이트
      setRecommendations(prev =>
        prev.map(rec =>
          rec.prompt === prompt && rec.loading
            ? { ...rec, response: 'Failed to fetch recommendations.', loading: false }
            : rec
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' }); // 스크롤을 맨 아래로 이동
    }
  }, [recommendations]); // recommendations 배열이 바뀔 때마다 실행

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getMusicRecommendations();
    }
  }

  // 노래 제목을 파싱하고 클릭 가능한 요소로 변환하는 함수
  const parseSongTitles = (response) => {
    return response.split('\n').map((line, index) => {
      const match = line.match(/^(\d+)\. (.+) - (.+)$/); // "숫자. 제목 - 아티스트" 형식과 일치하는지 확인
      if (match) {
        const [, , title, artist] = match;
        return (
          <div key={index} onClick={() => onSearch(`${title} ${artist}`)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            {line}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <div className="music-recommendation">
      <div className="chat-content">
        {recommendations.map((item, index) => (
          <React.Fragment key={index}>
            <div className="chat-bubble user">{item.prompt}</div>
            {item.loading ? (
              <div className="chat-bubble bot">{dots}</div> // 로딩 중 표시
            ) : (
              <div className="chat-bubble bot">{parseSongTitles(item.response)}</div> // 실제 응답 표시
            )}
          </React.Fragment>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="chat-input-container">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your mood or genre preference..."
          className="chat-input"
        ></textarea>
        <button onClick={getMusicRecommendations} className="request-button">Send</button>
      </div>
    </div>
  );

}

export default MusicRecommendation;
