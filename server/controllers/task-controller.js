const taskStorage = require("../storage/task-storage");

const cleanDates = (result) => {
  let cleanResults = result.tasks.map((sensorObj) => {
    let cleanReport = sensorObj.dqr_name;
    let cleanDueDate =
      sensorObj.dqm_timestamp.getFullYear() +
      "-" +
      (sensorObj.dqm_timestamp.getMonth() + 1) +
      "-" +
      sensorObj.dqm_timestamp.getDate();
    return { ...sensorObj, dqr_name: cleanReport, dqm_timestamp: cleanDueDate };
  });
  return { tasks: cleanResults, pages: result.pages };
};

const getColumnVals = async (req, res) => {
  try {
    let reportC = await taskStorage.getColumnVals("r.dqr_name", req.query.owner);
    let duedateC = await taskStorage.getColumnVals("m.dqm_timestamp", req.query.owner);
    duedateC = duedateC.map((valObj) => {
      return {
        dqm_timestamp:
          valObj.dqm_timestamp.getFullYear() +
          "-" +
          (valObj.dqm_timestamp.getMonth() + 1) +
          "-" +
          valObj.dqm_timestamp.getDate(),
      };
    });

    if (reportC && duedateC) {
      res.status(200);
      res.json({ reportC: reportC, duedateC: duedateC });
    } else {
      res.status(404);
      res.json(null);
    }
  } catch (err) {
    res.status(err.status || 500);
    res.end("Error: " + err.message);
  }
};

const getTasks = async (req, res) => {
  try {
    const result = await taskStorage.getByQuery(req.query);
    let cleanedResult = cleanDates(result);
    res.status(200);
    res.json({results: cleanedResult, message: ""});
  } catch (err) {
    res.status(err.status || 500);
    res.json({results: [], message: err.message});
  }
};

const uploadTasks = async (req, res) => {
  try {
    await taskStorage.uploadTasks(req.query);
    res.status(200);
    res.json({ status: "success" });
  } catch (err) {
    res.status(err.status || 500);
    res.end("Error: " + err.message);
  }
};

const checkTasks = async (req, res) => {
  try {
    const result = await taskStorage.checkTasks(req.query);
    res.status(200);
    res.json({ status: result });
  } catch (err) {
    res.status(err.status || 500);
    res.end("Error: " + err.message);
  }
};

module.exports = {
  getTasks,
  getColumnVals,
  uploadTasks,
  checkTasks
};
