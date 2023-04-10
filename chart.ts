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

  let dbPendingNumber = await client.query(
    /*sql*/ `SELECT count(*) from claim WHERE status = 'Pending'`
  );
  let pendingNumber = dbPendingNumber.rows[0].count;
  //console.log("number", pendingNumber);

  if (req.session.user?.role === "admin") {
    let dbDepartResult = await client.query(
      /*sql*/ `select sum(amount), claim_type from claim WHERE department_id=$1 group by claim_type;`,
      [req.session.user?.department_id]
    );
    let typeDepartData = dbDepartResult.rows;
    res.json({
      typePie: typeData,
      monthlyBar: monthlyData,
      typeDepartData: typeDepartData,
      pendingNumber: pendingNumber,
      role: req.session.user?.role,
    });
  } else {
    res.json({
      typePie: typeData,
      monthlyBar: monthlyData,
      role: req.session.user?.role,
    });
  }
});
