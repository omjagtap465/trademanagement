import { redisConnection } from "../config/db.config.js";
import { transporter } from "../config/email_config.js";
import { UserRepository } from "../repositories/index.js";
const userRepository = new UserRepository();
class UserService {
  constructor() {}
  async getUser(username) {
    const userData = await userRepository.getUserDetails(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username]
    );
    return userData;
  }
  async createUser(tablename, email, username, password) {
    const createdUser = await userRepository.createUser(
      `INSERT INTO users (email,username,password) VALUES (?,?,?)`,
      [email, username, password]
    );
    console.log(createdUser);
    return createdUser;
  }
  async createOtp(email) {
    const otp = Math.ceil(Math.random() * 1000000).toString();
    if (otp.length < 6) {
      return this.createOtp(email);
    } else {
      console.log(otp);
      const client = await redisConnection();
      // console.log(client.connect());
      client.set(email, otp, (err, reply) => {
        if (err) throw err;
        console.log(reply); // Should print "OK"
      });
    }

    return otp;
  }
  async sendEmail(otp, email) {
    const info = await transporter.sendMail({
      from: "airlinemanagement98@gmail.com",
      to: email,

      text: `OTP : ${otp}`,
    });
    console.log(info.messageId);
  }
}
export { UserService };
// const sendEmail = async (emaildata, email) => {
//   transporter.sendMail(emaildata, async (err, data) => {
//     if (err) {
//       console.log("Sending to " + " failed: " + err);
//       return;
//     } else {
//       await emailrepository.updateTicket(email.id, { status: "SUCCESS" });
//     }
//   });
// };
