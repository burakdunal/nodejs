module.exports = function(){
    const myConfig = require("../core/myConfig");
    const dbconn = require("../data/database");
    const dummyData = require("../data/dummy-data");

    const Category = require("../models/category");
    const Blog = require("../models/blog");
    const User = require("../models/user");
    const Role = require("../models/role");
    const AppLogs = require("../models/app-logs");

    Blog.belongsTo(User, {
        foreignKey: {
            allowNull: true
        }
    });
    User.hasMany(Blog);
    Blog.belongsToMany(Category, { through: "blogCategory"});
    Category.belongsToMany(Blog, { through: "blogCategory"});
    
    Role.belongsToMany(User, {through: "userRoles"});
    User.belongsToMany(Role, {through: "userRoles"});
    
    (async () => {
        // await dbconn.sync({ force: true});
        // await dummyData();
    })();
};