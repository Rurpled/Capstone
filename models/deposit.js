import joi from "joi";

const depositSchema = joi.object({
  id: joi.string().uuid().required(),
  customer_id: joi.string().uuid().required(),
  timestamp: joi.string().isoDate().required(),
  deposit_date: joi.string().isoDate().required(),
  //deposit_type: joi.string().required(),
  deposit_type: joi.string().valid("steps", "cycling", "meeting", "stairs").required(),
  raw_value: joi.number().precision(2).required(),
  estimated_co2_g: joi.number().precision(2).required(),
  points_eco: joi.number().precision(2).required(),
  points_health: joi.number().precision(2).required(),
  points_total: joi.number().precision(2).required(),
});

export default depositSchema;
