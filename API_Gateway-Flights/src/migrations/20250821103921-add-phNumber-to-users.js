'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'phNumber', {
  type: Sequelize.STRING,
  allowNull: true,   // ✅ allow null so migration works on existing rows
  unique: true,
});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'phNumber');
  }
};

