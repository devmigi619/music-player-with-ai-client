import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Playlist.css'; // 필요한 CSS 스타일

function Playlist({ playlist, onSelectVideo, onDragEnd, onDeleteVideo }) {
  // 삭제 버튼 클릭 이벤트 핸들러
  const handleDeleteClick = (e, videoId) => {
    e.stopPropagation(); // 클릭 이벤트의 전파를 중지
    onDeleteVideo(videoId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="playlist">
        {(provided) => (
          <ul className="playlist" {...provided.droppableProps} ref={provided.innerRef}>
            {playlist.map((video, index) => (
              <Draggable key={video.id.videoId} draggableId={video.id.videoId} index={index}>
                {(provided, snapshot) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} className={snapshot.isDragging ? 'dragging' : ''}>
                    <div className="playlist-item" onClick={() => onSelectVideo(video.id.videoId)}>
                      <div className="drag-handle" {...provided.dragHandleProps}>≡</div>
                      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="thumbnail" />
                      <div className="video-info">
                        <div className="video-title">{video.snippet.title}</div>
                        <div className="video-channel">{video.snippet.channelTitle}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteVideo(video.id.videoId); }} className="delete-button">Delete</button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Playlist;
