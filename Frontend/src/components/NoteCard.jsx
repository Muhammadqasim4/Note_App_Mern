import React from 'react';

export default function NoteCard({ note, onDelete, onUpdate }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <button onClick={onUpdate}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
