const Sequelize = require("sequelize");

class AwardProject extends Sequelize.Model {
  static initiate(seuqelize) {
    super.init(
      {
        projectId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        awardId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true
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
    AwardProject.belongsTo(db.Project, {
      foreignKey: "projectId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
    AwardProject.belongsTo(db.Award, {
      foreignKey: "awardId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  }
}

module.exports = AwardProject;
