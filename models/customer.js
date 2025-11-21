import joi from "joi";

const customerSchema = joi.object({
  id: joi.string().uuid().required(),
  username: joi.string().required(),
  password: joi.string().required(),
  settings_json: joi.object().optional(),
});

export default customerSchema;
