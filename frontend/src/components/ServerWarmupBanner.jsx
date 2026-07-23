// src/components/ServerWarmupBanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { checkHealthAPI } from '../services/api';

const spring = { type: 'spring', bounce: 0, duration: 0.3 };

export default function ServerWarmupBanner() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'warmup' | 'online' | 'error'
  const [elapsed, setElapsed] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const timerRef = useRef(null);
  const warmupTimeoutRef = useRef(null);

  const startWarmupCheck = async () => {
    setStatus('checking');
    setElapsed(0);

    // If server takes >1.5s to respond, transition status to 'warmup' so user sees cold-start loader
    warmupTimeoutRef.current = setTimeout(() => {
      setStatus((current) => (current === 'checking' ? 'warmup' : current));
    }, 1500);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      await checkHealthAPI(120000);
      if (warmupTimeoutRef.current) clearTimeout(warmupTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('online');
    } catch (err) {
      if (warmupTimeoutRef.current) clearTimeout(warmupTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('error');
    }
  };

  useEffect(() => {
    startWarmupCheck();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (warmupTimeoutRef.current) clearTimeout(warmupTimeoutRef.current);
    };
  }, [retryCount]);

  // Auto-hide when online after 3 seconds if it was previously warming up
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (status === 'online') {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible || status === 'checking') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={spring}
        className="fixed top-0 left-0 right-0 z-50 p-2 md:p-3 bg-black text-white border-b-4 border-black font-space select-none shadow-solid"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-2">
          
          <div className="flex items-center gap-3">
            {status === 'warmup' && (
              <div className="w-8 h-8 border-2 border-white bg-yellow-400 text-black flex items-center justify-center shrink-0 animate-pulse">
                <Activity size={18} className="animate-spin" />
              </div>
            )}
            {status === 'online' && (
              <div className="w-8 h-8 border-2 border-white bg-green-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle size={18} />
              </div>
            )}
            {status === 'error' && (
              <div className="w-8 h-8 border-2 border-white bg-red-600 text-white flex items-center justify-center shrink-0">
                <AlertCircle size={18} />
              </div>
            )}

            <div>
              <div className="font-inter font-black text-xs md:text-sm uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
                {status === 'warmup' && '⚡ RENDER SERVER COLD-STARTING... WAKING UP BACKEND'}
                {status === 'online' && '✓ BACKEND CONNECTED & ONLINE! ALL SYSTEMS GO.'}
                {status === 'error' && '⚠ UNABLE TO REACH BACKEND SERVER.'}
              </div>
              <p className="text-[10px] md:text-xs text-neutral-300 uppercase tracking-wider">
                {status === 'warmup' && `Render free instances spin down on inactivity. Cold start time: ${elapsed}s (Est. 40-80s)`}
                {status === 'online' && 'Ready for high-speed API requests.'}
                {status === 'error' && 'Render host spin-up timed out. Click to retry healthcheck.'}
              </p>
            </div>
          </div>

          {status === 'warmup' && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs font-bold bg-white text-black px-2.5 py-1 border border-black">
                {elapsed}s
              </span>
            </div>
          )}

          {status === 'error' && (
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="flex items-center gap-1.5 bg-white text-black font-bold uppercase text-[10px] md:text-xs px-3 py-1.5 border-2 border-white hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw size={12} /> RETRY PING
            </button>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
