import database from "../services/database.js";
import {
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

async function getTotalLeaderboard(req, res, next) {
  try {
    const params = {
      TableName: "Deposits",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    
    // Group by customer_id and sum points
    const leaderboard = {};
    
    result.Items.forEach(deposit => {
      const customerId = deposit.customer_id;
      const pointsTotal = deposit.points_total || 0;
      const pointsEco = deposit.points_eco || 0;
      const pointsHealth = deposit.points_health || 0;
      const co2 = deposit.estimated_co2_g || 0;
      
      if (leaderboard[customerId]) {
        leaderboard[customerId].total_points += pointsTotal;
        leaderboard[customerId].total_points_eco += pointsEco;
        leaderboard[customerId].total_points_health += pointsHealth;
        leaderboard[customerId].total_co2_g += co2;
      } else {
        leaderboard[customerId] = {
          customer_id: customerId,
          total_points: pointsTotal,
          total_points_eco: pointsEco,
          total_points_health: pointsHealth,
          total_co2_g: co2,
        };
      }
    });
    
    // Fetch usernames for each customer
    const leaderboardWithUsernames = await Promise.all(
      Object.values(leaderboard).map(async (entry) => {
        try {
          const customerParams = {
            TableName: "Customers",
            Key: { id: entry.customer_id },
          };
          const customerCommand = new GetCommand(customerParams);
          const customerResult = await database.send(customerCommand);
          
          return {
            ...entry,
            username: customerResult.Item?.username || "Unknown",
          };
        } catch (err) {
          return {
            ...entry,
            username: "Unknown",
          };
        }
      })
    );
    
    // Sort by total points descending
    const sortedLeaderboard = leaderboardWithUsernames
      .sort((a, b) => b.total_points - a.total_points);
    
    res.status(200).json(sortedLeaderboard);
  } catch (err) {
    next(err);
  }
}

export default {
  getTotalLeaderboard,
  
};