const { StatusCodes } = require("http-status-codes");
const Project = require("../model/projects");

const getAllProjects = async (req, res) => {
  res.send("Get all projects");
};

const getProject = async (req, res) => {
  const { id: projectId } = req.params;
  res.send(`get single project with id : ${projectId}`);
};

const createNewProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(StatusCodes.CREATED).json({ project });
};

const editProject = async (req, res) => {
  const { id: projectId } = req.params;
  res.send(`Edit project with id : ${projectId} `);
};

const deleteProject = async (req, res) => {
  const { id: projectId } = req.params;
  res.send(`Delete project with id : ${projectId}`);
};

module.exports = {
  getAllProjects,
  getProject,
  createNewProject,
  editProject,
  deleteProject,
};
