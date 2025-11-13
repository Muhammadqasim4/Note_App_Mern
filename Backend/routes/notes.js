const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notesController = require('../controllers/notesController');

router.get('/', auth, notesController.getNotes);
router.post('/', auth, notesController.addNote);
router.patch('/:id', auth, notesController.updateNote);
router.delete('/:id', auth, notesController.deleteNote);

module.exports = router;
