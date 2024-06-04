const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./app/routes/auth.routes');
const path = require('path');

const app = express();

// MongoDB Connection
const dbURI = "mongodb+srv://tsnalauralailla:PyReSmwOpwIR0YMG@authservicemilikitadb.cnhjfae.mongodb.net/?retryWrites=true&w=majority&appName=AuthServiceMiliKitaDB";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database!'))
    .catch((error) => console.error('Connection failed! Reason:', error));

// Middleware
app.use(express.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Static folder
//app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
