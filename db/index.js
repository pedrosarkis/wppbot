const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

const connect = async () => {
  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(URI, options);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('Connected to MongoDB'));
    
    // Definir um tempo limite para operações find() no nível do modelo
   

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connect;
