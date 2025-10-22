'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StringEntries', {
      sha256_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_palindrome: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      unique_characters: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      word_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      character_frequency_map: {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StringEntries');
  }
};
