/// ShipShape  >  data  >  maps
/// 	Handle accesses to the maps database.

const Datastore = require("nedb");
const fs = require("fs");
const path = require("path");

// Load the database.
let db = new Datastore({ filename: path.join(__dirname, "maps.db"), autoload: true });

// Add the maps defined in the 'standard-maps.json' file.
db.count({ _id: "0000-0000" }, (err, count) => {
    if (err) {
        console.error(err);
        return;
    }
    if (count == 0) {
        fs.readFile(path.join(__dirname, "standard-maps.json"), (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let maps = JSON.parse(data);
            for (let [ mapID, mapData ] of Object.entries(maps)) {
                db.insert({ _id: mapID, ...mapData }, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }
        });
    }
});

module.exports = db;
