import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string | number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 12,
  markers = [],
  onMapClick,
  height = 500,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setError('Google Maps API 키가 설정되지 않았습니다. .env 파일에 VITE_GOOGLE_MAPS_API_KEY를 추가해주세요.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setError('Google Maps 로드에 실패했습니다.');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      if (onMapClick) {
        mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }
    }
  }, [isLoaded, center, zoom, onMapClick]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: markerData.icon,
      });

      if (markerData.title) {
        const infoWindow = new google.maps.InfoWindow({
          content: markerData.title,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  if (error) {
    return (
      <Alert severity="error" sx={{ height }}>
        {error}
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Box ref={mapRef} sx={{ width: '100%', height }} />;
};

export default GoogleMap;
