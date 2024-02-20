import React, { useEffect, useRef } from 'react';
import './MusicPlayer.css';

function MusicPlayer({ videoId, onVideoEnd }) {
  const playerRef = useRef(null);

  useEffect(() => {
    // Iframe API 로드 함수
    const loadIframeAPI = () => {
      const scriptTag = document.createElement('script');
      scriptTag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
    };

    // YouTube Iframe API 준비가 완료되었을 때 호출되는 함수
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('ytplayer', {
        videoId: videoId,
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // YT 스크립트가 이미 로드되었는지 확인하고, 없다면 로드합니다.
    if (!window.YT) {
      loadIframeAPI();
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else if (window.YT && window.YT.Player) {
      // Iframe API가 이미 로드되었으면 바로 플레이어 초기화
      onYouTubeIframeAPIReady();
    }

    // 컴포넌트가 언마운트될 때 플레이어 인스턴스와 글로벌 콜백을 정리
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  // 비디오 재생 상태 변경 시 호출되는 함수
  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      onVideoEnd();
    }
  };

  useEffect(() => {
    // 이미 플레이어가 있고, YT 스크립트가 로드된 경우, 비디오 ID 변경 시 새 비디오 로드
    if (playerRef.current && window.YT && window.YT.PlayerState) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <div className="music-player">
      <div id="ytplayer"></div> {/* YouTube 플레이어가 로드될 컨테이너 */}
    </div>
  );
}

export default MusicPlayer;
