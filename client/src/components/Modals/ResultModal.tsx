import "./ResultModal.css";
import React, { useState } from "react";

interface ResultModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<any>>;
  setRefetch: React.Dispatch<React.SetStateAction<any>>;
}

/*
Modal to insert result data
*/
const ResultModal: React.FC<ResultModalProps> = ({ setOpenModal, setRefetch }) => {

  // Handle file upload
  const [csvFile, setCsvFile] = useState(new Blob());
  const [csvName, setCsvName] = useState("-");

  const [commentStatus, setCommentStatus] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")

  const commentCheck = async (
    sid: string,
    rid: string,
    score: string
      ) => {
    const result = await fetch(
      `http://localhost:3000/checktasks?sid=${sid}&rid=${rid}&score=${score}`,
      {
        method: "POST",
        headers: {
          "access-control-allow-origin": "*",
        },
      }
    );
    let { status } = await result.json();

    if (status === "Success") return true;
    return false
  };

  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async function (e: any) {
      const text = e.target.result;
      const rawText = text.split("\n");

      for (let i = 0; i < rawText.length; i++) {
        let argArray = rawText[i].split(",");
        if (argArray.length !== 4) {
          continue;
        }

        const [sid, rid, score, comment] = rawText[i].split(",");

        let commentValid = true
        if (comment === "") {
          commentValid = await commentCheck(sid, rid, score)
        }

        if (commentValid === false) {
          setCommentStatus(`Sensor ID ${sid}, Report ID ${rid}: No comment set. Please correct.`)
          setUploadStatus(`Upload aborted: Please reupload`)
          e.target.value = "";
          return
        }

        await fetch(
          `http://localhost:3000/uploadtasks?sid=${sid}&rid=${rid}&score=${score}&comment=${comment}`,
          {
            method: "POST",
            headers: {
              "access-control-allow-origin": "*",
            },
          }
        );
        setCommentStatus("Success")
        setUploadStatus("Success")
        setRefetch((refetch: boolean) => !refetch);
        e.target.value = "";
      }
    };
  };

  return (
    <div className="modalBackground">
      <div className="modalContainerResult">
        <div className="titleCloseBtnResult">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Upload Results</h1>
        </div>
        <div className="body">
          <div className="text-info">
            <div className="check">
              <span className="preface">Selected File: {csvName}</span>
            </div>
            <div className="check">
              <span className="preface">Batch Content Status:</span>
              <div className="info-field">{commentStatus}</div>
            </div>
            <div className="check">
              <span className="preface">Batch Upload Status:</span>
              <div className="info-field">{uploadStatus}</div>
            </div>
          </div>

          <form className="csv-upload">
            <div className="footer">
              <label className="csv-select">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e: any) => {
                    if (e) {
                      setCsvName(e.target.files[0].name);
                      setCsvFile(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />
                Select File
              </label>
              <button
                className="csv-btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (csvFile) submit();
                }}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
