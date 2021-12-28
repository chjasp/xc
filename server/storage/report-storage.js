const knex = require("knex")(require("../knexfile"));
const resultsPerPage = 10;

/*
SQL retrieval- and update-functionality for reports
*/

// Get information for pagination
const getPageInfo = async (query) => {
  let results = await knex
    .select("dqr_id", "dqr_name", "dqr_date", "dqr_comment")
    .from("reports")
    .modify((builder) => {
      if (query.reportF) builder.where("dqr_date", query.reportF);
      if (query.reportO) builder.orderBy("dqr_date", query.reportO);
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

// Get reports in range defined by getPageInfo
const getByQuery = async (query) => {
  let { start, numberOfPages } = await getPageInfo(query);
  let finalResult = await knex
    .select("dqr_id", "dqr_name", "dqr_date", "dqr_comment")
    .from("reports")
    .modify((builder) => {
      if (query.reportF) builder.where("dqr_date", query.reportF);
      if (query.reportO) builder.orderBy("dqr_date", query.reportO);
    })
    .limit(resultsPerPage)
    .offset(start);
  return { reports: finalResult, pages: numberOfPages };
};

// Get column values to display in filter dropdown
const getColumnVals = async () => {
  let columnVals = await knex
    .select("dqr_date")
    .distinct("dqr_date")
    .from("reports")
    .orderBy("dqr_date", "DESC");
  return columnVals;
};

/*
ERROR-HANDLING FOR MYSQL-INSERT

- Formatted_id always returns a number >= 1 (also when the table has 0 entries)
- knex().insert() always returns the dqr_id of the inserted row
- If knex().insert() fails (e.g. because of duplicate name) it returns 0
- Therefore: Return error if 0 is returned

*/
const uploadReports = async (query) => {
  let max_id = await knex("reports").max("dqr_id as value");
  let formatted_id = max_id[0]["value"] + 1;

  let x = await knex("reports")
    .insert({
      dqr_id: formatted_id,
      dqr_name: query.name,
      dqr_date: query.date,
      dqr_comment: query.comment,
    })
    .onConflict(["dqr_name"])
    .ignore();

  if (x[0] == 0) {
    throw new Error("Duplicate name");
  } else {
    await insertResultRows(formatted_id, query.date);
    return x;
  }
};

// Insert new result values after all checks (front- and backend) successfully finished
const insertResultRows = async (dqr_id, duedate) => {
  let rawQuery = `INSERT INTO results (dqs_id, dqr_id, dqm_score, dqm_comment, dqm_timestamp, dqm_status, dqm_task_status) SELECT s.dqs_id,${dqr_id},${0.68},'no comment','${duedate}',${0},"open" FROM sensors s`;
  const result = await knex.raw(rawQuery);
  return result;
};

module.exports = {
  getByQuery,
  getColumnVals,
  uploadReports,
};
