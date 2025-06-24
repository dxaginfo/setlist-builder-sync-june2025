const express = require('express');
const { body, param, query } = require('express-validator');
const setlistController = require('../controllers/setlist.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @route   GET /api/setlists
 * @desc    Get all setlists for the authenticated user
 * @access  Private
 */
router.get(
  '/',
  authMiddleware.protect,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortBy').optional().isString().withMessage('Sort by must be a string'),
    query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
    query('archived').optional().isBoolean().withMessage('Archived must be a boolean'),
    query('bandId').optional().isUUID().withMessage('Band ID must be a valid UUID')
  ],
  validateRequest,
  setlistController.getAllSetlists
);

/**
 * @route   GET /api/setlists/:id
 * @desc    Get a single setlist by ID
 * @access  Private/Public (depending on setlist visibility)
 */
router.get(
  '/:id',
  authMiddleware.protect,
  [
    param('id').isUUID().withMessage('Setlist ID must be a valid UUID')
  ],
  validateRequest,
  setlistController.getSetlist
);

/**
 * @route   POST /api/setlists
 * @desc    Create a new setlist
 * @access  Private
 */
router.post(
  '/',
  authMiddleware.protect,
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('venue').optional().isLength({ max: 100 }).withMessage('Venue cannot exceed 100 characters'),
    body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date'),
    body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('isPublic').optional().isBoolean().withMessage('Is public must be a boolean'),
    body('bandId').optional().isUUID().withMessage('Band ID must be a valid UUID'),
    body('songs').optional().isArray().withMessage('Songs must be an array'),
    body('songs.*.id').optional().isUUID().withMessage('Song ID must be a valid UUID'),
    body('songs.*.notes').optional().isString().withMessage('Notes must be a string'),
    body('songs.*.customKey').optional().isString().withMessage('Custom key must be a string'),
    body('songs.*.customTempo').optional().isInt({ min: 1 }).withMessage('Custom tempo must be a positive integer')
  ],
  validateRequest,
  setlistController.createSetlist
);

/**
 * @route   PUT /api/setlists/:id
 * @desc    Update a setlist by ID
 * @access  Private
 */
router.put(
  '/:id',
  authMiddleware.protect,
  [
    param('id').isUUID().withMessage('Setlist ID must be a valid UUID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('venue').optional().isLength({ max: 100 }).withMessage('Venue cannot exceed 100 characters'),
    body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date'),
    body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('isPublic').optional().isBoolean().withMessage('Is public must be a boolean'),
    body('isArchived').optional().isBoolean().withMessage('Is archived must be a boolean'),
    body('bandId').optional().isUUID().withMessage('Band ID must be a valid UUID'),
    body('songs').optional().isArray().withMessage('Songs must be an array'),
    body('songs.*.id').optional().isUUID().withMessage('Song ID must be a valid UUID'),
    body('songs.*.notes').optional().isString().withMessage('Notes must be a string'),
    body('songs.*.customKey').optional().isString().withMessage('Custom key must be a string'),
    body('songs.*.customTempo').optional().isInt({ min: 1 }).withMessage('Custom tempo must be a positive integer')
  ],
  validateRequest,
  setlistController.updateSetlist
);

/**
 * @route   DELETE /api/setlists/:id
 * @desc    Delete a setlist by ID
 * @access  Private
 */
router.delete(
  '/:id',
  authMiddleware.protect,
  [
    param('id').isUUID().withMessage('Setlist ID must be a valid UUID')
  ],
  validateRequest,
  setlistController.deleteSetlist
);

/**
 * @route   POST /api/setlists/:id/collaborators
 * @desc    Add a collaborator to a setlist
 * @access  Private
 */
router.post(
  '/:id/collaborators',
  authMiddleware.protect,
  [
    param('id').isUUID().withMessage('Setlist ID must be a valid UUID'),
    body('collaboratorId').isUUID().withMessage('Collaborator ID must be a valid UUID')
  ],
  validateRequest,
  setlistController.addCollaborator
);

/**
 * @route   DELETE /api/setlists/:id/collaborators/:collaboratorId
 * @desc    Remove a collaborator from a setlist
 * @access  Private
 */
router.delete(
  '/:id/collaborators/:collaboratorId',
  authMiddleware.protect,
  [
    param('id').isUUID().withMessage('Setlist ID must be a valid UUID'),
    param('collaboratorId').isUUID().withMessage('Collaborator ID must be a valid UUID')
  ],
  validateRequest,
  setlistController.removeCollaborator
);

module.exports = router;