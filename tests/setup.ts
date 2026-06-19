import { beforeAll, beforeEach, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;

beforeAll(async () => {
  console.log = vi.fn();
  console.info = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

beforeEach(async () => {
  const collections = await mongoose.connection?.db?.collections();
  if (!collections) return;

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
