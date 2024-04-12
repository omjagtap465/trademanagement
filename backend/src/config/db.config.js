import mysql from "mysql2/promise";
import { createClient } from "redis";
import { config } from "dotenv";
config();

const sqlConnection = async (query, arrayofVariables = []) => {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  //   return pool;
  //   const sql = sqlConnection();
  const conn = await pool.getConnection();
  // console.log(query);
  const [results] = await conn.query(query, arrayofVariables);
  // console.log(results);
  pool.releaseConnection(conn);
  // console.log(results);
  return results;
};
const redisConnection = async () => {
  const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: 14209,
    },
  });
  client.on("ready", () => console.log("Redis is Connected and ready to use"));
  console.log("INside Redis");
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  return client;
};
export { sqlConnection, redisConnection };
