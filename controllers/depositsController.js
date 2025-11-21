import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";
import depositSchema from "../models/deposit.js";

async function getAllDeposits(req, res, next) {
  try {
    const query = database.createQuery('Deposits');
    const [deposits] = await database.runQuery(query);
    res.status(200).json(deposits);
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

    // Use composite key: id + timestamp
    const key = database.key(['Deposits', `${id}#${timestamp}`]);
    const entity = {
      key: key,
      data: {
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

    await database.save(entity);

    res
      .status(201)
      .json({ message: "Successfully created deposit", data: entity.data });
  } catch (error) {
    next(error);
  }
}


async function getDepositById(req, res, next) {
  const depositId = req.params.id;
  try {
    const query = database.createQuery('Deposits')
      .filter('id', '=', depositId);
    const [deposits] = await database.runQuery(query);
    if (!deposits || deposits.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }
    res.status(200).json(deposits);
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
    const { timestamp, deposit_date, deposit_type, raw_value, estimated_co2_g, points_eco, points_health, points_total, customer_id } = value;

    // Query to get the deposit with this id
    const query = database.createQuery('Deposits')
      .filter('id', '=', depositId);
    const [deposits] = await database.runQuery(query);

    if (!deposits || deposits.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }

    const deposit = deposits[0];

    // Update the deposit in Datastore using composite key
    const key = database.key(['Deposits', `${depositId}#${deposit.timestamp}`]);
    const entity = {
      key: key,
      data: {
        id: depositId,
        customer_id: customer_id,
        timestamp: deposit.timestamp,
        deposit_date,
        deposit_type,
        raw_value,
        estimated_co2_g,
        points_eco,
        points_health,
        points_total,
      },
    };

    await database.save(entity);

    res.status(200).json(entity.data);
  } catch (err) {
    next(err);
  }
}

  
async function deleteDepositById(req, res, next) {
  const depositId = req.params.id;
  try {
    // First, query to get the deposit(s) with this id
    const query = database.createQuery('Deposits')
      .filter('id', '=', depositId);
    const [deposits] = await database.runQuery(query);
    
    if (!deposits || deposits.length === 0) {
      return res.status(404).json({ message: "No deposit found" });
    }
    
    // Delete the first matching deposit using composite key
    const deposit = deposits[0];
    const key = database.key(['Deposits', `${depositId}#${deposit.timestamp}`]);
    await database.delete(key);
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