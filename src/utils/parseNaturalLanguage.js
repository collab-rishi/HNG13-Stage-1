const { Op, fn, col, where: sequelizeWhere } = require('sequelize');

function parseNaturalLanguageQuery(query) {
  const filters = {};
  const q = query.toLowerCase();

  // Support multiple phrases in one query
  if (q.includes("palindromic")) {
    filters.is_palindrome = true;
  }

  if (q.includes("single word") || q.includes("single-word")) {
    filters.word_count = 1;
  }

  if (q.includes("longer than")) {
    const match = q.match(/longer than (\d+)/);
    if (match) {
      filters.min_length = parseInt(match[1], 10) + 1;
    } else {
      throw new Error("Unable to parse 'longer than' value");
    }
  }

  if (q.includes("shorter than")) {
    const match = q.match(/shorter than (\d+)/);
    if (match) {
      filters.max_length = parseInt(match[1], 10) - 1;
    } else {
      throw new Error("Unable to parse 'shorter than' value");
    }
  }

  if (q.includes("containing the letter")) {
    const match = q.match(/containing the letter ([a-z])/);
    if (match) {
      filters.contains_character = match[1];
    } else {
      throw new Error("Unable to parse 'containing the letter'");
    }
  }

  if (q.includes("containing the character")) {
    const match = q.match(/containing the character ([a-z])/);
    if (match) {
      filters.contains_character = match[1];
    } else {
      throw new Error("Unable to parse 'containing the character'");
    }
  }

  if (q.includes("first vowel")) {
    filters.contains_character = 'a'; // Heuristic: assume 'a' as the first vowel
  }

  if (Object.keys(filters).length === 0) {
    throw new Error("Query not supported");
  }

  return filters;
}


function buildSequelizeWhere(filters) {
  const conditions = [];

 
  if (filters.is_palindrome !== undefined) {
    conditions.push({ is_palindrome: filters.is_palindrome });
  }

  if (filters.word_count !== undefined) {
    conditions.push({ word_count: filters.word_count });
  }

  if (filters.min_length !== undefined || filters.max_length !== undefined) {
    const lengthCond = {};
    if (filters.min_length !== undefined) {
      lengthCond[Op.gte] = filters.min_length;
    }
    if (filters.max_length !== undefined) {
      lengthCond[Op.lte] = filters.max_length;
    }
    conditions.push({ length: lengthCond });
  }

  
  if (filters.contains_character !== undefined) {
    const char = filters.contains_character.toLowerCase();
    conditions.push(
      sequelizeWhere(fn('LOWER', col('value')), {
        [Op.like]: `%${char}%`
      })
    );
  }

  
  if (conditions.length > 0) {
    return {
      [Op.and]: conditions
    };
  } else {
    return {};
  }
}

module.exports = { parseNaturalLanguageQuery, buildSequelizeWhere }