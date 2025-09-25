'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('IdempotencyKeys', 'expiresAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // default to now
    });

    // Optional: update existing rows to 1 day later
    await queryInterface.sequelize.query(
      `UPDATE IdempotencyKeys SET expiresAt = NOW() + INTERVAL 1 DAY WHERE expiresAt IS NULL`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('IdempotencyKeys', 'expiresAt');
  }
};
