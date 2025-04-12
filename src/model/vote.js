const Sequelize = require("sequelize");

class Vote extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        projectId: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        userId: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        rank: {
          type: Sequelize.STRING(1),
          allowNull: false
        }
      },
      {
        sequelize,
        freezeTableName: true,
        timestamps: false,
        underscored: true,
        paranoid: false,
        charset: "utf8",
        getterMethods: "utf8_general_ci"
      }
    );
  }

  static associate(db) {
    Vote.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
    Vote.belongsTo(db.Project, {
      foreignKey: "projectId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  }
}

module.exports = Vote;
