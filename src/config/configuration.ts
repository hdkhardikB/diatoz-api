export default () => ({
  port: parseInt(process.env.PORT, 10) || 5003,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
  },
  keys: {
    secret: process.env.JWT_SECRET.replace(/\\n/gm, '\n'),
  },
});
