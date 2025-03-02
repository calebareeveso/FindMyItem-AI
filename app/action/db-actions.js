"use server";

import { ObjectId } from "mongodb";
import { db } from "../../lib/mongodb";

const deleteItem = async (deleteId) => {
  try {
    const result = await db
      .collection("thoughts")
      .deleteOne({ _id: ObjectId.createFromHexString(deleteId) });
    return JSON.stringify(result);
  } catch (e) {
    console.error("Server Error:", e);
    throw e; // It's good practice to rethrow the error after logging
  }
};
const claimItem = async (updateId) => {
  try {
    const inserted = await db.collection("thoughts").updateOne(
      { _id: ObjectId.createFromHexString(updateId) },
      // { _id: updateId },
      {
        $set: {
          claimed: true,
        },
      }
    );
    return JSON.stringify(inserted);
  } catch (e) {
    console.error("Server Error ", e);
  }
};

export { deleteItem, claimItem };
