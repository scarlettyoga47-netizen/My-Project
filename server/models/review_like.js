module.exports = (sequelize, DataTypes) => {
  const ReviewLike = sequelize.define('ReviewLike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'review_likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['review_id', 'user_id']
      }
    ]
  });

  ReviewLike.associate = function(models) {
    ReviewLike.belongsTo(models.Review, { foreignKey: 'review_id', as: 'review' });
    ReviewLike.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return ReviewLike;
};
