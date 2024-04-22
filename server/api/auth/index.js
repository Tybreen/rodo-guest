const router = require(`express`).Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");

// URL: /auth

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10)
      }
    });

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (!user) {
      res.status(401).send("Invalid login credentials.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).send("Invalid login credentials.");
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
