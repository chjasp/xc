import "./Reports.css";
import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import PageList from "../../components/PageList/PageList";
import SideMenu from "../../components/SideMenu/SideMenu";
import ReportModal from "../../components/Modals/ReportModal";

// Define filter- & order-by-conditions that can be set
const baseConditions: { [key: string]: string | null } = {
  reportF: null,
  reportO: null,
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
Handle reports
*/
const Reports: React.FC = (props) => {
  // Page management
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reportFilterVals, setReportFilterVals] = useState([]);
  const [reports, setReports] = useState([]);

  // Filter (Condition) management
  const [conditions, setConditions] = useState(baseConditions);
  const [openReport, setOpenReport] = useState(false);

  // Handle file upload
  const [refetch, setRefetch] = useState(false);

  // Handle Modal
  const [modalOpen, setModalOpen] = useState(false);

  // Handle errors
  const [error, setError] = useState("")

  const orderModes = [null, "ASC", "DESC"];
  let pages: number[] = new Array(totalPages).fill(0).map((v, i) => i);

  // Call to fill table with a (possibly filtered) sensor list
  const reportsAPICall = async (conditionsCall: Boolean) => {
    try {
      const response = await fetch(
        `http://localhost:3000/reports?page=${pageNumber}${conditionsToPathParams()}`,
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
      let { reports, pages } = results;
      setReports(reports);
      setTotalPages(pages);
      if (conditionsCall) setPageNumber(0);
    } catch (err:any) {
      setError(err.message)
    }
  };

  // SensorAPICall tailored to change of page
  useEffect(() => {
    reportsAPICall(false);
  }, [pageNumber, refetch]);

  // SensorAPICall tailored to change of conditions
  useEffect(() => {
    reportsAPICall(true);
  }, [conditions]);

  // Call to populate filter options (only call once)
  useEffect(() => {
    fetch("http://localhost:3000/reportsColumnVals", {
      method: "GET",
      headers: {
        "access-control-allow-origin": "*",
      },
    })
      .then((response) => response.json())
      .then(({ reportC }) => {
        let formatedReport = reportC.map((val: any) => val.dqr_date).sort();
        setReportFilterVals(formatedReport);
      });
  }, [refetch]);

  const dateToString = (date: string) => {
    let formatedDate =
      months[Number(date.split("-")[1])] + " " + date.split("-")[0];
    return formatedDate;
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

  // Apply filter-order-rules (e.g. never set 2 filters in 1 column) and update conditions
  const handleFilterOrder = (passedKey: string, passedValue: string | null) => {
    let blockedMode = passedKey === "reportF" ? "reportO" : "reportF";
    let value = passedKey === "reportF" ? (conditions[passedKey] ? null : passedValue) : passedValue;

    setConditions(() => {
      return { [blockedMode]: null, [passedKey]: value };
    });
  };

  // Iterate through possible order-by-values (-> null -> DESC -> ASC -> null ...)
  const orderIterator = (column: string) => {
    let nextOrderModeIdx = (orderModes.indexOf(conditions[column]) + 1) % 3;
    return orderModes[nextOrderModeIdx];
  };

  return (
    <div className="wrapper">
      <SideMenu setOpenModal={setModalOpen} buttons={"report"} />
      <table className="content-table all">
        {/* ----- HEADER CONTENT OF TABLE ----- */}
        <thead>
          <tr>
            <th style={{ width: "4vw" }}>ID</th>
            <th style={{ width: "40vw" }}>Name</th>
            {/* ----- MONTH FILTER ----- */}
            <th className="header-report" style={{ width: "22vw" }}>
              Month{" "}
              <FaFilter
                style={{ paddingLeft: "0.3rem", paddingTop: "0.3rem" }}
                onClick={(e) => setOpenReport(!openReport)}
              />
              {openReport && (
                <div className="dropdown">
                  <button
                    className="order-btn"
                    onClick={() =>
                      handleFilterOrder("reportO", orderIterator("reportO"))
                    }
                  >
                    <span>Order</span>
                    <span
                      className={`arrow-${conditions.reportO === null
                          ? "none"
                          : conditions.reportO
                        }`}
                    ></span>
                  </button>
                  <ul>
                    {reportFilterVals &&
                      reportFilterVals.map((val: string) => {
                        return (
                          <li
                            className={`listelems ${conditions.reportF === val ? "selected" : ""
                              }`}
                            onClick={() => handleFilterOrder("reportF", val)}
                          >
                            {dateToString(val)}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </th>
            {/* ----- COMMENT COLUMN ----- */}
            <th style={{ width: "20vw" }}>Comment</th>
          </tr>
        </thead>
        {/* ----- MAIN CONTENT OF TABLE ----- */}
        {reports ? (
          <tbody>
            {reports.map((report: any) => {
              return (
                <tr>
                  <td>{report.dqr_id}</td>
                  <td className="sensor-field">{report.dqr_name}</td>
                  <td>{dateToString(report.dqr_date)}</td>
                  <td>{report.dqr_comment}</td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <div></div>
        )}
      </table>
      {modalOpen && (
        <ReportModal setRefetch={setRefetch} setOpenModal={setModalOpen} />
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

export default Reports;
