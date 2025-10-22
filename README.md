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

> ⚠️ _Add your hosted URL here once deployed (e.g. Railway, Heroku, AWS)_

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/string-analyzer-api.git
cd string-analyzer-api
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


## 📚 Dependencies

This project uses:

Node.js and Express for the API server

Sequelize ORM for database interaction

dotenv for environment variables

crypto (built-in) for hashing

Run npm install to install all dependencies.