module.exports = (sequelize, DataTypes) => {
  const Medication = sequelize.define(
    "Medication",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      addedBy: DataTypes.INTEGER,
    },
    { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
  );
  // User.associate = function (models) {
  //   User.belongsTo(models.Role);
  // };
  return Medication;
};
