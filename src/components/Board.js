import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './Board.css';

function Board({ columns, columnOrder, cards, onDelete, onMove }) {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onMove(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnCards = column.cardIds
            .map((cardId) => cards[cardId])
            .filter(Boolean);

          return (
            <Column
              key={column.id}
              column={column}
              cards={columnCards}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default Board;
