import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY =
  "sk_test_51RxRcT0AGPM5iP7QyYuSqWvavLHhUAxwHt7HnNceLPvcuYril6Sdg0XRMM255SD2hoKNgidlQ25EJVVtohaSqpgj00zbvACIRB";

const JWT_PROVIDER_PASSWORD = process.env.JWT_PROVIDER_PASSWORD;
export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};
