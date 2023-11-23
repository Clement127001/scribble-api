const router = require("express").Router();

const authenticationMiddleware = require("../middleware/authenticate");

const {
  getAllProjects,
  getProject,
  createNewProject,
  editProject,
  deleteProject,
} = require("../controller/projects");

router
  .route("/")
  .get(getAllProjects)
  .post(authenticationMiddleware, createNewProject);
router
  .route("/:id")
  .get(getProject)
  .patch(authenticationMiddleware, editProject)
  .delete(authenticationMiddleware, deleteProject);

module.exports = router;
