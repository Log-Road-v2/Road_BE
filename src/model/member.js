const Sequelize = require("sequelize");

class Member extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        studentId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        projectId: {
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
    Member.belongsTo(db.Student, {
      foreignKey: "studentId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
    Member.belongsTo(db.Project, {
      foreignKey: "projectId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  }
}

module.exports = Member;
