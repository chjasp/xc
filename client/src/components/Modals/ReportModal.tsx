import "./ReportModal.css";
import React, { useState } from "react";

interface ModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<any>>;
  setRefetch: React.Dispatch<React.SetStateAction<any>>;
}

/*
Modal to insert report data
*/
const ReportModal: React.FC<ModalProps> = ({ setOpenModal, setRefetch }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [duedate, setDuedate] = useState("");

  const [uploadStatus, setUploadStatus] = useState("");

  const resetInput = () => {
    setName("");
    setComment("");
    setDuedate("");
  };

  const dateFormatCheck = (rawDate: string) => {
    // First check for the pattern
    if (!/^\d{1,2}.\d{1,2}.\d{4}$/.test(rawDate)) {
      return false;
    }

    // Parse the date parts to integers
    var parts = rawDate.split(".");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  };

  const submit = async () => {
    if (name === "" || duedate === "") {
      setUploadStatus("Failed - Missing value(s)");
      return;
    }

    if (!dateFormatCheck(duedate)) {
      setUploadStatus("Failed - Faulty date")
      return;
    }

    let formattedName = name.replace(/ /g, "-")
    let formattedDate = duedate.split(".")[2] + "-" + duedate.split(".")[1] + "-" + duedate.split(".")[0]

    try {
      const response = await fetch(
        `http://localhost:3000/uploadreports?name=${formattedName}&date=${formattedDate}&comment=${comment}`,
        {
          method: "POST",
          headers: {
            "access-control-allow-origin": "*",
          },
        }
      );
      if (response.status === 500) {
        setUploadStatus(`Upload Failed`);
      } else {
        setUploadStatus("Success");
        setRefetch((fetch: boolean) => !fetch);
        resetInput();
      }
    } catch {
      setUploadStatus("Failed - Couldn't connect to server");
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Upload New Report</h1>
        </div>
        <div data-testid="reportUploadStatus" className={`uploadstatus ${uploadStatus}`}>{uploadStatus}</div>
        <div className="body">
          {" "}
          <input
            id="inp-name"
            data-testid="report-name-input"
            className="text-input"
            type="text"
            onInput={(e) => setName((e.target as HTMLTextAreaElement).value)}
            value={name}
            placeholder="Name"
            name="firstName"
          />
          <input
            id="inp-comment"
            className="text-input"
            type="text"
            onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
            value={comment}
            name="Comment"
            placeholder="Comment"
          />
          <input
            id="inp-comment"
            data-testid="report-date-input"
            className="text-input"
            type="text"
            onInput={(e) => setDuedate((e.target as HTMLTextAreaElement).value)}
            value={duedate}
            name="duedate"
            placeholder="DD.MM.YYYY"
          />
        </div>
        <div className="footer">
          <button
            onClick={() => {
              resetInput();
            }}
            id="cancelBtn"
          >
            Clear
          </button>
          <button data-testid="report-submit" onClick={submit}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
