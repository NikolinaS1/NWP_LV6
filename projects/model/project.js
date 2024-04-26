const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  completed_jobs: String,
  start_date: Date,
  end_date: Date,
  members: [String],
});

module.exports = mongoose.model("Project", projectSchema);
