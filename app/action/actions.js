"use server";
import Replicate from "replicate";

// Server action to process the image
async function describeImage(imageUrl) {
  //   const imageFile = formData.get("image");
  //   if (!imageFile) return "No image provided";

  //   // Create a temporary URL for the image
  //   const bytes = await imageFile.arrayBuffer();
  //   const buffer = Buffer.from(bytes);

  // In a real app, you'd upload this to a storage service and get a URL
  // For demo purposes, we'll assume we have a URL
  //   const imageUrl =
  //     "https://example.com/custom-nike-air-force-1-low-by-you-shoes.png";

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    // const output = await replicate.run(
    //   "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    //   {
    //     input: {
    //       task: "image_captioning",
    //       image: imageUrl,
    //     },
    //   }
    // );

    const output = await replicate.run(
      "lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31",
      {
        input: {
          image: imageUrl,
          prompt:
            "Describe in full detail JUST the primary subject item on this image, do not mention the surrounding, just the primary subject item. Start with 'A...'",
        },
      }
    );

    console.log(output.join(""));
    return output.join("");
  } catch (error) {
    console.error("Error describing image:", error);
    return "Error processing image";
  }
}

export { describeImage };
