// Import the parse function from the csv-parse library and the fs (File System) module
const { parse } = require("csv-parse");
const fs = require("fs");

// Initialize an array to store habitable planets
const habitablePlanets = [];

// Define a function to determine if a planet is habitable based on certain criteria
function isHabitablePlanet(planet) {
  // Check if the planet's disposition is confirmed and it falls within certain solar irradiance (koi_insol)
  // and planet radius (koi_prad) ranges that are considered habitable
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// Create a readable stream from the CSV file
fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#", // Treat lines starting with '#' as comments and ignore them
      columns: true, // Automatically parse the first line as column names
    })
  )
  .on("data", (data) => {
    // For each row of data, check if the planet meets the habitability criteria
    if (isHabitablePlanet(data)) {
      // If the planet is habitable, add it to the habitablePlanets array
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    // Log any errors that occur during parsing
    console.log(err);
  })
  .on("end", () => {
    // Once the file is fully read and processed, log the names of habitable planets
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );
    // Log the total number of habitable planets found
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
