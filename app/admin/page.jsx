"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { describeImage } from "../action/actions";
import { uploadImageToS3 } from "../action/upload-media";
import { RotatingLines } from "../loader/rotating-lines";
import { addLostItem, getLostItems } from "../action/ai-actions";
import { SmoothPopup } from "../../components/modal";
import Link from "next/link";

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        opacity: pending ? 0.8 : 1,
      }}
      className="w-full primary-button font-display flex space-x-2 items-center justify-center"
    >
      {pending && (
        <RotatingLines
          visible={true}
          // height="40"
          width="20"
          strokeColor="#FFFFFF8d"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      )}

      <span> {pending ? "Processing..." : "Submit"}</span>
    </button>
  );
}

export default function AuthImageComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  //
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  // Check if user is logged in on component mount
  useEffect(() => {
    setLoadingScreen(true);
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
    setLoadingScreen(false);
  }, []);

  // Handle login
  const handleLogin = () => {
    if (password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  // Handle image upload
  const [imageDescription, setImageDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  //
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  //
  const [itemAdded, setItemAdded] = useState(false);
  //
  const handleImageUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    const formData = new FormData();
    formData.append("media", file, file.name);
    formData.append("type", "image");

    const mediaURL = await uploadImageToS3(formData);
    console.log("====================================");
    console.log("mediaURL: ", mediaURL);
    console.log("====================================");

    const result = await describeImage(mediaURL);
    setDescription(result);
    console.log("Image description:", result);
    setImageDescription(result);
    setImageUrl(mediaURL);

    // setTimeout(async () => {
    //   const found = await getLostItems(result);

    //   console.log(JSON.parse(found));
    // }, 2000);

    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // e.preventDefault()
    const added = await addLostItem(
      imageDescription,
      imageUrl,
      securityQuestion,
      securityAnswer
    );

    setItemAdded(true);
  };

  // Password component
  if (!isLoggedIn) {
    return loadingScreen ? (
      <div className="absolute inset-0 flex items-center justify-center">
        <RotatingLines
          visible={true}
          // height="40"
          width="20"
          strokeColor="#00000044"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 max-w-md mx-auto">
        <div className="bg-secondary-background px-3 pb-4 pt-1 ">
          <label htmlFor="password" className="block text-lg mb-2 font-display">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-primary-border mb-4"
            placeholder="Enter password"
          />
          <button
            onClick={handleLogin}
            className="w-full primary-button font-display flex space-x-2 items-center justify-center"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Image upload component
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 max-w-md mx-auto">
      <div className="flex justify-end flex-grow w-full mb-2">
        <Link
          href="/admin/items"
          className="mt-0 mb-1 flex space-x-0 items-center font-display text-primary/50 text-sm"
        >
          <span className="">Lost Items</span>

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.5 11.5L10 8L6.5 4.5" stroke="currentColor" />
          </svg>
        </Link>
      </div>
      <div className="flex-grow w-full">
        <h1 className="text-3xl font-display font-bold  px-2 py-1 bg-primary-background text-white mb-6 w-full">
          Add Lost Item
        </h1>
      </div>
      <form action={handleSubmit} className="w-full">
        {!imagePreview ? (
          <div
            className="border-2 border-dashed border-primary-border bg-secondary-background p-12 py-24 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("image-upload").click()}
          >
            <input
              type="file"
              id="image-upload"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-gray-500">Click to upload an image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border  overflow-hidden relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-contain"
              />

              {loading ? (
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <RotatingLines
                    visible={true}
                    // height="40"
                    width="20"
                    strokeColor="#fff"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setDescription("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 absolute bottom-2 right-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    class="lucide lucide-rotate-ccw"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              )}
            </div>
            {/* <div className="flex justify-between items-center">
              <SubmitButton />
            </div> */}
          </div>
        )}

        {description && (
          <div className="mt-6 p-4 bg-gray-100  w-full">
            <h3 className="font-normal font-sans mb-1 opacity-45">
              Image Description:
            </h3>
            <p className="font-sans text-sm text-primary-text underline">
              {description}
            </p>
          </div>
        )}
        {imageDescription !== "" && imageUrl !== "" && (
          <div className="bg-secondary-background px-3 pb-4 pt-1 ">
            <label
              htmlFor="description"
              className="block text-lg mb-2 font-display"
            >
              Security Question & Answer From Item
            </label>
            <input
              type="text"
              id="description"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full p-2 border border-primary-border mb-4"
              placeholder="Unique question"
              required
            />
            <input
              type="text"
              id="description"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full p-2 border border-primary-border mb-4"
              placeholder="Unique answer to question"
              required
            />
            <div className="mt-2">
              <SubmitButton />
            </div>
          </div>
        )}
      </form>

      <SmoothPopup
        isOpen={itemAdded}
        onClose={() => setItemAdded(false)}
        className={
          "bg-secondary-background min-w-[22rem] border-secondary p-3 shadow-md border border-primary-border"
        }
      >
        <h1 className="text-3xl font-display font-bold  px-2 py-1 bg-primary-background text-white mb-3">
          Item Added!
        </h1>

        <div>
          <p className="text-center py-2 font-display text-primary-text text-balance">
            Lost item reported. Waiting for claim.
          </p>

          <div className="flex justify-around">
            <button
              onClick={() => {
                setDescription("");
                setImageDescription("");
                setImageUrl("");
                setImage(null);
                setImagePreview(null);
                setItemAdded(false);
                setSecurityQuestion("");
                setSecurityAnswer("");
              }}
              className="mt-2 mb-2 flex space-x-0 items-center font-display text-primary/50"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.5 4.5L6 8L9.5 11.5" stroke="currentColor" />
              </svg>
              <span className="">Back</span>
            </button>
          </div>
        </div>
      </SmoothPopup>
    </div>
  );
}
