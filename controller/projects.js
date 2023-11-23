const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../errors");
const Project = require("../model/projects");
const User = require("../model/user");

const getAllProjects = async (req, res) => {
  res.send("Get all projects");
};

const getProject = async (req, res) => {
  const { id: projectId } = req.params;
  const project = await Project.findOne({ _id: projectId });

  if (!project) throw new NotFoundError("Project not found");

  const { createdBy } = project;

  const foundUser = await User.findOne({ _id: createdBy });

  // console.log(foundUser);

  const { _id: userId, profile, name: username, role } = foundUser;

  const user = { userId, username, profile, role };

  const foundMoreProjects = await Project.find({ createdBy });

  const moreProjects = foundMoreProjects.map((proj) => {
    if (proj._id == projectId) {
      return;
    }
    return {
      images: proj.images,
      projectId: proj._id,
      category: proj.category,
    };
  });

  res.status(StatusCodes.OK).json({ project, user, moreProjects });
};

const createNewProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(StatusCodes.CREATED).json({ project });
};

const editProject = async (req, res) => {
  const {
    params: { id: projectId },
    user: { userId },
    body: { name, description, images, category, githubUrl, livesiteUrl },
  } = req;

  if (!userId) throw new UnauthorizedError("Unauthorised access");

  if (
    (!name && name === "") ||
    (!description && description === "") ||
    (!images && images === "") ||
    (!category && category === "") ||
    (!githubUrl && githubUrl == "") ||
    (!livesiteUrl && livesiteUrl == "")
  )
    throw new BadRequestError("Please provide value");

  const updatedProject = await Project.findByIdAndUpdate(
    { _id: projectId, createdBy: userId },
    req.body,
    {
      new: true,
      runvalidators: true,
    }
  );

  if (!updatedProject)
    throw new NotFoundError(`No Project is found with ${projectId} id`);

  res.status(StatusCodes.OK).json({ project: updatedProject });
};

const deleteProject = async (req, res) => {
  const {
    params: { id: projectId },
    user: { userId },
  } = req;

  if (!userId) throw new UnauthorizedError("Unauthorised access");

  const project = await Project.findByIdAndDelete({
    _id: projectId,
    createdBy: userId,
  });

  if (!project)
    throw new NotFoundError(`No Project is found with ${projectId} id`);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Project is delsted", deletedProject: project });
};

module.exports = {
  getAllProjects,
  getProject,
  createNewProject,
  editProject,
  deleteProject,
};
