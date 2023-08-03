const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({}, {strict: false});


const Indexes = mongoose.model('indexes', leadSchema);

const query = Indexes.find();
query.maxTime(60000); // Tempo limite de 60 segundos para a operação find()

module.exports = mongoose.model('indexes', leadSchema);
