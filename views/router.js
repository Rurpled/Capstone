import express from "express";
import depositsController from "../controllers/depositsController.js";
import customersController from "../controllers/customersController.js";
import leaderBoardController from "../controllers/leaderBoardController.js";
import loginController from "../controllers/loginController.js";
import statementController from "../controllers/statementController.js";

const Router = express.Router();

Router.route("/deposits")
  .get(depositsController.getAllDeposits)
  .post(depositsController.createDeposit);

Router.route("/deposits/:id")
  .get(depositsController.getDepositById)
  .put(depositsController.updateDepositById)
  .delete(depositsController.deleteDepositById);


Router.route("/customers")
  .get(customersController.getAllCustomers)
  .post(customersController.createCustomer);

Router.route("/customers/:id")
  .get(customersController.getCustomerById)
  .put(customersController.updateCustomerById)
  .delete(customersController.deleteCustomerById);

Router.route("/leaderboard")
  .get(leaderBoardController.getTotalLeaderboard);

Router.route("/login")
  .post(loginController.loginID);


Router.route("/statement/:id")
  .get(statementController.getStatementById);

export default Router;