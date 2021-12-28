import "./Sensors.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PageList from "../../components/PageList/PageList";

// Define filter- & order-by-conditions that can be set
const baseConditions: { [key: string]: string | null } = {
  reportF: null,
  statusF: null,
  reportO: null,
  statusO: null,
};

// Conversion from number (index) to month
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/*
Handle sensor overview
*/
const Sensors: React.FC = (props) => {
  const { currentUser } = useAuth();

  // Page management
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reportFilterVals, setReportFilterVals] = useState([]);
  const [statusFilterVals, setStatusFilterVals] = useState([]);
  const [sensors, setSensors] = useState([]);

  // Filter (Condition) management
  const [conditions, setConditions] = useState(baseConditions);
  const [openReport, setOpenReport] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  // Error handling
  const [error, setError] = useState("")

  const orderModes = [null, "ASC", "DESC"];
  let pages:number[] = new Array(totalPages).fill(0).map((v, i) => i);

  // Call to fill table with a (possibly filtered) sensor list
  const sensorsAPICall = async (conditionsCall: Boolean) => {
    try {
      const response = await fetch(
        `http://localhost:3000/sensors?owner=${
          currentUser.email.split("@")[0]
        }&page=${pageNumber}${conditionsToPathParams()}`,
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
      let { sensors, pages } = results;
      setSensors(sensors);
      setTotalPages(pages);
      if (conditionsCall) setPageNumber(0);
    } catch (err:any) {
      setError(err.message)
    }
  };

  // SensorAPICall tailored to change of page
  useEffect(() => {
    sensorsAPICall(false);
  }, [pageNumber]);

  // SensorAPICall tailored to change of conditions
  useEffect(() => {
    sensorsAPICall(true);
  }, [conditions]);

  // Call to populate filter options (only call once)
  useEffect(() => {
    fetch(
      `http://localhost:3000/sensorsColumnVals?owner=${
        currentUser.email.split("@")[0]
      }&reportC=true&statusC=true`,
      {
        method: "GET",
        headers: {
          "access-control-allow-origin": "*",
        },
      }
    )
      .then((response) => response.json())
      .then(({ reportC, statusC }) => {
        let formatedReport = reportC.map((val: any) => val.dqr_name).sort()
        setReportFilterVals(formatedReport);
        setStatusFilterVals(statusC.map((val: any) => val.dqm_status.toString()));
      });
  }, []);

  // Convert SQL-format of status (numbers) to Front-End-format (colors)
  const statusNumToColor = (status: string) => {
    switch (status) {
      case "0":
        return "Red";
      case "1":
        return "Amber";
      case "2":
        return "Green";
    }
  };

  // Make conditions set in state ready to be send via URL
  const conditionsToPathParams = () => {
    let paramCollector = "";
    Object.keys(conditions).map((key) => {
      return conditions[key]
        ? (paramCollector += `&${key}=${conditions[key]}`)
        : "";
    });

    return paramCollector;
  };

  // Apply filter-rules (e.g. never set 2 filters in 1 column) and update conditions
  const handleFilter = (passedKey: string, passedValue: string) => {
    let blockedOrder = passedKey === "reportF" ? "reportO" : "statusO";
    let value = conditions[passedKey] ? null : passedValue;

    setConditions((conditions) => {
      return { ...conditions, [blockedOrder]: null, [passedKey]: value };
    });
  };

  // Apply filter-rules (e.g. never set 2 order clauses) and update conditions
  const handleOrder = (passedKey: string, passedValue: string | null) => {
    let [blockedFilter, blockedOrder] =
      passedKey === "reportO" ? ["reportF", "statusO"] : ["statusF", "reportO"];

    setConditions((conditions) => {
      return {
        ...conditions,
        [blockedFilter]: null,
        [blockedOrder]: null,
        [passedKey]: passedValue,
      };
    });
  };

  // Iterate through possible order-by-values (-> null -> DESC -> ASC -> null ...)
  const orderIterator = (column: string) => {
    let nextOrderModeIdx = (orderModes.indexOf(conditions[column]) + 1) % 3;
    return orderModes[nextOrderModeIdx];
  };

  return (
    <div className="wrapper">
      <table className="content-table all">
        {/* ----- HEADER CONTENT OF TABLE ----- */}
        <thead>
          <tr>
            <th style={{ width: "4vw" }}>ID</th>
            <th style={{ width: "40vw" }}>Sensor</th>
            {/* ----- REPORT FILTER ----- */}
            <th className="header-report" style={{ width: "12vw" }}>
              Report{" "}
              <FaFilter
                style={{ paddingLeft: "0.3rem", paddingTop: "0.3rem" }}
                onClick={(e) => setOpenReport(!openReport)}
              />
              {openReport && (
                <div className="dropdown">
                  <button
                    className="order-btn"
                    onClick={() =>
                      handleOrder("reportO", orderIterator("reportO"))
                    }
                  >
                    <span>Order</span>
                    <span
                      className={`arrow-${
                        conditions.reportO === null ? "none" : conditions.reportO
                      }`}
                    ></span>
                  </button>
                  <ul>
                    {reportFilterVals &&
                      reportFilterVals.map((val: string) => {
                        return (
                          <li
                            className={`listelems ${
                              conditions.reportF === val ? "selected" : ""
                            }`}
                            onClick={() => handleFilter("reportF", val)}
                          >
                            {val}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </th>
            {/* ----- STATUS FILTER ----- */}
            <th className="header-status" style={{ width: "7vw" }}>
              Status{" "}
              <FaFilter
                style={{ paddingLeft: "0.3rem", paddingTop: "0.3rem" }}
                onClick={() => setOpenStatus(!openStatus)}
              />
              {openStatus && (
                <div className="dropdown">
                  <button
                    className="order-btn"
                    onClick={() =>
                      handleOrder("statusO", orderIterator("statusO"))
                    }
                  >
                    <span>Order</span>
                    <span
                      className={`arrow-${
                        conditions.statusO === null ? "none" : conditions.statusO
                      }`}
                    ></span>
                  </button>
                  <ul>
                    {statusFilterVals &&
                      statusFilterVals.map((val: string) => {
                        return (
                          <li
                            className={`listelems ${
                              conditions.statusF === val ? "selected" : ""
                            }`}
                            onClick={() => handleFilter("statusF", val)}
                          >
                            {statusNumToColor(val)}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </th>
            <th style={{ width: "25vw" }}>Comment</th>
          </tr>
        </thead>
        {/* ----- MAIN CONTENT OF TABLE ----- */}
        {sensors ? (
          <tbody>
            {sensors.map((sensor: any) => {
              return (
                <tr>
                  <td>{sensor.dqs_id}</td>
                  <td className="sensor-field">
                    <Link
                      to={{ pathname: `SensorDetails/${sensor.dqs_id}` }}
                      className={"sensor-link"}
                    >
                      {sensor.dqs_name}
                    </Link>
                  </td>
                  <td>{sensor.dqr_name}</td>
                  <td>
                    <span
                      className={`dot ${statusNumToColor(
                        sensor.dqm_status.toString()
                      )}`}
                    ></span>
                  </td>
                  <td>{sensor.dqm_comment}</td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <div></div>
        )}
      </table>
      {/* ----- BOTTOM SECTION OF PAGE ----- */}
      <PageList pages={pages} setPageNumber={setPageNumber} pageNumber={pageNumber} />
    </div>
  );
};

export default Sensors;
