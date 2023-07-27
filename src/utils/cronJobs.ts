import cron from "node-cron";
import {Op} from "sequelize";
import User from "../modules/user/user.model";

// Automatically Run Every Amount Of Time
export default function setupCronJobs() {
  // [1] DELETE InActivate Users After 30 days
  // Schedule the cron job to run every month (1 mean the first day in month, 0 0 mean run at midnight (0:00))
  cron.schedule("0 0 1 * *", async () => {
    // a) Get all deactivated users whose deletion date is more than 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // console.log(thirtyDaysAgo);
    const inActiveUsers = await User.findAll({
      where: {active: false, deletedAt: {[Op.lte]: thirtyDaysAgo}},
      paranoid: false, // Include deleted users in the result set
    });
    // console.log(inActiveUsers);

    // Permanently (Force) delete the in active users
    if (inActiveUsers.length > 0) {
      for (const user of inActiveUsers) {
        await user.destroy({force: true});
      }
      console.log(`${inActiveUsers.length} in active users deleted`);
    } else {
      console.log("No in active users to delete");
    }
  });
}
