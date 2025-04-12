const Sequelize = require("sequelize");

class Project extends Sequelize.Model {
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
        writerId: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        projectName: {
          type: Sequelize.STRING(30),
          allowNull: false
        },
        authorCategory: {
          type: Sequelize.ENUM("PERSONAL", "TEAM"),
          allowNull: false
        },
        teamName: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        skills: {
          type: Sequelize.STRING(600),
          allowNull: true
        },
        introduction: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true
        },
        vedio: {
          type: Sequelize.STRING,
          allowNull: true
        },
        state: {
          type: Sequelize.ENUM("WRITING", "PENDING", "APPROVAL", "REJECTED", "MODIFY"),
          allowNull: false,
          defaultValue: "WRITING"
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
    Project.belongsTo(db.User, {
      foreignKey: "writerId",
      targetKey: "id",
      onDelete: "SET NULL"
    });

    Project.belongsTo(db.Contest, {
      foreignKey: "contestId",
      targetKey: "id",
      onDelete: "CASCADE"
    });

    Project.hasMany(db.Member, {
      foreignKey: "projectId",
      sourceKey: "id"
    });

    Project.hasMany(db.AwardProject, {
      foreignKey: "projectId",
      sourceKey: "id"
    });

    Project.hasOne(db.Feedback, {
      foreignKey: "projectId",
      sourceKey: "id"
    });

    Project.hasMany(db.Vote, {
      foreignKey: "projectId",
      sourceKey: "id"
    });

    Project.hasMany(db.Mark, {
      foreignKey: "projectId",
      sourceKey: "id"
    });
  }
}

module.exports = Project;
