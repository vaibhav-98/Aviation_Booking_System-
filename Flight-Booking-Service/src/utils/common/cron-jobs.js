const cron = require("node-cron");
const { cancelOldBookings } = require("../../services/booking-service");
const { IdempotencyKey } = require("../../models");
const { Op } = require("sequelize");

function scheduleCrons() {
  /**
   *  Run every 20 minutes:
   * Cancels old bookings that expired (older than 5 minutes & not booked/cancelled)
   */
  cron.schedule("*/20 * * * *", async () => {
    console.log(" Booking cleanup cron started...");
    try {
      const expiredBookings = await cancelOldBookings();
      if (expiredBookings?.length > 0) {
        console.log(`  Cancelled ${expiredBookings.length} expired bookings`);
      }
    } catch (err) {
      console.error(" Booking cleanup error:", err.message);
    }
  });

  /**
   *  Run every day at midnight:
   * Deletes expired idempotency keys from DB
   */
  cron.schedule("*/0 0 * * *", async () => {
    console.log(" Idempotency cleanup cron started...");
    try {
      const deleted = await IdempotencyKey.destroy({
        where: {
          expiresAt: { [Op.lt]: new Date() }, // delete expired
        },
      });
      if (deleted > 0) {
        console.log(` Cleaned up ${deleted} expired idempotency keys`);
      }
    } catch (err) {
      console.error(" Error cleaning idempotency keys:", err.message);
    }
  });
}

module.exports = scheduleCrons;
