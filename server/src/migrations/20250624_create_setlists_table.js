'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Setlists', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      venue: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isArchived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      lastEditedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bandId: {
        type: Sequelize.UUID,
        references: {
          model: 'Bands',
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('Setlists', ['userId'], {
      name: 'setlist_user_id_index'
    });
    
    await queryInterface.addIndex('Setlists', ['bandId'], {
      name: 'setlist_band_id_index'
    });
    
    await queryInterface.addIndex('Setlists', ['date'], {
      name: 'setlist_date_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Setlists');
  }
};