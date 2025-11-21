import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import customerSchema from "../models/customer.js";

async function getAllCustomers(req, res, next) {
  try {
    const params = {
      TableName: "Customers",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createCustomer(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = customerSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, username, password, settings_json } = value;

    const params = {
      TableName: "Customers",
      Item: {
        id,
        username,
        password,
        settings_json,
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created customer", data: params.Item });
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(req, res, next) {
  const customerId = req.params.id;
  try {
    const params = {
      TableName: "Customers",
      Key: { id: customerId },
    };
    const command = new GetCommand(params);
    const result = await database.send(command);
    if (!result.Item) {
      return res.status(404).json({ message: "No customer found" });
    }
    res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}

async function updateCustomerById(req, res, next) {
  try {
    const customerId = req.params.id;
    req.body.id = customerId;
    const { error, value } = customerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password, settings_json } = value;

    // Get the movie from DynamoDB
    const getParams = {
      TableName: "Customers",
      Key: { id: customerId },
    };

    const getCommand = new GetCommand(getParams);

    const result = await database.send(getCommand);

    const customer = result.Item;

    if (!customer) {
      return res.status(404).json({ message: "No customer found" });
    }

    // Update the customer in DynamoDB
    const updateParams = {
      TableName: "Customers",
      Key: { id: customerId },
      UpdateExpression:
        "set #username = :username, #password = :password, #settings_json = :settings_json",
      ExpressionAttributeNames: {
        "#username": "username",
        "#password": "password",
        "#settings_json": "settings_json",
      },
      ExpressionAttributeValues: {
        ":username": username,
        ":password": password,
        ":settings_json": settings_json,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedCustomer = await database.send(updateCommand);

    res.status(200).json(updatedCustomer.Attributes);
  } catch (err) {
    next(err);
  }
}

async function deleteCustomerById(req, res, next) {
  const customerId = req.params.id;
  try {
    const params = {
      TableName: "Customers",
      Key: { id: customerId },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};