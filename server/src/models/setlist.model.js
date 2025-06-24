const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setlist = sequelize.define('Setlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,  // in minutes
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastEditedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  paranoid: true,  // Soft delete (deletedAt instead of removing the record)
  indexes: [
    {
      name: 'setlist_user_id_index',
      fields: ['userId']
    },
    {
      name: 'setlist_band_id_index',
      fields: ['bandId']
    },
    {
      name: 'setlist_date_index',
      fields: ['date']
    }
  ]
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = (models) => {
  const { User, Band, Song, SetlistSong, SetlistVersion } = models;
  
  // A setlist belongs to a user (creator)
  Setlist.belongsTo(User, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    as: 'creator'
  });
  
  // A setlist can belong to a band
  Setlist.belongsTo(Band, {
    foreignKey: {
      name: 'bandId',
      allowNull: true
    }
  });
  
  // A setlist has many songs through SetlistSong join table
  Setlist.belongsToMany(Song, {
    through: SetlistSong,
    foreignKey: 'setlistId',
    as: 'songs'
  });
  
  // A setlist has many versions for history tracking
  Setlist.hasMany(SetlistVersion, {
    foreignKey: 'setlistId',
    as: 'versions'
  });
  
  // A setlist can have many collaborators (users)
  Setlist.belongsToMany(User, {
    through: 'SetlistCollaborator',
    foreignKey: 'setlistId',
    as: 'collaborators'
  });
};

module.exports = {
  Setlist,
  setupAssociations
};