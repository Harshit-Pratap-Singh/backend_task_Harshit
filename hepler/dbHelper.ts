// -------------REDIS----------------

const redis = require("redis");
const url = process.env.REDISURL || "redis://localhost:6379";
const redisClient = redis.createClient({ url });
redisClient
  .connect()
  .then(() => {
    console.log("redis connected");
  })
  .catch((err: any) => {
    console.log(err);
  });

// ------------------------MONGODB---------------

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err: any) => {
    console.log(err);
  });

import { BACKEND_TASK_HARSHIT } from "../model";

const sendToDb = async (task: Array<string>) => {
  try {
    const db = await BACKEND_TASK_HARSHIT.findOne();
    if (db != null) {
      let temp = db.tasks;
      db.tasks = [...temp, ...task];
      await db.save();
    } else {
      const ne = new BACKEND_TASK_HARSHIT({
        tasks: task,
      });
      await ne.save();
    }
  } catch (err) {
    console.log(err);
  }
};

export const addElement = async (data: string) => {
  try {
    let task = await redisClient.get("BACKEND_TASK_HARSHIT");

    if (task != null) {
      //   console.log("as", task);
      let parsed = JSON.parse(task);
      parsed = [...parsed, data];
      console.log(parsed.length);

      if (parsed.length > 50) {
        await sendToDb(parsed);
        redisClient.del("BACKEND_TASK_HARSHIT");
      } else {
        redisClient.set("BACKEND_TASK_HARSHIT", JSON.stringify(parsed));
      }
    } else {
      task = JSON.stringify([data]);
      redisClient.set("BACKEND_TASK_HARSHIT", task);
    }
  } catch (err) {
    console.log("askdhsaj", err);
  }
};

export const getAllTasks = async () => {
  try {
    const t1 = await BACKEND_TASK_HARSHIT.findOne();
    const t2 = JSON.parse(await redisClient.get("BACKEND_TASK_HARSHIT"));
    let result: any = [];
    if (t1) result = [...t1.tasks];
    if (t2) result = [...result, ...t2];
    return result;
  } catch (error) {
    console.log(error);
  }
};


