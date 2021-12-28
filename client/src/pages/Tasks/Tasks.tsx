import "./Tasks.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PageList from "../../components/PageList/PageList";
import SideMenu from "../../components/SideMenu/SideMenu";
import ResultModal from "../../components/Modals/ResultModal";

// Define filter- & order-by-conditions that can be set
const baseConditions: { [key: string]: string | null } = {
  reportF: null,
  duedateF: null,
  reportO: null,
  duedateO: null,
};

/*
Handle tasks overview
*/
const Tasks: React.FC = (props) => {
  const { currentUser } = useAuth();

  // Page management
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reportFilterVals, setReportFilterVals] = useState([]);
  const [duedateFilterVals, setduedateFilterVals] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Filter (Condition) management
  const [conditions, setConditions] = useState(baseConditions);
  const [openReport, setOpenReport] = useState(false);
  const [openDuedate, setOpenDuedate] = useState(false);

  // Handle file upload
  const [refetch, setRefetch] = useState(false);

  // Handle Modal
  const [resultModalOpen, setResultModalOpen] = useState(false);

  // Handle errors
  const [error, setError] = useState("")

  const orderModes = [null, "ASC", "DESC"];
  let pages: number[] = new Array(totalPages).fill(0).map((v, i) => i);

  // Call to fill table with a (possibly filtered) sensor list
  const tasksAPICall = async (conditionsCall: Boolean) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks?owner=${
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
      let { tasks, pages } = results;
      setTasks(tasks)
      setTotalPages(pages);
      if (conditionsCall) setPageNumber(0);
    } catch (err:any) {
      setError(err.message)
    }
  };

  // SensorAPICall tailored to change of page
  useEffect(() => {
    tasksAPICall(false);
  }, [pageNumber, refetch]);

  // SensorAPICall tailored to change of conditions
  useEffect(() => {
    tasksAPICall(true);
  }, [conditions]);

  // Call to populate filter options (only call once)
  useEffect(() => {
    fetch(
      `http://localhost:3000/tasksColumnVals?owner=${
        currentUser.email.split("@")[0]
      }&reportC=true&duedateC=true`,
      {
        method: "GET",
        headers: {
          "access-control-allow-origin": "*",
        },
      }
    )
      .then((response) => response.json())
      .then(({ reportC, duedateC }) => {
        let formatedReport = reportC.map((val: any) => val.dqr_name).sort();
        setReportFilterVals(formatedReport);

        let formatedduedate = duedateC
          .map((val: any) => val.dqm_timestamp)
          .sort();
        setduedateFilterVals(formatedduedate.map((val: any) => val.toString()));
      });
  }, []);

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
    let blockedOrder = passedKey === "reportF" ? "reportO" : "duedateO";
    let value = conditions[passedKey] ? null : passedValue;

    setConditions((conditions) => {
      return { ...conditions, [blockedOrder]: null, [passedKey]: value };
    });
  };

  // Apply filter-rules (e.g. never set 2 order clauses) and update conditions
  const handleOrder = (passedKey: string, passedValue: string | null) => {
    let [blockedFilter, blockedOrder] =
      passedKey === "reportO"
        ? ["reportF", "duedateO"]
        : ["duedateF", "reportO"];

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
      <SideMenu setOpenModal={setResultModalOpen} buttons={"result"} />
      <table className="content-table all">
        {/* ----- HEADER CONTENT OF TABLE ----- */}
        <thead>
          <tr>
            <th style={{ width: "4vw" }}>ID</th>
            <th style={{ width: "40vw" }}>Sensor</th>
            {/* ----- REPORT FILTER ----- */}
            <th className="header-report" style={{ width: "17vw" }}>
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
            {/* ----- duedate FILTER ----- */}
            <th className="header-duedate" style={{ width: "15vw" }}>
              Due By{" "}
              <FaFilter
                style={{ paddingLeft: "0.3rem", paddingTop: "0.3rem" }}
                onClick={() => setOpenDuedate(!openDuedate)}
              />
              {openDuedate && (
                <div className="dropdown">
                  <button
                    className="order-btn"
                    onClick={() =>
                      handleOrder("duedateO", orderIterator("duedateO"))
                    }
                  >
                    <span>Order</span>
                    <span
                      className={`arrow-${
                        conditions.duedateO === null
                          ? "none"
                          : conditions.duedateO
                      }`}
                    ></span>
                  </button>
                  <ul className="vals">
                    {duedateFilterVals &&
                      duedateFilterVals.map((val: string) => {
                        return (
                          <li
                            className={`listelems ${
                              conditions.duedateF === val ? "selected" : ""
                            }`}
                            onClick={() => handleFilter("duedateF", val)}
                          >
                            {val}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </th>
            <th style={{ width: "12vw" }}>Comment</th>
          </tr>
        </thead>
        {/* ----- MAIN CONTENT OF TABLE ----- */}
        {tasks ? (
          <tbody>
            {tasks.map((task: any) => {
              return (
                <tr>
                  <td>{task.dqs_id}</td>
                  <td className="sensor-field">
                    <Link
                      to={{ pathname: `SensorDetails/${task.dqs_id}` }}
                      className={"sensor-link"}
                    >
                      {task.dqs_name}
                    </Link>
                  </td>
                  <td>{task.dqr_name}</td>
                  <td>{task.dqm_timestamp}</td>
                  <td>{task.dqm_comment}</td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <div></div>
        )}
      </table>
      {resultModalOpen && (
        <ResultModal setRefetch={setRefetch} setOpenModal={setResultModalOpen} />
      )}
      {/* ----- BOTTOM SECTION OF PAGE ----- */}
      <PageList
        pages={pages}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    </div>
  );
};

export default Tasks;
