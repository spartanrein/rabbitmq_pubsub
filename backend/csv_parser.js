const csv = require('csv-parser');
const fs = require('fs');


module.exports = async function csv_parser(csv_path) {
    let quotes = [];
    await fs.createReadStream(csv_path)
        .pipe(csv())
        .on('data', (row) => {
            quotes.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
    return quotes;

};
