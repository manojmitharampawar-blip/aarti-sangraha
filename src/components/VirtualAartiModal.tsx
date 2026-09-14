'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  Sparkles,
  RotateCw,
  Bell,
  Heart,
  Volume2,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { AartiItem } from '@/types';
import { DevotionalGestureTracker, GestureState } from '@/lib/gestureTracker';
import { playTempleBell, playShankh } from '@/lib/audioBell';

interface VirtualAartiModalProps {
  isOpen: boolean;
  onClose: () => void;
  aarti: AartiItem;
}

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speedY: number;
  speedX: number;
  color: string;
  char: string;
}

export function VirtualAartiModal({ isOpen, onClose, aarti }: VirtualAartiModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const procCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const trackerRef = useRef<DevotionalGestureTracker | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [revolutions, setRevolutions] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [flowerParticles, setFlowerParticles] = useState<FlowerParticle[]>([]);
  const [showCameraPreview, setShowCameraPreview] = useState(true);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isShankhRinging, setIsShankhRinging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Trigger Flower Shower (पुष्पवृष्टी)
  const triggerFlowerShower = useCallback(() => {
    const chars = ['🌸', '🌺', '🌼', '🏵️', '✨'];
    const newFlowers: FlowerParticle[] = [];

    for (let i = 0; i < 28; i++) {
      newFlowers.push({
        id: Math.random() + Date.now(),
        x: Math.random() * 100, // percentage 0-100vw
        y: -10 - Math.random() * 30, // start above viewport
        size: 16 + Math.random() * 20,
        rotation: Math.random() * 360,
        speedY: 2 + Math.random() * 3.5,
        speedX: (Math.random() - 0.5) * 1.5,
        color: '#f59e0b',
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }

    setFlowerParticles(prev => [...prev.slice(-30), ...newFlowers]);
    playShankh({ enableHaptics: true });
    setIsShankhRinging(true);
    setTimeout(() => setIsShankhRinging(false), 2200);
  }, []);

  // Ring Bell manually or via gesture
  const triggerBell = useCallback(() => {
    playTempleBell({ enableHaptics: true, volume: 0.75 });
    setIsBellRinging(true);
    setTimeout(() => setIsBellRinging(false), 800);
  }, []);

  // Update Flower Particles Physics Animation Loop
  useEffect(() => {
    if (flowerParticles.length === 0) return;

    const interval = setInterval(() => {
      setFlowerParticles(prev =>
        prev
          .map(p => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX,
            rotation: p.rotation + 4,
          }))
          .filter(p => p.y < 110)
      );
    }, 35);

    return () => clearInterval(interval);
  }, [flowerParticles.length]);

  // Start Camera and Gesture Recognition Loop
  useEffect(() => {
    if (!isOpen) {
      // Clean up when modal closes
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }

    let isMounted = true;
    const tracker = new DevotionalGestureTracker();
    trackerRef.current = tracker;

    tracker.onAartiCircle = (revCount: number) => {
      setRevolutions(revCount);
      triggerBell();
    };

    tracker.onNamaskar = () => {
      triggerFlowerShower();
    };

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
              setCameraActive(true);
              startProcessingLoop();
            }
          };
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        if (isMounted) {
          setCameraError('कॅमेरा उपलब्ध नाही किंवा परवानगी नाकारली आहे. आपण खालील बटणांनी आरती करू शकता.');
        }
      }
    }

    function startProcessingLoop() {
      const loop = () => {
        if (!isMounted || !videoRef.current || !procCanvasRef.current || !trackerRef.current) {
          return;
        }

        if (videoRef.current.readyState >= 2) {
          const state = trackerRef.current.processFrame(
            procCanvasRef.current,
            videoRef.current
          );
          setCurrentAngle(state.currentAngleDeg);
          setIsRotating(state.isClockwiseRotating);
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    }

    initCamera();

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    };
  }, [isOpen, triggerBell, triggerFlowerShower]);

  // Manual Aarti Rotation Trigger
  const handleManualRotate = () => {
    setCurrentAngle(prev => (prev + 90) % 360);
    setRevolutions(prev => {
      const next = prev + 1;
      triggerBell();
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      {/* Hidden processing canvas & video stream */}
      <canvas ref={procCanvasRef} width="80" height="60" className="hidden" />
      <video
        ref={videoRef}
        playsInline
        muted
        className={
          showCameraPreview && cameraActive
            ? 'fixed bottom-4 right-4 w-28 h-20 rounded-xl object-cover border-2 border-amber-500/50 shadow-xl z-50 -scale-x-100 opacity-90'
            : 'hidden'
        }
      />

      {/* Falling Flower Petals Layer */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {flowerParticles.map(p => (
          <div
            key={p.id}
            className="absolute transition-transform duration-75"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              fontSize: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      {/* Main Aarti Sanctum Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/70 to-stone-950 border border-amber-500/30 p-5 sm:p-7 text-white shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-amber-200">
                स्पर्शविरहित व्हर्च्युअल आरती
              </h2>
              <p className="text-[11px] text-amber-400/80 truncate max-w-[200px] sm:max-w-xs">
                {aarti.titleDevanagari}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cameraActive && (
              <button
                onClick={() => setShowCameraPreview(!showCameraPreview)}
                title={showCameraPreview ? 'कॅमेरा लपवा' : 'कॅमेरा दाखवा'}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
              >
                {showCameraPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              title="मदत व मार्गदर्शन"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Status Notification */}
        {cameraError ? (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 text-center">
            {cameraError}
          </div>
        ) : (
          cameraActive && (
            <div className="w-full mt-2 flex items-center justify-between text-[11px] text-amber-300/80 px-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>कॅमेरा चालू • स्थानिक सुरक्षित प्रक्रिया</span>
              </span>
              <span className="font-bold text-amber-400">
                आरती फेऱ्या: {revolutions}
              </span>
            </div>
          )
        )}

        {/* Helpful Gesture Instructions Banner */}
        {showInstructions && (
          <div className="w-full mt-3 p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-xs space-y-1.5 text-amber-200">
            <p className="font-bold">✨ हातवारे कसे करावेत (Touchless Gestures):</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-300/90">
              <li><strong>🔄 प्रदक्षिणा आरती:</strong> कॅमेऱ्यासमोर हात घड्याळाच्या दिशेने गोलाकार फिरवा. प्रत्येक फेरीनंतर घंटा वाजेल!</li>
              <li><strong>🙏 नमस्कार मुद्रा:</strong> छातीसमोर दोन्ही हात जोडा; स्क्रीनवर पवित्र पुष्पवृष्टी होईल व शंखनाद घुमेल.</li>
            </ul>
          </div>
        )}

        {/* Divine Aarti Thali & Diya Visual Sanctum */}
        <div className="relative my-8 sm:my-10 flex items-center justify-center">
          {/* Sacred Golden Halo Aura */}
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-amber-500/15 blur-2xl animate-pulse" />

          {/* Rotating Brass Aarti Thali (थाळी) */}
          <div
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-amber-400/80 shadow-2xl flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              background: 'radial-gradient(circle, #78350f 0%, #451a03 50%, #1c1917 100%)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.35), inset 0 0 20px rgba(251, 191, 36, 0.4)',
            }}
          >
            {/* Thali Outer Brass Carvings / Dots */}
            <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/40 pointer-events-none" />

            {/* Holy Kumkum & Akshata offerings inside Thali */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-600 shadow-sm shadow-rose-500" title="कुंकुम" />
            <div className="absolute bottom-6 left-1/4 w-3.5 h-3.5 rounded-full bg-amber-200 shadow-sm" title="अक्षता" />
            <div className="absolute bottom-6 right-1/4 w-3.5 h-3.5 rounded-full bg-amber-500" title="हळद" />

            {/* Central Pure Diya & Camphor (निरांजन व कापूर) */}
            <div className="relative flex flex-col items-center">
              {/* Flame Aura & Glow */}
              <div className="w-8 h-12 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white blur-xs animate-flicker shadow-lg shadow-amber-500/80" />
              {/* Inner Flame Core */}
              <div className="absolute top-1 w-4 h-7 rounded-full bg-yellow-100 blur-[0.5px] animate-pulse" />

              {/* Brass Diya Stand */}
              <div className="w-14 h-4 mt-0.5 rounded-b-xl bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 shadow-md" />
              <div className="w-6 h-5 bg-gradient-to-b from-amber-500 to-amber-700 rounded-sm" />
              <div className="w-16 h-3 rounded-full bg-amber-600 shadow-inner" />
            </div>

            {/* Fragrant Flowers placed in Thali */}
            <span className="absolute top-8 left-8 text-xl">🌺</span>
            <span className="absolute top-8 right-8 text-xl">🌼</span>
            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xl">🌸</span>
          </div>
        </div>

        {/* Live Status Gesture Feedback */}
        <div className="text-center space-y-1 mb-6">
          <p className="text-sm font-bold text-amber-200 flex items-center justify-center gap-1.5">
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin text-amber-400' : 'text-amber-500'}`} />
            <span>
              {isRotating
                ? 'आरती फिरत आहे... (प्रदक्षिणा चालू)'
                : 'कॅमेऱ्यासमोर हात गोलाकार फिरवा'}
            </span>
          </p>
          <p className="text-xs text-amber-400/70">
            एकूण फेऱ्या: <strong>{revolutions}</strong> • घंटा नाद: {revolutions} वेळा
          </p>
        </div>

        {/* Interactive Devotional Actions Bar */}
        <div className="w-full flex items-center justify-center gap-2.5 flex-wrap pt-3 border-t border-amber-500/20">
          {/* Manual Aarti Rotate Button */}
          <button
            onClick={handleManualRotate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold active:scale-95 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>आरती ओवाळा</span>
          </button>

          {/* Temple Bell Ring Button */}
          <button
            onClick={triggerBell}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              isBellRinging
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/40 animate-bounce'
                : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>घंटा वाजवा</span>
          </button>

          {/* Flower Shower (पुष्पवृष्टी) Button */}
          <button
            onClick={triggerFlowerShower}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              isShankhRinging
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15'
            }`}
          >
            <span>🌸</span>
            <span>पुष्पवृष्टी करा</span>
          </button>
        </div>
      </div>
    </div>
  );
}
