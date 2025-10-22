const express = require('express');
 const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();
const { StringEntry } = require('./models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { ServerConfig } = require('./config');
const cors = require("cors");
const { analyzeString, filterStrings } = require('./utils');

const { parseNaturalLanguageQuery, buildSequelizeWhere } = require('./utils/parseNaturalLanguage');

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

const decodeURIComponentSafe = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return str; 
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'String Analyzer API is running.' });
});



app.post('/strings', async (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: '"value" field is required.' });
  }
  if (typeof value !== 'string') {
    return res.status(422).json({ error: '"value" must be a string.' });
  }

  const analyzed = analyzeString(value);
  const { id } = analyzed;

  try {
    const existing = await StringEntry.findByPk(id);
    if (existing) {
      return res.status(409).json({ error: 'String already exists.' });
    }

    const newString = await StringEntry.create(analyzed);

    return res.status(201).json({
      id: newString.sha256_hash,
      value: newString.value,
      properties: {
        length: newString.length,
        is_palindrome: newString.is_palindrome,
        unique_characters: newString.unique_characters,
        word_count: newString.word_count,
        sha256_hash: newString.sha256_hash,
        character_frequency_map: newString.character_frequency_map,
      },
        created_at: newString.createdAt,
    });
  } catch (err) {
    console.error(' Error inserting string:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


app.get('/strings/filter-by-natural-language', async (req, res) => {
  
  const { query } = req.query;
  

  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: "'query' parameter is required and must be a string." });
  }

  let filters;
  try {
    filters = parseNaturalLanguageQuery(query);
     
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  
  if (
    filters.min_length !== undefined &&
    filters.max_length !== undefined &&
    filters.min_length > filters.max_length
  ) {
    return res.status(422).json({ error: "Conflicting filters: min_length is greater than max_length." });
  }
 


  try {
    const where = buildSequelizeWhere(filters);

    const results = await StringEntry.findAll({ where });
    console.log("Parsed filters: " + filters);

    const data = results.map(item => ({
      id: item.id,
      value: item.value,
      properties: {
        length: item.length,
        is_palindrome: item.is_palindrome,
        unique_characters: item.unique_characters,
        word_count: item.word_count,
        sha256_hash: item.sha256_hash,
        character_frequency_map: item.character_frequency_map,
      },
      created_at: item.created_at.toISOString(),
    }));

    res.status(200).json({
      data,
      count: data.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      }
    });
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/strings/:string_value', async (req, res) => {
  
  const rawValue = decodeURIComponentSafe(req.params.string_value);

  const id = crypto.createHash('sha256').update(rawValue, 'utf8').digest('hex');

  try {
    const stringEntry = await StringEntry.findByPk(id);

    if (!stringEntry) {
      return res.status(404).json({ error: 'String not found.' });
    }

    return res.status(200).json({
      id: stringEntry.sha256_hash,
      value: stringEntry.value,
      properties: {
        length: stringEntry.length,
        is_palindrome: stringEntry.is_palindrome,
        unique_characters: stringEntry.unique_characters,
        word_count: stringEntry.word_count,
        sha256_hash: stringEntry.sha256_hash,
        character_frequency_map: stringEntry.character_frequency_map
      },
      created_at: stringEntry.created_at
    });

  } catch (error) {
    console.error(' Error fetching string:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});




app.get('/strings', async (req, res) => {
  
  try {
    const allStrings = await StringEntry.findAll(); 

    const { filtered, filters_applied } = filterStrings(allStrings, req.query);

    const formatted = filtered.map(s => ({
      id: s.sha256_hash,
      value: s.value,
      properties: {
        length: s.length,
        is_palindrome: s.is_palindrome,
        unique_characters: s.unique_characters,
        word_count: s.word_count,
        sha256_hash: s.sha256_hash,
        character_frequency_map: s.character_frequency_map,
      },
      created_at: s.created_at.toISOString(), 
    }));

    res.status(200).json({
      data: formatted,
      count: formatted.length,
      filters_applied,
    });
  } catch (error) {
    console.error(' Error fetching strings:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});










app.delete('/strings/:string_value', async (req, res) => {
    try {
  const rawValue = decodeURIComponentSafe(req.params.string_value);

  const id = crypto.createHash('sha256').update(rawValue, 'utf8').digest('hex');

   
    const found = await StringEntry.findByPk(id);
    if (!found) {
      return res.status(404).json({ error: 'String not found.' });
    }

   
    await StringEntry.destroy({ where: { sha256_hash: id } });

    return res.status(204).send(); 
  } catch (err) {
    console.error(' Error deleting string:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});



app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
