module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    handler_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    handled_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Report.associate = function(models) {
    Report.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Report.belongsTo(models.Review, { foreignKey: 'review_id', as: 'review' });
    Report.belongsTo(models.User, { foreignKey: 'handler_id', as: 'handler' });
  };

  return Report;
};
