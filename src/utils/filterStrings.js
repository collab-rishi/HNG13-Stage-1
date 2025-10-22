

function filterStrings(strings, query) {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = query;

  const filters_applied = {};

  let filtered = [...strings];

 
  if (is_palindrome !== undefined) {
    const boolVal = is_palindrome === 'true';
    filters_applied.is_palindrome = boolVal;
    filtered = filtered.filter(s => s.is_palindrome === boolVal);
  }

 
  if (min_length !== undefined) {
    const min = parseInt(min_length, 10);
    if (!isNaN(min)) {
      filters_applied.min_length = min;
      filtered = filtered.filter(s => s.length >= min);
    }
  }

  
  if (max_length !== undefined) {
    const max = parseInt(max_length, 10);
    if (!isNaN(max)) {
      filters_applied.max_length = max;
      filtered = filtered.filter(s => s.length <= max);
    }
  }

 
  if (word_count !== undefined) {
    const wc = parseInt(word_count, 10);
    if (!isNaN(wc)) {
      filters_applied.word_count = wc;
      filtered = filtered.filter(s => s.word_count === wc);
    }
  }

  
  if (contains_character !== undefined) {
    filters_applied.contains_character = contains_character;
    filtered = filtered.filter(s => s.value.includes(contains_character));
  }

  return { filtered, filters_applied };
}

module.exports = filterStrings;
