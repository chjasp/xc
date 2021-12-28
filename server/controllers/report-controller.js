const reportStorage = require("../storage/report-storage");

/* Bring report date in (more) german format: YYYY-MM-DD */
const cleanDates = (result) => {
  let cleanResults = result.reports.map((reportObj) => {
    let cleanReport =
      reportObj.dqr_date.getFullYear() +
      "-" +
      (reportObj.dqr_date.getMonth() + 1) +
      "-" +
      reportObj.dqr_date.getDate();
    return { ...reportObj, dqr_date: cleanReport };
  });
  return { reports: cleanResults, pages: result.pages };
};

/* Get the unique values of a column.
Relevant for filtering.
*/
const getColumnVals = async (req, res) => {
  try {
    let reportC = await reportStorage.getColumnVals();
    reportC = reportC.map((valObj) => {
      return {
        dqr_date:
          valObj.dqr_date.getFullYear() +
          "-" +
          (valObj.dqr_date.getMonth() + 1) +
          "-" +
          valObj.dqr_date.getDate(),
      };
    });
    if (reportC) {
      res.status(200);
      res.json({ reportC: reportC });
    } else {
      res.status(404);
      res.json(null);
    }
  } catch (err) {
    res.status(err.status || 500);
    res.json("Error: " + err.message);
  }
};

/* 
1. Pass query to storage-function (handles SQL)
2. ( Handle result )
3. Send response
*/
const getReports = async (req, res) => {
  try {
    const result = await reportStorage.getByQuery(req.query);
    let cleanedResult = cleanDates(result);
    res.status(200);
    res.json({results: cleanedResult, message: ""});
  } catch (err) {
    res.status(500);
    res.json({results: [], message: err.message});
  }
};

/* Upload report.
Specify message to be shown in frontend. 
*/
const uploadReports = async (req, res) => {
  try {
    await reportStorage.uploadReports(req.query).then((result) => {
      res.status(200);
      res.json({ message: "" });
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  }
};

module.exports = {
  getReports,
  getColumnVals,
  uploadReports,
};
