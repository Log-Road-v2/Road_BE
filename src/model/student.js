const Sequelize = require("sequelize");

class Student extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: Sequelize.BIGINT,
          allowNull: true,
          unique: true
        },
        name: {
          type: Sequelize.STRING(6),
          allowNull: false
        },
        generation: {
          type: Sequelize.STRING(2),
          allowNull: false
        },
        grade: {
          type: Sequelize.STRING(1),
          allowNull: true
        },
        classNumber: {
          type: Sequelize.STRING(1),
          allowNull: true
        },
        studentNumber: {
          type: Sequelize.STRING(2),
          allowNull: true
        },
        state: {
          type: Sequelize.ENUM("SCHOOL", "GRADUATION", "LEAVE", "DROP", "KICK"),
          allowNull: false,
          defaultValue: "SCHOOL"
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
    Student.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
      onDelete: "SET NULL"
    });

    Student.hasMany(db.Member, {
      foreignKey: "studentId",
      sourceKey: "id"
    });
  }
}

module.exports = Student;
