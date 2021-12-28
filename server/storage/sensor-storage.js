const knex = require("knex")(require("../knexfile"));
const resultsPerPage = 10;

/*
SQL retrieval- and update-functionality for sensors
*/

// Get information for pagination 
const getPageInfo = async (query) => {
  let results = await knex
    .select(
      "s.dqs_id",
      "s.dqs_name",
      "r.dqr_name",
      "m.dqm_status",
      "m.dqm_comment"
    )
    .from("sensors as s")
    .innerJoin("results as m", "m.dqs_id", "s.dqs_id")
    .innerJoin("reports as r", "r.dqr_id", "m.dqr_id")
    .modify((builder) => {
      if (query.owner) builder.where("s.dqs_owner", query.owner);
      if (query.reportF) builder.where("r.dqr_name", query.reportF);
      if (query.statusF) builder.where("m.dqm_status", query.statusF);
      if (true) builder.where("m.dqm_task_status", "closed");
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

// Function for SensorDetails
const getById = (id, query) => {
  return knex("sensors").first().where({ dqs_id: id, dqs_owner: query.owner });
};

// Get task in range defined by getPageInfo
const getByQuery = async (query) => {
  let { start, numberOfPages } = await getPageInfo(query);
  let finalResult = await knex
    .select(
      "s.dqs_id",
      "s.dqs_name",
      "r.dqr_name",
      "m.dqm_status",
      "m.dqm_comment"
    )
    .from("sensors as s")
    .innerJoin("results as m", "m.dqs_id", "s.dqs_id")
    .innerJoin("reports as r", "r.dqr_id", "m.dqr_id")
    .modify((builder) => {
      if (query.owner) builder.where("s.dqs_owner", query.owner);
      if (query.reportF) builder.where("r.dqr_name", query.reportF);
      if (query.statusF) builder.where("m.dqm_status", query.statusF);
      if (true) builder.where("m.dqm_task_status", "closed");

      if (query.reportO) builder.orderBy("r.dqr_name", query.reportO);
      if (query.statusO) builder.orderBy("m.dqm_status", query.statusO);
    })
    .limit(resultsPerPage)
    .offset(start);

  return { sensors: finalResult, pages: numberOfPages };
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
    .where("m.dqm_task_status", "closed")
    .orderBy(column, "DESC");
  return columnVals;
};

module.exports = {
  getById,
  getByQuery,
  getColumnVals,
};
