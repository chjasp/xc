require("dotenv").config();
const mysql = require("mysql");

/**
 Set up connection to Google Cloud SQL via public IP
 */
const dbSocketAddr = process.env.DB_HOST.split(":");
let connection = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: dbSocketAddr[0],
  port: dbSocketAddr[1],
});

/**
Script to insert 100 sensors;
 */
const insertSensors = () => {
  for (let id = 0; id < 100; id++) {
    let owner_array = ["dqr357", "dqr356"];
    let owner_int = Math.round(Math.random());
    let owner = owner_array[owner_int];

    let dqs_name = "lorem ipsum-123-aspernatur aut";
    let dqs_dimensions = "dim";
    let dqs_type = "type";
    let dqs_risk_type = "rtyp";
    let dqs_layer = "l";
    let dqs_owner_group_division = "ogd";
    let dqs_owner_division_head = "odh";
    let dqs_owner = owner;
    let dqs_delivery_time = "dt";
    let dqs_delivery = "d";
    let dqs_description = `${id} - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
erat, sed diam voluptua. At vero eos et accusam et justo duo
dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
amet.`;
    let dqs_measurement = `${id} - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
erat, sed diam voluptua. At vero eos et accusam et justo duo
dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
amet.`;
    let dqs_status_red = 0.33;
    let dqs_status_amber = 0.66;
    let dqs_valid_from = "1/1/2019";
    let dqs_valid_to = "1/1/2029";

    connection.query(
      `INSERT INTO sensors(
        dqs_id,
        dqs_name,
        dqs_dimensions,
         dqs_type,
         dqs_risk_type,
         dqs_layer,
         dqs_owner_group_division,
         dqs_owner_division_head,
         dqs_owner,
         dqs_delivery_time,
         dqs_delivery,
         dqs_description,
         dqs_measurement,
         dqs_status_red,
         dqs_status_amber,
         dqs_valid_from,
         dqs_valid_to) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,str_to_date(?,'%d/%m/%Y'), str_to_date(?,'%d/%m/%Y'))`,
      [
        id,
        dqs_name,
        dqs_dimensions,
        dqs_type,
        dqs_risk_type,
        dqs_layer,
        dqs_owner_group_division,
        dqs_owner_division_head,
        dqs_owner,
        dqs_delivery_time,
        dqs_delivery,
        dqs_description,
        dqs_measurement,
        dqs_status_red,
        dqs_status_amber,
        dqs_valid_from,
        dqs_valid_to],
      (error, results) => {
        console.log(error)
        console.log(results)
      }
    );
  }
};

/**
Report and result data can be inserted via the front-end ("Upload Report" / "Upload result" function)
 */

