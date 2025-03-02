"use client";

import { useState } from "react";
import { addLostItem, getLostItems } from "./action/ai-actions";
import { RotatingLines } from "./loader/rotating-lines";
import Logo from "../components/logo";
import { SmoothPopup } from "../components/modal";
import Link from "next/link";

export default function LostAndFound() {
  const [currentView, setCurrentView] = useState("search");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [foundItems, setFoundItems] = useState([]);

  const [ownershipVerified, setOwnershipVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [ownerEmailAddress, setOwnerEmailAddress] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  //

  const [searchError, setSearchError] = useState("");
  //
  // Handle the first form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (description.trim()) {
      const found = await getLostItems(description);
      const items = JSON.parse(found);
      if (items.length > 0) {
        setLoading(false);
        console.log({ items });
        setFoundItems(items);
        setCurrentView("select");
      } else {
        setLoading(false);
        setSearchError(`Could not find: ${description}`);
      }
    }
  };

  // Handle image selection
  const handleImageSelect = (item) => {
    setSelectedItem(item);
    setCurrentView("verify");
  };

  // Handle send email form submission
  const handleSendEmail = (e) => {
    e.preventDefault();
    console.log("ownerEmailAddress: ", ownerEmailAddress);

    setEmailSent(true);
  };

  // Handle verification form submission
  const handleVerify = (e) => {
    e.preventDefault();
    if (
      securityQuestionAnswer.trim().toLowerCase() ==
      selectedItem.answer.toLowerCase()
    ) {
      // Here you would typically handle the verification logic
      // alert("Verification submitted successfully!");
      // Reset the form and go back to the first view
      setDescription("");
      // setSelectedItem(null);
      setSecurityQuestionAnswer("");
      // setCurrentView("search");
      setOwnershipVerified(true);
    } else {
      setVerificationError("Incorrect Answer!");
      setTimeout(() => {
        setVerificationError("");
      }, 2000);
    }
  };

  //
  const createAndOpenMailtoLink = (selectedItem) => {
    if (!selectedItem || !selectedItem.imageUrl || !selectedItem.thoughts) {
      console.error("selectedItem is missing imageUrl or thoughts.");
      return;
    }

    const thoughtsEncoded = encodeURIComponent(selectedItem.thoughts);
    const bodyEncoded = encodeURIComponent(
      `Please see this image of my lost item: ${selectedItem.imageUrl}\n What do I do next?`
    );

    const mailtoLink = `mailto:river@tfl.gov.uk?subject=Claim: ${thoughtsEncoded}&body=${bodyEncoded}`;
    window.location.href = mailtoLink;
  };

  //

  // Search view
  if (currentView === "search") {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-3 px-2 py-1 bg-primary-background text-white font-display flex items-center space-x-2">
          <span>
            <Logo />
          </span>
          <span>FindMyItem AI</span>
        </h1>
        <form
          onSubmit={handleSearch}
          className="bg-secondary-background px-3 pb-4 pt-1 "
        >
          <label
            htmlFor="description"
            className="block text-lg mb-2 font-display"
          >
            Describe the item you lost
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-primary-border mb-4"
            required
          />
          <button
            disabled={loading}
            style={{
              opacity: loading ? 0.8 : 1,
            }}
            type="submit"
            className="w-full primary-button font-display flex space-x-2 items-center justify-center"
          >
            {loading && (
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

            <span>{loading ? "Finding..." : "Find"}</span>
          </button>

          {searchError && (
            <div>
              <p className="text-center font-display text-bold text-red-500">
                {" "}
                {searchError}
              </p>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Select item view
  if (currentView === "select") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-display font-bold  px-2 py-1 bg-primary-background text-white mb-3">
          Select your lost item
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-secondary-background px-2 py-2">
          {foundItems
            .filter(({ imageUrl }) => imageUrl !== undefined)
            .map((item) => (
              <div
                key={item.imageUrl}
                onClick={() => handleImageSelect(item)}
                className="cursor-pointer  border border-primary-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  // alt={`Lost item ${id}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
        </div>
        <div>
          <button
            onClick={() => {
              setCurrentView("search");
              setDescription("");
            }}
            className="mt-2 flex space-x-0 items-center font-display text-primary-text"
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
    );
  }

  // Verify ownership view
  if (currentView === "verify") {
    return (
      <div>
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-3xl font-display font-bold  px-2 py-1 bg-primary-background text-white mb-6">
            Verify ownership
          </h1>
          <form
            onSubmit={handleVerify}
            className="bg-secondary-background px-3 pb-4 pt-1 "
          >
            <div className="border  overflow-hidden relative mb-1">
              <img
                src={selectedItem.imageUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-contain"
              />
            </div>
            <label
              htmlFor="securityQuestionAnswer"
              className="block text-lg mb-2 font-display"
            >
              {selectedItem.question}
            </label>
            <input
              type="text"
              id="securityQuestionAnswer"
              value={securityQuestionAnswer}
              onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
              className="w-full p-2 border border-primary-border mb-4"
              required
            />
            <button
              type="submit"
              className="w-full primary-button font-display flex space-x-2 items-center justify-center"
            >
              Submit
            </button>

            {verificationError && (
              <div className="py-2">
                <p className="text-center font-display text-bold text-red-500">
                  {" "}
                  {verificationError}
                </p>
              </div>
            )}
          </form>
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setCurrentView("select");
              }}
              className="mt-2 flex space-x-0 items-center font-display text-primary-text"
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

            <button
              // href="mailto:river@tfl.gov.uk"
              onClick={() => createAndOpenMailtoLink(selectedItem)}
              className="mt-2 flex space-x-0 items-center font-display text-primary-text"
            >
              <span className="">Can't Answer? Contact Us</span>
            </button>
          </div>
        </div>

        {/*  */}
        <SmoothPopup
          isOpen={ownershipVerified}
          onClose={() => setOwnershipVerified(false)}
          className={
            "bg-secondary-background min-w-[22rem] border-secondary p-3 shadow-md border border-primary-border"
          }
        >
          <h1 className="text-3xl font-display font-bold  px-2 py-1 bg-primary-background text-white mb-3">
            Ownership Verified!
          </h1>
          <form
            onSubmit={handleSendEmail}
            className="bg-secondary-background px-3 pb-4 pt-1 "
          >
            {emailSent !== true ? (
              <div>
                <label
                  htmlFor="securityQuestionAnswer"
                  className="block text-lg mb-2 font-display"
                >
                  Your Email Address
                </label>

                <input
                  type="email"
                  id="securityQuestionAnswer"
                  value={ownerEmailAddress}
                  onChange={(e) => setOwnerEmailAddress(e.target.value)}
                  className="w-full p-2 border border-primary-border mb-4"
                  placeholder="example@gmail.com"
                  required
                />
                <button
                  type="submit"
                  className="w-full primary-button font-display flex space-x-2 items-center justify-center"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div>
                <p className="text-center py-2 font-display text-primary-text text-balance">
                  Submitted! Check your Email for next Step!
                </p>

                <div className="flex justify-around">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setCurrentView("search");
                      setOwnershipVerified(false);
                    }}
                    className="mt-2 flex space-x-0 items-center font-display text-primary/50"
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
            )}
          </form>
        </SmoothPopup>
      </div>
    );
  }
}
