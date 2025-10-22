// utils/analyzeString.js

const crypto = require('crypto');

function analyzeString(value) {
  const length = value.length;
  const is_palindrome = value.toLowerCase() === value.toLowerCase().split('').reverse().join('');
  const unique_characters = new Set(value).size;
  const word_count = value.trim().split(/\s+/).length;
  const sha256_hash = crypto.createHash('sha256').update(value, 'utf8').digest('hex');

  const character_frequency_map = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    id: sha256_hash,
    value,
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map,
     created_at: new Date().toISOString(),
  };
}

module.exports = analyzeString;
