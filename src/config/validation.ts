import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().optional(),
  DATABASE_HOST: Joi.when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DATABASE_PORT: Joi.when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.number().optional(),
    otherwise: Joi.number().required(),
  }),
  DATABASE_USERNAME: Joi.when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DATABASE_PASSWORD: Joi.when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DATABASE_NAME: Joi.when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DATABASE_SSL: Joi.boolean().optional(),
  JWT_SECRET_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_PRODUCTS_PREFIX: Joi.string().optional(),
  PAYMOB_API_KEY: Joi.string().required(),
  PAYMOB_INTEGRATION_ID: Joi.alternatives(Joi.string(), Joi.number()).required(),
  PAYMOB_IFRAME_ID: Joi.alternatives(Joi.string(), Joi.number()).required(),
  PAYMOB_HMAC_SECRET: Joi.string().optional(),
});
