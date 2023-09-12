const mongoose = require('mongoose');

const connectBaseDate = mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@bancodedadosvitor-vx.6awlvqi.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log(`Conectado ao banco de dados`))
    .catch(error => console.log(`Error: ${error}`))

module.exports = { connectBaseDate };