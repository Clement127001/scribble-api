const User = require("../model/user");
const Projects = require("../model/projects");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");

const registerUser = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWTToken();

  res.status(StatusCodes.CREATED).json({ user, token });
};

//!!!!need to fix the user login compare password
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide username and password");
  }

  const user = await User.findOne({ email });

  // console.log(user);

  if (!user) throw new UnauthorizedError("User not found, please register");

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new UnauthorizedError("Unauthorized user");

  const token = user.createJWTToken();

  res.status(StatusCodes.OK).json({ name: user.name, token });
};

const showUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  const projects = await Projects.find({ createdBy: userId });

  const projectsList = projects.map((project) => {
    const { images, _id: projectId, category } = project;

    return { projectId, images, category };
  });
  if (!user)
    return res
      .send(StatusCodes.BAD_REQUEST)
      .send(`No user found with : ${userId} id`);

  res.status(StatusCodes.OK).json({ user, projects: projectsList });
};

module.exports = {
  loginUser,
  registerUser,
  showUser,
};
