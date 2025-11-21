import database from "../services/database.js";
import {
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

async function getStatementById(req, res, next) {
  const customerId = req.params.id;
  try {
    const params = {
      TableName: "Deposits",
      IndexName: "customer_id-timestamp-index",
      KeyConditionExpression: "customer_id = :customer_id",
      ExpressionAttributeValues: {
        ":customer_id": customerId,
      },
      ScanIndexForward: false, // Sort by timestamp descending (newest first)
    };
    const command = new QueryCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items || []);
  } catch (err) {
    next(err);
  }
}
  

export default {
  getStatementById,
};