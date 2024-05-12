module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      contactNumber: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      addedBy: DataTypes.INTEGER,
    },
    { timestamps: false, charset: "utf8", collate: "utf8_general_ci" }
  );

  return Customer;
};
