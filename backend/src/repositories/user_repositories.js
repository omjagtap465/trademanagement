import { sqlConnection } from "../config/db.config.js";
class UserRepository {
  async getUserDetails(query, username) {
    const queryResult = await sqlConnection(query, username);
    return queryResult;
  }
  async createUser(query, userDetails) {
    const queryResult = await sqlConnection(query, userDetails);
    return queryResult;
  }
}
export { UserRepository };
