const router = require("express").Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();

// URL: /api/v1/robots

router.get(`/`, async (req, res) => {
  const robots = await prisma.robot.findMany();
  res.status(200).send(robots);
});

router.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  const robot = await prisma.robot.findUnique({
    where: {
      id: Number(id)
    }
  });
  res.status(200).send(robot);
});

router.use((req, res, next) => {
  if (req.user === null) {
    res.sendStatus(401);
  } else next();
});

router.post(`/`, async (req, res) => {
  const { name, color, userId } = req.body;
  const robot = await prisma.robot.create({
    data: {
      name,
      color,
      userId: Number(userId)
    }
  });
  res.status(201).send(robot);
});

router.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const { name, color, userId } = req.body;
  const robot = await prisma.robot.update({
    where: {
      id: Number(id),
      userId: req.user.id
    },
    data: {
      name,
      color,
      userId: Number(userId)
    }
  });
  res.status(200).send(robot);
});

router.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const robot = await prisma.robot.delete({
    where: {
      id: Number(id),
      userId: req.user.id
    }
  });
  res.status(200).send(robot);
});

module.exports = router;
