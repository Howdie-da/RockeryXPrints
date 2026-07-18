// src/components/landing/Popup.jsx
// Reusable high-contrast brutalist confirmation modal with background blur
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const spring = { type: 'spring', bounce: 0, duration: 0.2 };

export default function Popup({
  isOpen,
  title = 'CONFIRM ACTION',
  message = 'ARE YOU ABSOLUTELY SURE?',
  confirmText = 'YES, CONFIRM',
  cancelText = 'NO, CANCEL',
  onConfirm,
  onCancel
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={spring}
            className="relative z-10 w-full max-w-md bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000000] text-center flex flex-col items-center"
          >
            {/* Warning Icon Badge */}
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-yellow-100 text-black mb-4 shrink-0">
              <AlertTriangle size={22} />
            </div>

            {/* Title */}
            <h3 className="font-inter font-black text-xl uppercase tracking-tighter text-black mb-2 leading-none">
              {title}
            </h3>

            {/* Message */}
            <p className="font-space text-xs text-neutral-500 uppercase leading-relaxed mb-6">
              {message}
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 w-full font-space text-xs">
              <button
                onClick={onCancel}
                className="border-2 border-black bg-white hover:bg-neutral-100 text-black font-bold uppercase py-3 border-solid transition-colors duration-100 cursor-pointer touch-manipulation"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="border-2 border-black bg-black hover:bg-white hover:text-black text-white font-bold uppercase py-3 border-solid transition-colors duration-100 cursor-pointer touch-manipulation"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
