const Sequelize = require("sequelize");
const config = require("../config/config");

const User = require("./user");
const Student = require("./student");
const Contest = require("./contest");
const Award = require("./award");
const Project = require("./project");
const Feedback = require("./feedback");
const Member = require("./member");
const AwardProject = require("./awardProject");
const Vote = require("./vote");
const Mark = require("./mark");

const db = {};
const sequelize = new Sequelize({ ...config, sync: false });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Student = Student;
db.Contest = Contest;
db.Award = Award;
db.Project = Project;
db.Feedback = Feedback;
db.Member = Member;
db.AwardProject = AwardProject;
db.Vote = Vote;
db.Mark = Mark;

User.initiate(sequelize);
Student.initiate(sequelize);
Contest.initiate(sequelize);
Award.initiate(sequelize);
Project.initiate(sequelize);
Feedback.initiate(sequelize);
Member.initiate(sequelize);
AwardProject.initiate(sequelize);
Vote.initiate(sequelize);
Mark.initiate(sequelize);

User.associate(db);
Student.associate(db);
Contest.associate(db);
Award.associate(db);
Project.associate(db);
Feedback.associate(db);
Member.associate(db);
AwardProject.associate(db);
Vote.associate(db);
Mark.associate(db);

module.exports = db;
