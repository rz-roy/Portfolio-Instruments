'use strict';
module.exports = (sequelize, DataTypes) => {
  const snapshots = sequelize.define('snapshots', {
    title: DataTypes.STRING(30),
    portfolioBenchmark: DataTypes.STRING(30),
    stockTotal: DataTypes.DECIMAL,
    fixedTotal: DataTypes.DECIMAL,
    realTotal: DataTypes.DECIMAL,
    cashTotal: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    notes: DataTypes.STRING,
    userId: DataTypes.INTEGER,

  }, {});
  snapshots.associate = function(models) {
    // Associations
    snapshots.hasMany(models.accounts);
    snapshots.belongsTo(models.users);
  };
  return snapshots;
};