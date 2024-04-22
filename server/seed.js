const { faker } = require("@faker-js/faker");
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const bcrypt = require(`bcrypt`);

const createUser = async () => {
  return await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      password: await bcrypt.hash(faker.internet.password(), 10)
    }
  });
};

const createRobot = async (userId) => {
  return await prisma.robot.create({
    data: {
      name: faker.person.firstName(),
      color: faker.color.human(),
      userId
    }
  });
};

const syncAndSeed = async () => {
  try {
    for (let i = 1; i <= 3; i++) {
      await createUser();
      console.log(`CREATE USER`);

      for (let j = 0; j < 3; j++) {
        await createRobot(i);
        console.log(`CREATE ROBOT FOR USER #${i}`);
      }
    }

    console.log(`\nSEED SUCCESS!`);
  } catch (error) {
    console.log(`ERROR IN syncAndSeed():`, error);
  } finally {
    prisma.$disconnect();
    console.log(`PRISMA DISCONNECTED!\n`);
  }
};

syncAndSeed();
