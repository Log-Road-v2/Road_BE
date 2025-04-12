const Sequelize = require("sequelize");

class Feedback extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        projectId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        content: {
          type: Sequelize.STRING(100),
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
    Feedback.belongsTo(db.Project, {
      foreignKey: "projectId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  }
}

module.exports = Feedback;
