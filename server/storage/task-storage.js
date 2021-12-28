const knex = require("knex")(require("../knexfile"));
const resultsPerPage = 10;

/*
SQL retrieval- and update-functionality for tasks
*/

// Get information for pagination
const getPageInfo = async (query) => {
  let results = await knex
    .select(
      "s.dqs_id",
      "s.dqs_name",
      "r.dqr_name",
      "m.dqm_timestamp",
      "m.dqm_comment"
    )
    .from("sensors as s")
    .innerJoin("results as m", "m.dqs_id", "s.dqs_id")
    .innerJoin("reports as r", "r.dqr_id", "m.dqr_id")
    .modify((builder) => {
      if (query.owner) builder.where("s.dqs_owner", query.owner);
      if (query.reportF) builder.where("r.dqr_name", query.reportF);
      if (query.duedateF) builder.where("m.dqm_timestamp", query.duedateF);
      if (true) builder.where("m.dqm_task_status", "open")
    });

  let numOfResults = results.length;
  let numberOfPages = Math.ceil(numOfResults / resultsPerPage);
  let page = query.page ? Number(query.page) : 0;

  if (page > numberOfPages) {
    page = numberOfPages;
  }

  let startingLimit = page * resultsPerPage;
  return { start: startingLimit, numberOfPages: numberOfPages };
};

// Get task in range defined by getPageInfo
const getByQuery = async (query) => {
  let { start, numberOfPages } = await getPageInfo(query);
  let finalResult = await knex
    .select(
      "s.dqs_id",
      "s.dqs_name",
      "r.dqr_name",
      "m.dqm_timestamp",
      "m.dqm_comment"
    )
    .from("sensors as s")
    .innerJoin("results as m", "m.dqs_id", "s.dqs_id")
    .innerJoin("reports as r", "r.dqr_id", "m.dqr_id")
    .modify((builder) => {
      if (query.owner) builder.where("s.dqs_owner", query.owner);
      if (query.reportF) builder.where("r.dqr_name", query.reportF);
      if (query.duedateF) builder.where("m.dqm_timestamp", query.duedateF);
      if (true) builder.where("m.dqm_task_status", "open")

      if (query.reportO) builder.orderBy("r.dqr_name", query.reportO);
      if (query.duedateO) builder.orderBy("m.dqm_timestamp", query.duedateO);
    })
    .limit(resultsPerPage)
    .offset(start);

  return { tasks: finalResult, pages: numberOfPages };
};

// Get column values to display in filter dropdown
const getColumnVals = async (column, owner) => {
  let columnVals = await knex
  .select(column)
  .distinct(column)
  .from("sensors as s")
  .innerJoin("results as m", "m.dqs_id", "s.dqs_id")
  .innerJoin("reports as r", "r.dqr_id", "m.dqr_id")
  .where("s.dqs_owner", owner)
  .where("m.dqm_task_status", "open")
  .orderBy(column, "DESC");
  return columnVals;
};

// Require a comment if status changes from red or amber to green
const checkTasks = async (query) => {
  // CHANGE TO LOOK UP SCORE!!
  let score = query.score < 0.66 ? (query.score < 0.33 ? 0 : 1) : 2
  let x = await knex("results")
  .modify((builder) => {
    builder.where("dqs_id", "=", query.sid)
    builder.where("dqr_id", "=", query.rid)
    builder.whereIn("dqm_task_status", [1,2])
    })
  if (score == 2 && x[0] > 0) return "Error"
  return "Success";
};

// Search for prefilled result and update data
const uploadTasks = async (query) => {
  let x = await knex("results")
  .where("dqs_id", "=", query.sid)
  .where("dqr_id", "=", query.rid)
  .update({
    dqm_score: query.score,
    // Add subquery to get sensor-specific thresholds
    dqm_status: query.score < 0.66 ? (query.score < 0.33 ? 0 : 1) : 2,
    dqm_task_status: "closed",
    dqm_comment: query.comment
  })
  return x;
};

module.exports = {
  getByQuery,
  getColumnVals,
  uploadTasks,
  checkTasks
};
