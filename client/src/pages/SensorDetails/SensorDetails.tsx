import "./SensorDetails.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Important: Define keys as strings to be able to index into sensor objects with strings
const baseSensor: { [key: string]: string | number } = {
  id: "",
  name: "",
  type: "",
  owner: "",
  description: "",
  measurement: "",
  thresholdAmber: 0,
  thresholdRed: 0,
};

// Define table header properties
const tableHeaders = [
  { name: "ID", width: 5 },
  { name: "Name", width: 40 },
  { name: "Type", width: 10 },
  { name: "Owner", width: 13 },
  { name: "TH Amber", width: 10 },
  { name: "TH Red", width: 10 },
];

/*
Display sensor details
*/
const SensorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [sensor, setSensor] = useState(baseSensor);

  // Error handling
  const [error, setError] = useState("")

  /* 
  Only called when mounting component
  Populates page with sensor data
  */
  const reportAPICall = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/sensors/${id}?owner=${currentUser.email.split("@")[0]}`,
        {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
          },
        }
      );
      let { results, message } = await response.json();
      if (response.status !== 200) {
        setError(message);
        return;
      };
      setSensor({
        id: results.dqs_id,
        name: results.dqs_name,
        type: results.dqs_type,
        owner: results.dqs_owner,
        description: results.dqs_description,
        measurement: results.dqs_measurement,
        thresholdAmber: results.dqs_status_amber,
        thresholdRed: results.dqs_status_red,
      }
      );
    } catch (err: any) {
      setError(err.message)
    }
  };

  useEffect(() => {
    reportAPICall()
  }, [])

  return (
    <div className="wrapper">
      {/* ----- MAIN TABLE ----- */}
      <table className="content-table-details">
        <thead>
          <tr className="header-row">
            {tableHeaders.map((header) => {
              return (
                <th style={{ width: `${header.width}vw` }}>{header.name}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(sensor)
              .filter((key) => key !== "measurement" && key !== "description")
              .map((rawKey) => {
                return <td>{sensor[rawKey]}</td>;
              })}
          </tr>
        </tbody>
      </table>

      {/* ----- PROCESS TABLE ----- */}
      <table className="content-table-details process">
        <thead>
          <tr>
            <th>Process</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{sensor.description}</td>
          </tr>
        </tbody>
      </table>

      {/* ----- MEASUREMENT TABLE ----- */}
      <table className="content-table-details measurement">
        <thead>
          <tr>
            <th>Measurement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{sensor.measurement}</td>
          </tr>
        </tbody>
      </table>
      <Link to={"/Sensors"} className="back-link">
        Back
      </Link>
    </div>
  );
};

export default SensorDetails;
