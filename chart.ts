import express, { Router } from "express";
import { client } from "./db";
import { sessionMiddleware } from "./login";
export let chartRouter = Router();

chartRouter.use(sessionMiddleware);
chartRouter.use(express.static("protected"));
chartRouter.use(express.json());

chartRouter.get("/chart", async (req, res) => {
  let dbResult = await client.query(
    /*sql*/ `select sum(amount), claim_type from claim WHERE employee_id=$1 group by claim_type;`,
    [req.session.user?.id]
  );
  let typeData = dbResult.rows;
  //console.log("typeData", typeData);

  let dbResultByMonth = await client.query(
    /*sql*/ `select sum(amount) as monthly_sum, to_char(date_of_submission,'Month') AS submit_month, status from claim where claim.employee_id=$1 group by submit_month, status;`,
    [req.session.user?.id]
  );
  let monthlyData = dbResultByMonth.rows;
  //console.log("monthlyData", monthlyData);

  //let dbDepartResult = await client.query(
  ///*sql*/ `select sum(amount), claim_type from claim WHERE employee_id=$1 group by claim_type;`,
  //   [req.session.user?.id]
  //);
  //let typeDepartData = dbResult.rows;
  //console.log("typeDepartData", typeData);

  res.json({ typePie: typeData, monthlyBar: monthlyData });
});
