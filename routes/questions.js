const Router = require("express-promise-router");
const Question = require("../db/models/Question");

const router = new Router();

router.get("/", async (req, res, next) => {
  const diff = req.query.difficulty;
 
  try {
    const total = await Question.countDocuments({category: diff});
    const rand = Math.floor(Math.random() * total);
    const question = await Question.findOne({category: diff}).skip(rand)
    res.json(question);
    } catch (err) {
    console.error(err);
    next(err);
  };
});

router.delete("/:id", async (req, res, next) => {
  const id = req.query.id

  try {
    const deleted = Question.deleteOne({id: id});
    res.json(deleted);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
