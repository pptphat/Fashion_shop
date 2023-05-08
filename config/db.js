const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const urlConnect = process.env.DB;

async function connect() {
    try {
        await mongoose.connect(
            urlConnect,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('Connnect successfully!!!');
    } catch (error) {
        console.log('Connnect failure!!!');
    }
}

// const connect = async () => {
//     const conn = mongoose.createConnection('mongodb+srv://20521740:sXbC80IivBT29nDS@twitterdb.hrxvzr3.mongodb.net/f8_education_dev', options);
// }

module.exports = { connect };
