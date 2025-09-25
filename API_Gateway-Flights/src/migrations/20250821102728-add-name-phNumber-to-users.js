'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up(queryInterface, Sequelize) {
    // ❌ remove this (already exists in table)
    // await queryInterface.addColumn('Users', 'name', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });

    // ✅ only add phNumber
    await queryInterface.addColumn('Users', 'phNumber', {
      type: Sequelize.STRING,
      allowNull: false,  // set true if optional
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'phNumber');
    // await queryInterface.removeColumn('Users', 'name'); // not needed
  }
};

