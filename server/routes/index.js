const router = require("express").Router();
const sensorController = require("../controllers/sensor-controller")
const taskController = require("../controllers/task-controller")
const reportController = require("../controllers/report-controller")

// SENSOR ROUTES
router.get("/sensors", sensorController.getSensors)
router.get("/sensors/:id", sensorController.getById)
router.get("/sensorsColumnVals", sensorController.getColumnVals)

// TASK ROUTES
router.get("/tasks", taskController.getTasks)
router.get("/tasksColumnVals", taskController.getColumnVals)
router.post("/uploadtasks", taskController.uploadTasks)
router.post("/checktasks", taskController.checkTasks)

// REPORT ROUTES
router.get("/reports", reportController.getReports)
router.get("/reportsColumnVals", reportController.getColumnVals)
router.post("/uploadreports", reportController.uploadReports)


module.exports = router;