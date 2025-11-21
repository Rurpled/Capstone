import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";
import customerSchema from "../models/customer.js";

async function getAllCustomers(req, res, next) {
  try {
    const query = database.createQuery('Customers');
    const [customers] = await database.runQuery(query);
    res.status(200).json(customers);
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

    const key = database.key(['Customers', id]);
    const entity = {
      key: key,
      data: {
        id,
        username,
        password,
        settings_json,
      },
    };

    await database.save(entity);

    res
      .status(201)
      .json({ message: "Successfully created customer", data: entity.data });
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(req, res, next) {
  const customerId = req.params.id;
  try {
    const key = database.key(['Customers', customerId]);
    const [customer] = await database.get(key);
    if (!customer) {
      return res.status(404).json({ message: "No customer found" });
    }
    res.status(200).json(customer);
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

    const { id, username, password, settings_json } = value;

    // Check if customer exists
    const key = database.key(['Customers', customerId]);
    const [customer] = await database.get(key);

    if (!customer) {
      return res.status(404).json({ message: "No customer found" });
    }

    // Update the customer in Datastore
    const entity = {
      key: key,
      data: {
        id,
        username,
        password,
        settings_json,
      },
    };

    await database.save(entity);

    res.status(200).json(entity.data);
  } catch (err) {
    next(err);
  }
}

async function deleteCustomerById(req, res, next) {
  const customerId = req.params.id;
  try {
    const key = database.key(['Customers', customerId]);
    await database.delete(key);
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