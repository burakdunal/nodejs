const Admin = require("./admin");
const User = require("./user");
const Resume = require("./resume");
const ResumeCategories = require("./resumeCategories");
const Blog = require("./blog");
const BlogCategories = require("./blogCategories");

const models = {
  Admin,
  Blog,
  BlogCategories,
  Resume,
  ResumeCategories,
  User,
};

module.exports = models;