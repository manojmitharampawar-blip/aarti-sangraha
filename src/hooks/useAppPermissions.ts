'use client';

import { useState, useEffect, useCallback } from 'react';

export type PermissionStatusType = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityNameMr: string;
  cityNameEn: string;
}

const NOTABLE_CITIES = [
  { nameMr: 'पुणे', nameEn: 'Pune', lat: 18.5204, lng: 73.8567 },
  { nameMr: 'मुंबई', nameEn: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { nameMr: 'नागपूर', nameEn: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { nameMr: 'नाशिक', nameEn: 'Nashik', lat: 19.9975, lng: 73.7898 },
  { nameMr: 'छत्रपती संभाजीनगर', nameEn: 'Chhatrapati Sambhajinagar', lat: 19.8762, lng: 75.3433 },
  { nameMr: 'कोल्हापूर', nameEn: 'Kolhapur', lat: 16.705, lng: 74.2433 },
  { nameMr: 'ठाणे', nameEn: 'Thane', lat: 19.2183, lng: 72.9781 },
  { nameMr: 'सोलापूर', nameEn: 'Solapur', lat: 17.6599, lng: 75.9064 },
  { nameMr: 'अमरावती', nameEn: 'Amravati', lat: 20.9374, lng: 77.7796 },
  { nameMr: 'सातारा', nameEn: 'Satara', lat: 17.6805, lng: 73.9997 },
  { nameMr: 'सांगली', nameEn: 'Sangli', lat: 16.8524, lng: 74.5815 },
  { nameMr: 'नवी दिल्ली', nameEn: 'New Delhi', lat: 28.6139, lng: 77.209 },
  { nameMr: 'बंगळुरू', nameEn: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
];

function findNearestCity(lat: number, lng: number) {
  let minDistance = Infinity;
  let closest = { nameMr: 'महाराष्ट्र', nameEn: 'Maharashtra' };

  for (const city of NOTABLE_CITIES) {
    const d = Math.hypot(city.lat - lat, city.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = { nameMr: city.nameMr, nameEn: city.nameEn };
    }
  }
  return closest;
}

export function useAppPermissions() {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatusType>('prompt');
  const [micStatus, setMicStatus] = useState<PermissionStatusType>('prompt');
  const [locationStatus, setLocationStatus] = useState<PermissionStatusType>('prompt');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isRequestingAll, setIsRequestingAll] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Sync initial permission states
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved location from storage
    try {
      const savedLoc = localStorage.getItem('vedic_user_location');
      if (savedLoc) {
        setUserLocation(JSON.parse(savedLoc));
        setLocationStatus('granted');
      }
    } catch {
      // ignore
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unsupported');
      setMicStatus('unsupported');
    }

    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
    }

    // Modern Permissions API query where available
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then(res => {
          setCameraStatus(res.state as PermissionStatusType);
          res.onchange = () => setCameraStatus(res.state as PermissionStatusType);
        })
        .catch(() => {});

      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then(res => {
          setMicStatus(res.state as PermissionStatusType);
          res.onchange = () => setMicStatus(res.state as PermissionStatusType);
        })
        .catch(() => {});

      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then(res => {
          setLocationStatus(res.state as PermissionStatusType);
          res.onchange = () => setLocationStatus(res.state as PermissionStatusType);
        })
        .catch(() => {});
    }
  }, []);

  const requestCamera = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unsupported');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 320 } },
      });
      stream.getTracks().forEach(track => track.stop());
      setCameraStatus('granted');
      setLastActionMessage('कॅमेरा परवानगी यशस्वीरीत्या सक्रिय केली!');
      return true;
    } catch (err: unknown) {
      console.warn('Camera request denied or unavailable:', err);
      setCameraStatus('denied');
      setLastActionMessage('कॅमेरा परवानगी नाकारली गेली किंवा उपलब्ध नाही.');
      return false;
    }
  }, []);

  const requestMicrophone = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unsupported');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      stream.getTracks().forEach(track => track.stop());
      setMicStatus('granted');
      setLastActionMessage('मायक्रोफोन परवानगी यशस्वीरीत्या सक्रिय केली!');
      return true;
    } catch (err: unknown) {
      console.warn('Microphone request denied or unavailable:', err);
      setMicStatus('denied');
      setLastActionMessage('मायक्रोफोन परवानगी नाकारली गेली.');
      return false;
    }
  }, []);

  const requestLocation = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('unsupported');
      return false;
    }

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const nearest = findNearestCity(lat, lng);
          const locObj: UserLocation = {
            latitude: lat,
            longitude: lng,
            cityNameMr: nearest.nameMr,
            cityNameEn: nearest.nameEn,
          };
          try {
            localStorage.setItem('vedic_user_location', JSON.stringify(locObj));
          } catch {
            // ignore
          }
          setUserLocation(locObj);
          setLocationStatus('granted');
          setLastActionMessage(`स्थान जोडले: ${nearest.nameMr}`);
          resolve(true);
        },
        err => {
          console.warn('Geolocation request denied:', err);
          setLocationStatus('denied');
          setLastActionMessage('स्थान परवानगी नाकारली गेली.');
          resolve(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 86400000 }
      );
    });
  }, []);

  const requestAllPermissions = useCallback(async () => {
    setIsRequestingAll(true);
    setLastActionMessage('परवानग्या सुरू करत आहे...');

    // 1. Camera
    if (cameraStatus !== 'granted') {
      await requestCamera();
    }

    // 2. Microphone
    if (micStatus !== 'granted') {
      await requestMicrophone();
    }

    // 3. Location
    if (locationStatus !== 'granted') {
      await requestLocation();
    }

    setIsRequestingAll(false);
    setLastActionMessage('सर्व परवानग्या अद्ययावत झाल्या आहेत!');
  }, [cameraStatus, micStatus, locationStatus, requestCamera, requestMicrophone, requestLocation]);

  const allGranted =
    cameraStatus === 'granted' && micStatus === 'granted' && locationStatus === 'granted';

  return {
    cameraStatus,
    micStatus,
    locationStatus,
    userLocation,
    allGranted,
    isRequestingAll,
    lastActionMessage,
    requestCamera,
    requestMicrophone,
    requestLocation,
    requestAllPermissions,
    clearActionMessage: () => setLastActionMessage(null),
  };
}
