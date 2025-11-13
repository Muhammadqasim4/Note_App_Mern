const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = await Note.create({ user: req.user._id, title, content, tags });
    res.status(201).json(note);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    note = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json(note);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note removed' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
