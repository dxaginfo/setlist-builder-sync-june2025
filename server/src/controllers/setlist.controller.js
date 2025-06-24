const { Setlist, User, Band, Song, SetlistSong } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * Get all setlists for the authenticated user
 */
exports.getAllSetlists = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'updatedAt', 
      sortOrder = 'DESC',
      archived = 'false',
      bandId = ''
    } = req.query;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereConditions = {
      [Op.or]: [
        { userId },
        // Include setlists where user is a collaborator
        { '$collaborators.id$': userId }
      ],
      isArchived: archived === 'true'
    };
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { venue: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add band filter if provided
    if (bandId) {
      whereConditions.bandId = bandId;
    }
    
    // Get setlists with pagination and filtering
    const { count, rows: setlists } = await Setlist.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Band,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'collaborators',
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: [] }
        },
        {
          model: Song,
          as: 'songs',
          attributes: ['id', 'title', 'artist', 'duration'],
          through: { 
            model: SetlistSong,
            attributes: ['order', 'notes']
          }
        }
      ],
      distinct: true // For correct count with includes
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        setlists,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });
  } catch (error) {
    logger.error('Error in getAllSetlists:', error);
    next(error);
  }
};

/**
 * Get a single setlist by ID
 */
exports.getSetlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const setlist = await Setlist.findOne({
      where: {
        id,
        [Op.or]: [
          { userId },
          { isPublic: true },
          { '$collaborators.id$': userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Band,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'collaborators',
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: [] }
        },
        {
          model: Song,
          as: 'songs',
          attributes: ['id', 'title', 'artist', 'duration', 'key', 'tempo', 'lyrics', 'chordChart'],
          through: { 
            model: SetlistSong,
            attributes: ['order', 'notes', 'customKey', 'customTempo']
          }
        }
      ]
    });
    
    if (!setlist) {
      return next(new AppError('Setlist not found or you do not have permission to view it', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { setlist }
    });
  } catch (error) {
    logger.error('Error in getSetlist:', error);
    next(error);
  }
};

/**
 * Create a new setlist
 */
exports.createSetlist = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, description, venue, date, duration, isPublic, bandId, songs } = req.body;
    
    // Create setlist
    const newSetlist = await Setlist.create({
      name,
      description,
      venue,
      date,
      duration,
      isPublic,
      bandId,
      userId
    });
    
    // Add songs to setlist if provided
    if (songs && Array.isArray(songs) && songs.length > 0) {
      const setlistSongs = songs.map((song, index) => ({
        setlistId: newSetlist.id,
        songId: song.id,
        order: index + 1,
        notes: song.notes || '',
        customKey: song.customKey || null,
        customTempo: song.customTempo || null
      }));
      
      await SetlistSong.bulkCreate(setlistSongs);
    }
    
    // Fetch the complete setlist with associations
    const setlist = await Setlist.findByPk(newSetlist.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Band,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Song,
          as: 'songs',
          attributes: ['id', 'title', 'artist', 'duration', 'key', 'tempo'],
          through: { 
            model: SetlistSong,
            attributes: ['order', 'notes', 'customKey', 'customTempo']
          }
        }
      ]
    });
    
    res.status(201).json({
      status: 'success',
      data: { setlist }
    });
  } catch (error) {
    logger.error('Error in createSetlist:', error);
    next(error);
  }
};

/**
 * Update a setlist by ID
 */
exports.updateSetlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { name, description, venue, date, duration, isPublic, isArchived, bandId, songs } = req.body;
    
    // Find the setlist
    const setlist = await Setlist.findOne({
      where: {
        id,
        [Op.or]: [
          { userId },
          { '$collaborators.id$': userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'collaborators',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!setlist) {
      return next(new AppError('Setlist not found or you do not have permission to update it', 404));
    }
    
    // Update setlist properties
    setlist.name = name || setlist.name;
    setlist.description = description !== undefined ? description : setlist.description;
    setlist.venue = venue !== undefined ? venue : setlist.venue;
    setlist.date = date || setlist.date;
    setlist.duration = duration !== undefined ? duration : setlist.duration;
    setlist.isPublic = isPublic !== undefined ? isPublic : setlist.isPublic;
    setlist.isArchived = isArchived !== undefined ? isArchived : setlist.isArchived;
    setlist.bandId = bandId !== undefined ? bandId : setlist.bandId;
    setlist.version = setlist.version + 1;
    setlist.lastEditedAt = new Date();
    
    await setlist.save();
    
    // Update songs if provided
    if (songs && Array.isArray(songs)) {
      // Remove existing song associations
      await SetlistSong.destroy({
        where: { setlistId: id }
      });
      
      // Add new song associations
      if (songs.length > 0) {
        const setlistSongs = songs.map((song, index) => ({
          setlistId: id,
          songId: song.id,
          order: index + 1,
          notes: song.notes || '',
          customKey: song.customKey || null,
          customTempo: song.customTempo || null
        }));
        
        await SetlistSong.bulkCreate(setlistSongs);
      }
    }
    
    // Fetch the updated setlist with associations
    const updatedSetlist = await Setlist.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Band,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'collaborators',
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: [] }
        },
        {
          model: Song,
          as: 'songs',
          attributes: ['id', 'title', 'artist', 'duration', 'key', 'tempo'],
          through: { 
            model: SetlistSong,
            attributes: ['order', 'notes', 'customKey', 'customTempo']
          }
        }
      ]
    });
    
    res.status(200).json({
      status: 'success',
      data: { setlist: updatedSetlist }
    });
  } catch (error) {
    logger.error('Error in updateSetlist:', error);
    next(error);
  }
};

/**
 * Delete a setlist by ID
 */
exports.deleteSetlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    // Find the setlist
    const setlist = await Setlist.findOne({
      where: {
        id,
        userId // Only the owner can delete
      }
    });
    
    if (!setlist) {
      return next(new AppError('Setlist not found or you do not have permission to delete it', 404));
    }
    
    // Soft delete the setlist (due to paranoid option)
    await setlist.destroy();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Error in deleteSetlist:', error);
    next(error);
  }
};

/**
 * Add a collaborator to a setlist
 */
exports.addCollaborator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { collaboratorId } = req.body;
    
    // Find the setlist
    const setlist = await Setlist.findOne({
      where: {
        id,
        userId // Only the owner can add collaborators
      }
    });
    
    if (!setlist) {
      return next(new AppError('Setlist not found or you do not have permission to update it', 404));
    }
    
    // Check if collaborator exists
    const collaborator = await User.findByPk(collaboratorId);
    
    if (!collaborator) {
      return next(new AppError('User not found', 404));
    }
    
    // Add collaborator
    await setlist.addCollaborator(collaborator);
    
    res.status(200).json({
      status: 'success',
      message: 'Collaborator added successfully'
    });
  } catch (error) {
    logger.error('Error in addCollaborator:', error);
    next(error);
  }
};

/**
 * Remove a collaborator from a setlist
 */
exports.removeCollaborator = async (req, res, next) => {
  try {
    const { id, collaboratorId } = req.params;
    const { userId } = req.user;
    
    // Find the setlist
    const setlist = await Setlist.findOne({
      where: {
        id,
        userId // Only the owner can remove collaborators
      }
    });
    
    if (!setlist) {
      return next(new AppError('Setlist not found or you do not have permission to update it', 404));
    }
    
    // Check if collaborator exists
    const collaborator = await User.findByPk(collaboratorId);
    
    if (!collaborator) {
      return next(new AppError('User not found', 404));
    }
    
    // Remove collaborator
    await setlist.removeCollaborator(collaborator);
    
    res.status(200).json({
      status: 'success',
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    logger.error('Error in removeCollaborator:', error);
    next(error);
  }
};