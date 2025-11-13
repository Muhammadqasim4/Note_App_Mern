import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [q, setQ] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    document.body.classList.toggle('dark', saved);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.body.classList.toggle('dark', newMode);
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load notes', 'error');
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  // Add note
  const addNote = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/notes', { title, content });
      setNotes(prev => [data, ...prev]);
      setTitle('');
      setContent('');
      Swal.fire({
        icon: 'success',
        title: 'Note added!',
        showConfirmButton: false,
        timer: 1200
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not add note', 'error');
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This note will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      Swal.fire('Deleted!', 'Your note has been removed.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to delete note', 'error');
    }
  };

  // Update note
  const updateNote = async (id, note) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Note',
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Title" value="${note.title}" />` +
        `<textarea id="swal-content" class="swal2-textarea" placeholder="Content" cols=24>${note.content}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: () => {
        const newTitle = document.getElementById('swal-title').value.trim();
        const newContent = document.getElementById('swal-content').value.trim();
        if (!newTitle) {
          Swal.showValidationMessage('Title is required');
          return false;
        }
        return { title: newTitle, content: newContent };
      }
    });

    if (!formValues) return;

    try {
      const { data } = await api.patch(`/notes/${id}`, formValues);
      setNotes(prev => prev.map(n => n._id === id ? data : n));
      Swal.fire({
        icon: 'success',
        title: 'Note updated!',
        showConfirmButton: false,
        timer: 1000
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update note', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Swal.fire({
      title: 'Logged out!',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = '/login';
    });
  };

  const filtered = notes.filter(
    n => n.title.toLowerCase().includes(q.toLowerCase()) ||
         n.content.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Notes</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={toggleDarkMode}>
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <form onSubmit={addNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      <div className="search-bar">
        <input
          placeholder="Search notes..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className="notes-grid">
        {filtered.map(note => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={() => deleteNote(note._id)}
            onUpdate={() => updateNote(note._id, note)}
          />
        ))}
      </div>
    </div>
  );
}
