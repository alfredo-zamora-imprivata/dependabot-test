import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Board from './components/Board';
import './App.css';

const COLUMN_ORDER = ['todo', 'inProgress', 'done'];

const INITIAL_COLUMNS = {
  todo: { id: 'todo', title: 'To Do', cardIds: [] },
  inProgress: { id: 'inProgress', title: 'In Progress', cardIds: [] },
  done: { id: 'done', title: 'Done', cardIds: [] },
};

function App() {
  const [cards, setCards] = useState({});
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [newCardText, setNewCardText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos?_limit=9')
      .then((response) => {
        const fetchedCards = {};
        const todoIds = [];
        const inProgressIds = [];
        const doneIds = [];

        response.data.forEach((todo, idx) => {
          const id = `card-${todo.id}`;
          fetchedCards[id] = { id, content: _.startCase(todo.title) };

          if (todo.completed) {
            doneIds.push(id);
          } else if (idx % 3 === 1) {
            inProgressIds.push(id);
          } else {
            todoIds.push(id);
          }
        });

        setCards(fetchedCards);
        setColumns((prev) => ({
          ...prev,
          todo: { ...prev.todo, cardIds: todoIds },
          inProgress: { ...prev.inProgress, cardIds: inProgressIds },
          done: { ...prev.done, cardIds: doneIds },
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load initial tasks. Add your own below.');
        setLoading(false);
      });
  }, []);

  const addCard = () => {
    const trimmed = newCardText.trim();
    if (!trimmed) return;

    const id = `card-${Date.now()}`;
    setCards((prev) => ({ ...prev, [id]: { id, content: trimmed } }));
    setColumns((prev) => ({
      ...prev,
      todo: { ...prev.todo, cardIds: [...prev.todo.cardIds, id] },
    }));
    setNewCardText('');
  };

  const deleteCard = (cardId, columnId) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cardIds: prev[columnId].cardIds.filter((id) => id !== cardId),
      },
    }));
    setCards((prev) => _.omit(prev, cardId));
  };

  const moveCard = (cardId, sourceColId, destColId, destIndex) => {
    setColumns((prev) => {
      const sourceIds = prev[sourceColId].cardIds.filter((id) => id !== cardId);
      const destIds = [...prev[destColId].cardIds];

      if (sourceColId === destColId) {
        const newIds = [...prev[sourceColId].cardIds];
        const srcIndex = newIds.indexOf(cardId);
        newIds.splice(srcIndex, 1);
        newIds.splice(destIndex, 0, cardId);
        return { ...prev, [sourceColId]: { ...prev[sourceColId], cardIds: newIds } };
      }

      destIds.splice(destIndex, 0, cardId);
      return {
        ...prev,
        [sourceColId]: { ...prev[sourceColId], cardIds: sourceIds },
        [destColId]: { ...prev[destColId], cardIds: destIds },
      };
    });
  };

  const totalCards = _.sumBy(Object.values(columns), (col) => col.cardIds.length);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">Todo Board</h1>
          <span className="task-count">{totalCards} tasks</span>
        </div>
        {error && <p className="error-banner">{error}</p>}
        <div className="add-card-form">
          <input
            type="text"
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCard()}
            placeholder="Add a new task and press Enter..."
            className="add-card-input"
          />
          <button onClick={addCard} className="add-card-btn">
            Add Task
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading tasks...</p>
        </div>
      ) : (
        <Board
          columns={columns}
          columnOrder={COLUMN_ORDER}
          cards={cards}
          onDelete={deleteCard}
          onMove={moveCard}
        />
      )}
    </div>
  );
}

export default App;
