import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import './Column.css';

const COLUMN_COLORS = {
  todo: '#7c3aed',
  inProgress: '#f59e0b',
  done: '#10b981',
};

function Column({ column, cards, onDelete }) {
  const accentColor = COLUMN_COLORS[column.id] || '#7c3aed';

  return (
    <div className="column" style={{ '--accent': accentColor }}>
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-dot" />
          <h2 className="column-title">{column.title}</h2>
        </div>
        <span className="column-badge">{cards.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`card-list ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="empty-column">Drop cards here</div>
            )}
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
