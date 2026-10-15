import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.css';

function Card({ card, index, columnId, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <p className="card-content">{card.content}</p>
          {hovered && (
            <button
              className="card-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id, columnId);
              }}
              title="Delete task"
            >
              ×
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Card;
