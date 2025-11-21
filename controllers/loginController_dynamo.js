import database from "../services/database.js";
import {
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

async function loginID(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Query Customers table using the username index
    const params = {
      TableName: "Customers",
      IndexName: "username-index",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };
    
    const command = new QueryCommand(params);
    const result = await database.send(command);

    // Check if customer exists
    if (!result.Items || result.Items.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const customer = result.Items[0];

    // Verify password (plaintext comparison for sandbox)
    if (customer.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set cookie with customer ID (expires in 24 hours)
    res.cookie('customer_id', customer.id, {
      httpOnly: false, // Allow JavaScript to read the cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      sameSite: 'lax'
    });

    // Return success with customer data
    res.status(200).json({
      message: "Login successful",
      customer_id: customer.id,
      username: customer.username
    });
  } catch (err) {
    next(err);
  }
}


export default {
  loginID,
};