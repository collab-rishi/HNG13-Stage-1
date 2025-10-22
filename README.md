# 🧠 String Analyzer API

A RESTful API built with Node.js to analyze and store properties of strings, with filtering (including natural language queries), retrieval, and deletion capabilities.

---

## 📦 Features

- Analyze strings and store detailed properties:
  - Length
  - Palindrome check
  - Unique characters count
  - Word count
  - SHA-256 hash
  - Character frequency map
- Retrieve single or multiple strings
- Filter using query parameters or natural language
- Delete strings
- Detailed error handling and strict validation

---

## 🚀 Live URL

> [Live Link](https://hng13-stage-1-production-42ff.up.railway.app/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/collab-rishi/HNG13-Stage-1
cd string-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 🛠 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DATABASE_URL=postgres://username:password@host:port/database
```

### 3. Run Locally

#### Development (with auto-restart)
```bash
npm run dev
```

#### Production
```bash
npm start
```
---
## 📖 API Documentation



## Endpoints

### 1. GET /

- **Description:** Check if the API is running.
- **Response:**
```json
  {
    "message": "String Analyzer API is running."
  }
```

### 2. POST /strings
Description: Add a new string and analyze its properties.

Request Body:

```json
{
  "value": "your string here"
}
```
Responses:

201 Created

```json

{
  "id": "<sha256_hash>",
  "value": "your string here",
  "properties": {
    "length": 12,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "<sha256_hash>",
    "character_frequency_map": { "a": 2, "b": 1 }
  },
  "created_at": "2023-01-01T12:00:00Z"
}
```
400 Bad Request if "value" field is missing.

422 Unprocessable Entity if "value" is not a string.

409 Conflict if the string already exists.

500 Internal Server Error for server errors.


### 3. GET /strings/filter-by-natural-language?query=your+query
Description: Retrieve strings filtered using a natural language query.

Query Parameter:

query (string, required) — Natural language filter, e.g. "length > 5 and is palindrome"

Responses:

200 OK

```json

{
  "data": [
    {
      "id": "<sha256_hash>",
      "value": "example",
      "properties": { 
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "<sha256_hash>",
        "character_frequency_map": { "e": 2, "x": 1, "a": 1, "m": 1 }
      },
      "created_at": "2023-01-01T12:00:00Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "length > 5 and is palindrome",
    "parsed_filters": {
      "min_length": 6,
      "is_palindrome": true
    }
  }
}
```
400 Bad Request if query parameter is missing or invalid.

422 Unprocessable Entity if filters conflict.

500 Internal Server Error for server errors.


### 4. GET /strings/:string_value
Description: Retrieve analysis data for a specific string.

URL Parameter:

string_value (string) — The exact string (URL encoded).

Responses:

200 OK

```json

{
  "id": "<sha256_hash>",
  "value": "string_value",
  "properties": {
    "length": 5,
    "is_palindrome": false,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "<sha256_hash>",
    "character_frequency_map": { "h": 1, "e": 1, "l": 2, "o": 1 }
  },
  "created_at": "2023-01-01T12:00:00Z"
}
```
404 Not Found if string does not exist.

500 Internal Server Error for server errors.


### 5. GET /strings
Description: Retrieve all stored strings with optional query filtering.

Query Parameters: (Optional) Various filters supported, e.g., length_gt=5, is_palindrome=true.

Responses:

200 OK

```json
{
  "data": [
    {
      "id": "<sha256_hash>",
      "value": "example",
      "properties": { },
      "created_at": "2023-01-01T12:00:00Z"
    },
    
  ],
  "count": 10,
  "filters_applied": {  }
}
```
500 Internal Server Error for server errors.

### 6. DELETE /strings/:string_value
Description: Delete a stored string by its value.

URL Parameter:

string_value (string) — The exact string (URL encoded).

Responses:

204 No Content on successful deletion.

404 Not Found if string does not exist.

500 Internal Server Error for server errors.

Notes
All dates/timestamps are ISO 8601 strings.

String values in URL parameters should be URL-encoded.

Errors are returned as JSON objects with an "error" key describing the issue.






















## 📚 Dependencies

This project uses:

Node.js and Express for the API server

Sequelize ORM for database interaction

dotenv for environment variables

crypto (built-in) for hashing

Run npm install to install all dependencies.