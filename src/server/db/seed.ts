import { config } from "dotenv";
import { faker } from "@faker-js/faker";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { ne } from "drizzle-orm";

config();

function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const name = faker.internet.username({
    firstName: firstName.toLocaleLowerCase(),
    lastName: lastName.toLocaleLowerCase(),
  });

  return {
    name,
    email: `${name}@example.com`,
  };
}

function img({
  altText,
  filepath,
  contentType = "image/jpeg",
}: {
  altText?: string;
  filepath: string;
  contentType?: string;
}): Omit<schema.InsertImage, "noteId"> {
  return {
    altText,
    contentType: contentType,
    imageSrc: filepath,
  };
}

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.images);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.notes);
  await db
    .delete(schema.users)
    .where(ne(schema.users.id, "0b54e518-fdf7-468a-abb9-72f3e38c0ce4"));
  console.timeEnd("🧹 Cleaned up the database...");

  // actually 6 users since my user is not deleted
  const totalUsers = 5;

  const noteImages = [
    img({
      altText: "photo of billie eillish",
      filepath:
        "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYpoXSfuUkJndrETYbQ2Kt1oCW04aOS9IFRfzm",
      contentType: "image/jpg",
    }),
    img({
      altText: "ahoter photo of billie eillish",
      filepath:
        "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYPRESCsmTdlE4Biw1ZAHfk9Uqx5tCS8LncGsy",
      contentType: "image/jpg",
    }),
    img({
      altText: "a box",
      filepath:
        "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYITuMvG0eHZxklXm03EKfLTczOyQDp4UNGtRi",
      contentType: "image/jpg",
    }),
    img({
      altText: "a perfume",
      filepath:
        "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYhP4ncSXl73tc4TkGBwLeMfRnsChqdYO2WuKz",
      contentType: "image/jpg",
    }),
    img({
      altText: "a sneaker",
      filepath:
        "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYrcqf4UizcdNlLqt6MoDCIhE1mHWvxQRGgeF4",
      contentType: "image/jpg",
    }),
  ];

  const userImages = [
    "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYpmFb3GUkJndrETYbQ2Kt1oCW04aOS9IFRfzm",
    "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupY6hiAxQLQV0uoEwtiATOdFByhn8rRCMP5gjeU",
    "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYFyUM7OC1NfeHhB7DodK34rtmAM6Ry0cUskLu",
    "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYYfg5br03q8xsr01ZMO4I3EpCbzDnQcB5LXtm",
    "https://adhigcpjh8.ufs.sh/f/HBjuELIBcupYngg2qYmRIH5Xtm4Ez2dfZCbNvhKwW3gGaJ68",
  ];

  for (let index = 0; index < totalUsers; index++) {
    await db.insert(schema.users).values({
      ...createUser(),
      image: userImages[index % 5],
    });
  }
  const users = await db.select().from(schema.users);

  for (const user of users) {
    const numNotes = Math.floor(Math.random() * 5) + 1;
    // 1-5 notes per user
    console.log(`Creating ${numNotes} notes for user ${user.name}`);

    for (let i = 0; i < numNotes; i++) {
      const [note] = await db
        .insert(schema.notes)
        .values({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          createdById: user.id,
          category: faker.helpers.arrayElement([
            "work",
            "personal",
            "ideas",
            "todos",
          ]),
        })
        .returning();

      const numImages = Math.floor(Math.random() * 3) + 1;
      // 1-3 images per note
      for (let j = 0; j < numImages; j++) {
        if (!note) return;
        await db.insert(schema.images).values({
          ...noteImages[
            faker.number.int({ min: 0, max: noteImages.length - 1 })
          ],
          noteId: note?.id,
          userId: user.id,
        });
      }
    }
  }

  console.timeEnd(`🌱 Database has been seeded`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
