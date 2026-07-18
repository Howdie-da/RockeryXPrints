// src/pages/AuthPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { setUser } from '../store/authSlice';
import { loginUser, registerUser } from '../services/api';

const spring = { type: 'spring', bounce: 0, duration: 0.3 };

const BrutalInput = ({ label, id, type = 'text', value, onChange, required, placeholder, rightSlot }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-black">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-transparent border-b-4 border-black px-0 py-3 font-space text-sm text-black placeholder:text-neutral-400 focus:outline-none pr-10"
        style={{ fontSize: '16px' }} /* prevents iOS zoom on focus */
      />
      {rightSlot && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  </div>
);

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('PASSWORD MUST BE AT LEAST 8 CHARACTERS.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginUser({ email: form.email, password: form.password });
        const userObj = res.data?.data?.user || res.data?.data;
        dispatch(setUser({ user: userObj }));
        navigate('/dashboard');
      } else {
        const res = await registerUser({ fullName: form.fullName, email: form.email, password: form.password });
        const userObj = res.data?.data?.user || res.data?.data;
        dispatch(setUser({ user: userObj }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'AUTHENTICATION FAILED. RETRY.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center px-4 py-10 selection:bg-black selection:text-white">

      {/* Brand back-link */}
      <Link
        to="/"
        className="font-inter font-black text-base md:text-xl tracking-tighter uppercase mb-8 md:mb-12 hover:text-neutral-500 transition-colors duration-75 self-start max-w-md w-full"
      >
        ← ROCKERYXPRINTS
      </Link>

      {/* Auth card — full-width on mobile, constrained on desktop */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className="w-full max-w-md bg-white border-4 border-black shadow-solid md:shadow-solid-lg p-6 md:p-12"
      >
        {/* Mode tabs */}
        <div className="flex border-b-4 border-black mb-8">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 font-space font-bold uppercase text-[10px] md:text-xs py-3 tracking-widest transition-colors duration-75 ${
                mode === m ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {m === 'login' ? 'LOGIN' : 'REGISTER'}
            </button>
          ))}
        </div>

        <h1 className="font-inter font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none mb-6 md:mb-8">
          {mode === 'login' ? 'LOGIN' : 'REGISTER'}
        </h1>

        {error && (
          <div className="border-2 border-black bg-black text-white font-space text-[10px] md:text-xs font-bold uppercase px-4 py-3 mb-5 tracking-wider">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === 'register' && (
            <BrutalInput
              label="FULL NAME"
              id="fullName"
              value={form.fullName}
              onChange={set('fullName')}
              required
              placeholder="ALEX MERCER"
            />
          )}

          <BrutalInput
            label="EMAIL ADDRESS"
            id="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            placeholder="alex@domain.com"
          />

          <BrutalInput
            label="PASSWORD"
            id="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            required
            placeholder="••••••••"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="p-2 text-neutral-500 hover:text-black transition-colors touch-manipulation"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98, boxShadow: '0px 0px 0px 0px #000000' }}
            transition={spring}
            disabled={loading}
            className="w-full bg-black text-white font-space font-bold uppercase text-sm py-4 md:py-5 border-2 border-black shadow-solid flex items-center justify-center gap-2 mt-1 hover:bg-white hover:text-black transition-colors duration-75 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {loading ? 'PROCESSING...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
            <ArrowRight size={16} />
          </motion.button>
        </form>

        <p className="font-space text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mt-6 text-center leading-relaxed">
          {mode === 'login' ? (
            <>
              NEW USER?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-black font-bold underline underline-offset-2 hover:text-neutral-500 transition-colors"
              >
                REGISTER here.
              </button>
            </>
          ) : (
            <>
              ALREADY HAVE AN ACCOUNT?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-black font-bold underline underline-offset-2 hover:text-neutral-500 transition-colors"
              >
                LOGIN here.
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
