"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const popupVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export function SmoothPopup({ isOpen, onClose, children, className }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="z-[999999999999999] fixed inset-0 flex items-center justify-around bg-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className={cn(
              "max-w-[22rem] sm:mx-6 rounded-[2px]  bg-white p-6 pb-4 pt-5 shadow-sm ",
              className
            )}
            variants={popupVariants}
            style={
              {
                // borderWidth: 2,
                // borderColor: "#000000",
              }
            }
          >
            <div style={{ position: "relative" }}>
              {children}

              {/* <button
                className="absolute top-1 right-0 text-black"
                onClick={onClose}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75781 17.2438L12.0008 12.0008L17.2438 17.2438M17.2438 6.75781L11.9998 12.0008L6.75781 6.75781"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
