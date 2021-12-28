express = require("express");
// Ignore authentification on backend for now
cors = require("cors")
// Import the GET, POST, etc. routes
routing = require("./routes/index");
// Import some meta data
require("dotenv").config();


// Setup server 
const server = express();
server.use(cors());

// Add routes
server.use("/", routing);

server.listen(process.env.PORT, () => {
    console.log("Server now listening on port " + process.env.PORT)
})
