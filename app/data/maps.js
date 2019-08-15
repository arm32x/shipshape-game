/// ShipShape  >  controllers  >  maps
/// 	Handle accesses to the maps JSON data.

const fs = require('fs');

module.exports = JSON.parse(fs.readFileSync('app/data/maps.json'));
