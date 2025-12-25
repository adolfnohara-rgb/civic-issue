const Issue = require("../models/Issue");

// CREATE ISSUE (Citizen)
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } =
      req.body;
    const imageUrl = req.file.path;

    const issue = await Issue.create({
      title,
      description,
      category,
      imageUrl,
      location: {
        latitude,
        longitude,
      },
      reportedBy: req.user.id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ISSUES (Public)
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("reportedBy", "name");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MY ISSUES (Citizen)
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
