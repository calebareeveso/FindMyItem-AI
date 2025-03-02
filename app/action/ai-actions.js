"use server";

import { MongoClient, ObjectId } from "mongodb";
import axios from "axios";

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const db = client.db("deep_thoughts");
const collection = db.collection("thoughts");

async function getEmbedding(query) {
  // Define the OpenAI API url and key.
  const url = "https://api.openai.com/v1/embeddings";
  const openai_key = process.env.OPENAI_API_KEY; // Replace with your OpenAI key.

  // Call OpenAI API to get the embeddings.
  let response = await axios.post(
    url,
    {
      input: query,
      model: "text-embedding-ada-002",
    },
    {
      headers: {
        Authorization: `Bearer ${openai_key}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    return response.data.data[0].embedding;
  } else {
    throw new Error(`Failed to get embedding. Status code: ${response.status}`);
  }
}

async function findSimilarDocuments(embedding) {
  try {
    await client.connect();

    // Query for similar documents.
    const documents = await collection
      .aggregate([
        {
          $vectorSearch: {
            queryVector: embedding,
            path: "thoughts_embedding",
            numCandidates: 100,
            limit: 3,
            index: "deepThoughtsIndex",
          },
        },
        {
          $project: {
            thoughts_embedding: 0, // Exclude the 'thoughts_embedding' field
          },
        },
      ])
      .toArray();

    return documents;
  } finally {
    await client.close();
  }
}

async function addItem(data) {
  await client.connect();
  const result = await collection.insertOne(data);

  return result.insertedId;
}

const addLostItem = async (itemDescription, itemImageUrl, question, answer) => {
  const result = await addItem({
    thoughts: itemDescription,
    imageUrl: itemImageUrl,
    question,
    answer,
    claimed: false,
  });
  return JSON.stringify(result);
};

const getLostItems = async (description) => {
  const embedding = await getEmbedding(description);
  const documents = await findSimilarDocuments(embedding);

  return JSON.stringify(documents);
};

export { addLostItem, getLostItems };
