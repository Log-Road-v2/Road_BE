const Sequelize = require("sequelize");

class Award extends Sequelize.Model {
  static initiate(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        contestId: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING(24),
          allowNull: false
        },
        awardCount: {
          type: Sequelize.INTEGER,
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
    Award.belongsTo(db.Contest, {
      foreignKey: "contestId",
      targetKey: "id",
      onDelete: "CASCADE"
    });

    Award.hasMany(db.AwardProject, {
      foreignKey: "awardId",
      sourceKey: "id"
    });
  }
}

module.exports = Award;
