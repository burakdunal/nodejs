const { Blog, BlogCategories, Resume, ResumeCategories } = require("../data/models/models");

module.exports = function(){
  // const myConfig = require("../core/myConfig");
  const dbConn = require("../data/database");
  const dummyData = require("../data/dummy-data.js");

  // const Resume = require("../models/resume");
  // const ResumeCategories = require("../models/resumeCategories");
  // const Blog = require("../models/blog.js");
  // const BlogCategories = require("../models/blogCategories.js");
  
  // const { Blog, BlogCategories, Resume, ResumeCategories } = models;

  Resume.belongsToMany(ResumeCategories, { through: "resumeCategoryRel" });
  ResumeCategories.belongsToMany(Resume, { through: "resumeCategoryRel" });
  
  Blog.belongsToMany(BlogCategories, { through: "blogCategoryRel" });
  BlogCategories.belongsToMany(Blog, { through: "blogCategoryRel" });

  (async () => {
      await dbConn.sync(); //{ force: true}
      // await dummyData();
  })();
};