const Sequelize = require("sequelize");

class Mark extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.BIGINT,
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
    Mark.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
    Mark.belongsTo(db.Project, {
      foreignKey: "projectId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  }
}

module.exports = Mark;
