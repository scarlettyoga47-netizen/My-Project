module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define('Merchant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value || []));
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    business_hours: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'closed'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'merchants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Merchant.associate = function(models) {
    Merchant.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    Merchant.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Merchant.hasMany(models.Review, { foreignKey: 'merchant_id', as: 'reviews' });
    Merchant.hasMany(models.Reservation, { foreignKey: 'merchant_id', as: 'reservations' });
    Merchant.hasMany(models.Favorite, { foreignKey: 'merchant_id', as: 'favorites' });
  };

  return Merchant;
};
