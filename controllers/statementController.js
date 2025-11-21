import database from "../services/database.js";

async function getStatementById(req, res, next) {
  const customerId = req.params.id;
  try {
    const query = database.createQuery('Deposits')
      .filter('customer_id', '=', customerId)
      .order('timestamp', { descending: true });
    const [deposits] = await database.runQuery(query);
    res.status(200).json(deposits || []);
  } catch (err) {
    next(err);
  }
}
  

export default {
  getStatementById,
};