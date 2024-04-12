import { redisConnection } from "../config/db.config.js";
import { transporter } from "../config/email_config.js";
import { UserRepository, TradeRepository } from "../repositories/index.js";
import { TOTP } from "totp-generator";
const dbRepository = new TradeRepository();
class UserService {
  constructor() {}
  async getUser(username) {
    const userData = await dbRepository.select(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username]
    );
    return userData;
  }
  async createUser(email, username, password, keyForOTP) {
    const createdUser = await dbRepository.create(
      `INSERT INTO users (email,username,password,otp_generator_key) VALUES (?,?,?,?)`,
      [email, username, password, keyForOTP]
    );
    console.log(createdUser);
    return createdUser;
  }
  async createOtp(generatorKey, email) {
    const currentTimestamp = Date.now();
    console.log(currentTimestamp, new Date());

    const { otp } = TOTP.generate(generatorKey, {
      timestamp: currentTimestamp,
      period: 600,
    });

    // Create a new Date object from currentTimestamp
    const date = new Date(currentTimestamp);

    // Get ISO 8601 formatted date string in UTC timezone
    const isoDateString = date.toISOString();
    console.log(isoDateString); // Output: "YYYY-MM-DDTHH:mm:ss.sssZ"

    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    const saveOtp = await dbRepository.create(
      `INSERT INTO otps (generator_key,timestamp) VALUES (?,?)`,
      [generatorKey, formattedDate]
    );
    await this.sendEmail(otp, email);
  }
  async sendEmail(otp, email) {
    const info = await transporter.sendMail({
      from: "airlinemanagement98@gmail.com",
      to: email,

      text: `OTP : ${otp}`,
    });
    console.log(info.messageId);
  }
  async verifyOtp(otpForVerification, generatorKeyOtp) {
    try {
      // Fetch OTP records for the given generator key
      const selectGeneratorKey = await dbRepository.select(
        "SELECT * FROM `otps` WHERE `generator_key` = ?",
        [generatorKeyOtp]
      );

      // Define the time window for OTP validity (10 minutes in milliseconds)
      const tenMinutesInMilliseconds = 10 * 60 * 1000;

      // Calculate the timestamp threshold (10 minutes ago)
      const tenMinutesAgo = Date.now() - tenMinutesInMilliseconds;

      // Filter OTP records within the valid time window
      const validOtps = selectGeneratorKey.filter((data) => {
        // Get the timestamp from the OTP record
        const timestamp = data.timestamp;

        // Check if the timestamp is within the last 10 minutes
        return timestamp >= tenMinutesAgo;
      });

      // Iterate over filtered OTP records and verify against provided OTP
      console.log(validOtps);
      // for (const element of validOtps) {
      //   const { otp } = TOTP.generate(element.generator_key, {
      //     timestamp: element.timestamp,
      //   });

      //   // Compare generated OTP with the provided OTP for verification
      //   if (otp === otpForVerification) {
      //     // Matching OTP found, return true
      //     return true;
      //   }
      // }

      // No matching OTP found within the valid time window, return false
      return false;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false; // Return false in case of any errors
    }
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
