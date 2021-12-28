require("dotenv").config();

/**
Module export for deployment 
*/
// module.exports = {
//     client: "mysql",
//     connection: {
//         user: process.env.DB_USER, 
//         password: process.env.DB_PASS, 
//         database: process.env.DB_NAME, 
//         socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
//       },
//     pool: { min: 1, max: 100 }
// }

/**
Module export for development (connect via public IP) 
*/
const dbSocketAddr = process.env.DB_HOST.split(":");
module.exports = {
    client: "mysql",
    connection: {
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME, 
        host: dbSocketAddr[0],
        port: dbSocketAddr[1],
      },
    pool: { min: 1, max: 100 }
}