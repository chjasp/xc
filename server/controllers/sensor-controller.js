const sensorStorage = require("../storage/sensor-storage");

/* In case you need to clean-up / specific specific sensor data,
this function can handle it. However, not necessary. 
Feel free to delete if not needed.
Don't forget to align the naming with the frontend though!
*/
const cleanData = (result) => {
  let cleanResults = result.sensors.map((sensorObj) => {
    let name = sensorObj.dqr_name;
    let status = sensorObj.dqm_status;
    return { ...sensorObj, dqr_name: name, dqm_status: status };
  });
  return { sensors: cleanResults, pages: result.pages };
};

/*
Make a query call to knex to retrieve all unique values in the specified columns.
Will be used for the filter.
*/
const getColumnVals = async (req, res) => {
  try {
    let reportC = await sensorStorage.getColumnVals(
      "r.dqr_name",
      req.query.owner
    );
    let statusC = await sensorStorage.getColumnVals(
      "m.dqm_status",
      req.query.owner
    );
  
    if (reportC && statusC) {
      res.status(200);
      res.json({ reportC: reportC, statusC: statusC });
    } else {
      res.status(404);
      res.json(null);
    }
  } catch (err) {
    res.status(err.status || 500);
    res.end("Error: " + err.message);
  }
};

/*
Get (all) sensor data
*/
const getSensors = async (req, res) => {
  try {
    const result = await sensorStorage.getByQuery(req.query);
    let cleanedResult = cleanData(result);
    res.status(200);
    res.json({results: cleanedResult, message: ""});
  } catch (err) {
    res.status(err.status || 500);
    res.json({results: [], message: err.message});
  }
};

/*
Get specific sensor for SensorDetails page
*/
const getById = async (req, res) => {
  let id = parseInt(req.params.id);

  try {
    await sensorStorage.getById(id, req.query).then((sensor) => {
      if (sensor) {
        res.status(200);
        res.json({ results: sensor, message: "" });
      } else {
        res.status(404);
        res.json({results: [], message: "ID not found"});
      }
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({results: [], message: err.message});
  }
};

module.exports = {
  getById,
  getSensors,
  getColumnVals,
};
