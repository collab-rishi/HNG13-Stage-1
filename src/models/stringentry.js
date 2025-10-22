'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StringEntry extends Model {
    static associate(models) {
      // define associations here if any
    }
  }
  StringEntry.init({
    sha256_hash: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_palindrome: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    unique_characters: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    word_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    character_frequency_map: {
      type: DataTypes.JSON, // use JSON if on MySQL; JSONB only for Postgres
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'StringEntry',
    tableName: 'string_entries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // since you don't need updated_at here
  });
  return StringEntry;
};
