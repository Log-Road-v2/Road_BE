const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING(32),
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING(6),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM("STUDENT", "TEACHER", "ADMIN"),
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
    User.hasOne(db.Student, {
      foreignKey: "userId",
      sourceKey: "id"
    });

    User.hasMany(db.Vote, {
      foreignKey: "userId",
      sourceKey: "id"
    });

    User.hasMany(db.Mark, {
      foreignKey: "userId",
      sourceKey: "id"
    });
  }
}

module.exports = User;
