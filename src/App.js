// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import MusicPlayer from './components/MusicPlayer';
import Playlist from './components/Playlist';
import MusicRecommendation from './components/MusicRecommendation';
import './App.css'; // 전역 스타일

function App() {

  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const playlistRef = useRef(playlist); // playlist 상태를 추적하는 ref 추가
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const selectedVideoIdRef = useRef(selectedVideoId);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    playlistRef.current = playlist;

    // playlist가 변경될 때마다 실행됩니다.
    if (playlist.length === 1) {
      // 플레이리스트에 첫 번째 항목이 추가되면 해당 비디오를 자동으로 재생합니다.
      setSelectedVideoId(playlist[0].id.videoId);
    }
  }, [playlist]);

  useEffect(() => {
    selectedVideoIdRef.current = selectedVideoId;
  }, [selectedVideoId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleLoading = (isLoading) => setIsLoading(isLoading);
  const handleOpenPlaylistModal = () => setIsPlaylistModalOpen(true);
  const handleClosePlaylistModal = () => setIsPlaylistModalOpen(false);

  const handleAddToPlaylist = (video) => {
    setPlaylist((prevPlaylist) => [...prevPlaylist, video]);
  };

  const handleSelectVideoFromPlaylist = (videoId) => {
    setSelectedVideoId(videoId);
    setIsPlaylistModalOpen(false); // 선택 후 재생 대기목록 모달을 닫을 수 있습니다.
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  // 비디오가 끝났을 때 호출될 함수
  const handleVideoEnd = () => {
    const currentIndex = playlistRef.current.findIndex(
      video => video.id.videoId === selectedVideoIdRef.current
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex < playlistRef.current.length) {
      setSelectedVideoId(playlistRef.current[nextIndex].id.videoId);
    } else {
      setSelectedVideoId('');
    }
  };

  const handleDeleteVideo = (videoId) => {
    setPlaylist(prevPlaylist => prevPlaylist.filter(video => video.id.videoId !== videoId));
  }

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // 드롭 위치가 없거나, 위치가 변경되지 않았다면 아무 작업도 하지 않음
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newPlaylist = Array.from(playlist);
    const [movedItem] = newPlaylist.splice(source.index, 1);
    newPlaylist.splice(destination.index, 0, movedItem);

    setPlaylist(newPlaylist);
  };

  const onSearch = (songTitle) => {
    setSearchQuery(songTitle); // 검색 쿼리 상태 업데이트
    handleOpenModal(); // 검색 모달 열기
  }

  return (
    <div className="App">
      <Navbar />
      <button onClick={handleOpenModal}>Search</button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <SearchBar onResults={setSearchResults} toggleLoading={toggleLoading} query={searchQuery} />
        {isLoading ?
          <div className="loader"></div>
          :
          <SearchResults
            results={searchResults}
            onAddToPlaylist={handleAddToPlaylist}
          />
        }
      </Modal>
      <button onClick={handleOpenPlaylistModal}>Queue</button>
      <Modal isOpen={isPlaylistModalOpen} onClose={handleClosePlaylistModal}>
        <Playlist
          playlist={playlist}
          onSelectVideo={handleSelectVideoFromPlaylist}
          onDeleteVideo={handleDeleteVideo}
          onDragEnd={onDragEnd}
        />
      </Modal>
      <MusicPlayer videoId={selectedVideoId} onVideoEnd={() => handleVideoEnd()} />
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isChatOpen ? "챗봇 닫기" : "챗봇 열기"}
      </button>
      {isChatOpen && (
        <div className="chat-container">
          <MusicRecommendation
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            onSearch={onSearch}
          />
        </div>
      )}
    </div>
  );
}

export default App;
