import joi from "joi";

const accountSchema = joi.object({
  id: joi.string().required(),
  sort_code: joi.string().required(),
  account_number: joi.number().required(),
  balance: joi.number().required(),
});

export default accountSchema;