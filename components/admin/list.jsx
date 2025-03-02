"use client";
import React, { useEffect, useState } from "react";
import { claimItem, deleteItem } from "../../app/action/db-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RotatingLines } from "../../app/loader/rotating-lines";

const ListItems = ({ items }) => {
  const lostItems = JSON.parse(items);
  const [claiming, setClaiming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const submitClaim = async (id) => {
    setClaiming(true);
    await claimItem(id);
    router.refresh();
    setClaiming(false);
  };
  const deleteReportedItem = async (id) => {
    setDeleting(true);
    await deleteItem(id);
    router.refresh();
    setDeleting(false);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [password, setPassword] = useState("");
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
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 max-w-md mx-auto">
        <div className="flex-grow w-full">
          <h1 className="text-3xl font-display font-bold px-2 py-1 bg-primary-background text-white mb-6 w-full">
            Reported Lost Item ({lostItems.length})
          </h1>

          <Link
            href={"/admin"}
            className="mt-1 mb-2 flex space-x-0 items-center font-display text-primary-text"
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
          </Link>
        </div>

        {/* Claimed Items Section */}
        <details className="w-full mb-4 border rounded">
          <summary className="p-3 bg-gray-100 font-display font-bold cursor-pointer">
            Claimed Items (
            {lostItems.filter((item) => item.claimed === true).length})
          </summary>
          <div className="p-2">
            {lostItems
              .filter((item) => item.claimed === true)
              .map(({ imageUrl, thoughts, question, answer, _id }) => (
                <section key={_id} className="w-full mb-6 border-b pb-4">
                  <div className="space-y-4">
                    <div className="border overflow-hidden relative">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-0 p-4 bg-gray-100 w-full">
                    <h3 className="font-normal font-sans mb-1 opacity-45">
                      Image Description:
                    </h3>
                    <p className="font-sans text-sm text-primary-text underline">
                      {thoughts}
                    </p>
                  </div>
                  <div className="bg-secondary-background px-3 pb-4 pt-1">
                    <label
                      htmlFor="description"
                      className="block text-lg mb-2 font-display"
                    >
                      Security Question & Answer From Item
                    </label>
                    <p className="w-full p-2 border border-primary-border mb-4">
                      {question}
                    </p>
                    <p className="w-full p-2 border border-primary-border mb-4">
                      {answer}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            deleteReportedItem(_id);
                          }}
                          disabled={deleting}
                          style={{
                            opacity: deleting ? 0.8 : 1,
                          }}
                          className="w-fit text-red-500 font-display px-3"
                        >
                          <span>{deleting ? "Removing..." : "Remove"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            {lostItems.filter((item) => item.claimed === true).length === 0 && (
              <p className="text-center p-4 text-gray-500">No claimed items</p>
            )}
          </div>
        </details>

        {/* Unclaimed Items Section */}
        <details className="w-full mb-4 border rounded" open>
          <summary className="p-3 bg-gray-100 font-display font-bold cursor-pointer">
            Unclaimed Items (
            {lostItems.filter((item) => item.claimed !== true).length})
          </summary>
          <div className="p-2">
            {lostItems
              .filter((item) => item.claimed !== true)
              .map(({ imageUrl, thoughts, question, answer, _id }) => (
                <section key={_id} className="w-full mb-6">
                  <div className="space-y-4">
                    <div className="border overflow-hidden relative">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-0 p-4 bg-gray-100 w-full">
                    <h3 className="font-normal font-sans mb-1 opacity-45">
                      Image Description:
                    </h3>
                    <p className="font-sans text-sm text-primary-text underline">
                      {thoughts}
                    </p>
                  </div>
                  <div className="bg-secondary-background px-3 pb-4 pt-1">
                    <label
                      htmlFor="description"
                      className="block text-lg mb-2 font-display"
                    >
                      Security Question & Answer From Item
                    </label>
                    <p className="w-full p-2 border border-primary-border mb-4">
                      {question}
                    </p>
                    <p className="w-full p-2 border border-primary-border mb-4">
                      {answer}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            submitClaim(_id);
                          }}
                          disabled={claiming}
                          style={{
                            opacity: claiming ? 0.8 : 1,
                          }}
                          className="w-fit primary-button font-display flex space-x-2 items-center justify-center px-4"
                        >
                          <span>{claiming ? "Claiming..." : "Claim"}</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteReportedItem(_id);
                          }}
                          disabled={deleting}
                          style={{
                            opacity: deleting ? 0.8 : 1,
                          }}
                          className="w-fit text-red-500 font-display px-3"
                        >
                          <span>{deleting ? "Removing..." : "Remove"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            {lostItems.filter((item) => item.claimed !== true).length === 0 && (
              <p className="text-center p-4 text-gray-500">
                No unclaimed items
              </p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ListItems;
