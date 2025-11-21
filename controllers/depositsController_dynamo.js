import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import depositSchema from "../models/deposit.js";

async function getAllDeposits(req, res, next) {
  try {
    const params = {
      TableName: "Deposits",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createDeposit(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = depositSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, customer_id, timestamp, deposit_date, deposit_type, raw_value, estimated_co2_g, points_eco, points_health, points_total } = value;

    const params = {
      TableName: "Deposits",
      Item: {
        id,
        customer_id,
        timestamp,
        deposit_date,
        deposit_type,
        raw_value,
        estimated_co2_g,
        points_eco,
        points_health,
        points_total,
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created deposit", data: params.Item });
  } catch (error) {
    next(error);
  }
}


async function getDepositById(req, res, next) {
  const depositId = req.params.id;
  try {
    const params = {
      TableName: "Deposits",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": depositId,
      },
    };
    const command = new QueryCommand(params);
    const result = await database.send(command);
    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}
  
  
async function updateDepositById(req, res, next) {
  try {
    const depositId = req.params.id;
    req.body.id = depositId;
    const { error, value } = depositSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { timestamp, deposit_date, deposit_type, raw_value, estimated_co2_g, points_eco, points_health, points_total } = value;

    // Query to get the deposit with this id
    const queryParams = {
      TableName: "Deposits",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": depositId,
      },
    };

    const queryCommand = new QueryCommand(queryParams);
    const result = await database.send(queryCommand);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }

    const deposit = result.Items[0];

    // Update the deposit in DynamoDB using both id and timestamp
    const updateParams = {
      TableName: "Deposits",
      Key: { 
        id: depositId,
        timestamp: deposit.timestamp
      },
      UpdateExpression:
        "set #deposit_date = :deposit_date, #deposit_type = :deposit_type, #raw_value = :raw_value, #estimated_co2_g = :estimated_co2_g, #points_eco = :points_eco, #points_health = :points_health, #points_total = :points_total",
      ExpressionAttributeNames: {
        "#deposit_date": "deposit_date",
        "#deposit_type": "deposit_type",
        "#raw_value": "raw_value",
        "#estimated_co2_g": "estimated_co2_g",
        "#points_eco": "points_eco",
        "#points_health": "points_health",
        "#points_total": "points_total",
      },
      ExpressionAttributeValues: {
        ":deposit_date": deposit_date,
        ":deposit_type": deposit_type,
        ":raw_value": raw_value,
        ":estimated_co2_g": estimated_co2_g,
        ":points_eco": points_eco,
        ":points_health": points_health,
        ":points_total": points_total,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedDeposit = await database.send(updateCommand);

    res.status(200).json(updatedDeposit.Attributes);
  } catch (err) {
    next(err);
  }
}

  
async function deleteDepositById(req, res, next) {
  const depositId = req.params.id;
  try {
    // First, query to get the deposit(s) with this id
    const queryParams = {
      TableName: "Deposits",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": depositId,
      },
    };
    const queryCommand = new QueryCommand(queryParams);
    const result = await database.send(queryCommand);
    
    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }
    
    // Delete the first matching deposit with both id and timestamp
    const params = {
      TableName: "Deposits",
      Key: { 
        id: depositId,
        timestamp: result.Items[0].timestamp
      },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


export default {
  getAllDeposits,
  createDeposit,

  getDepositById,
  updateDepositById,
  deleteDepositById,
};