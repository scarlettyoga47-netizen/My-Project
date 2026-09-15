module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'merchant', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('normal', 'banned'),
      allowNull: false,
      defaultValue: 'normal'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = function(models) {
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
    User.hasMany(models.Merchant, { foreignKey: 'user_id', as: 'merchants' });
    User.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
    User.hasMany(models.Reservation, { foreignKey: 'user_id', as: 'reservations' });
    User.hasMany(models.MerchantApplication, { foreignKey: 'user_id', as: 'applications' });
    User.hasMany(models.ReviewLike, { foreignKey: 'user_id', as: 'reviewLikes' });
    User.hasMany(models.Report, { foreignKey: 'user_id', as: 'reports' });
    User.hasMany(models.Report, { foreignKey: 'handler_id', as: 'handledReports' });
    User.hasMany(models.MerchantApplication, { foreignKey: 'reviewer_id', as: 'reviewedApplications' });
  };

  return User;
};
