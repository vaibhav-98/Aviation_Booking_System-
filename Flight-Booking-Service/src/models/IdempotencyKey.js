// models/idempotencyKey.js
module.exports = (sequelize, DataTypes) => {
  const IdempotencyKey = sequelize.define("IdempotencyKey", {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    response: {
      type: DataTypes.JSON,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
    }
  });

  return IdempotencyKey;
};
