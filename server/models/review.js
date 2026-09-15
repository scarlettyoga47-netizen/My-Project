module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('normal', 'removed'),
      allowNull: false,
      defaultValue: 'normal'
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Review.associate = function(models) {
    Review.belongsTo(models.Merchant, { foreignKey: 'merchant_id', as: 'merchant' });
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Review.hasMany(models.ReviewImage, { foreignKey: 'review_id', as: 'images' });
    Review.hasMany(models.ReviewLike, { foreignKey: 'review_id', as: 'likes' });
    Review.hasMany(models.Report, { foreignKey: 'review_id', as: 'reports' });
  };

  return Review;
};
