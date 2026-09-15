module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_slot: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'reservations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'merchant_id', 'date', 'time_slot']
      }
    ]
  });

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Reservation.belongsTo(models.Merchant, { foreignKey: 'merchant_id', as: 'merchant' });
  };

  return Reservation;
};
