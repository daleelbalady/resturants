
import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
    const { translations, language } = useConfig();
    const t = translations;
    const [pinned, setPinned] = useState(false);
    const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 }); // percentages

    const mapRef = useRef<HTMLDivElement>(null);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            setPinPosition({ x, y });
            setPinned(true);
            
            // Mock translation to lat/lng for "Cairo" area
            const lat = 30.0 + (y / 1000); 
            const lng = 31.2 + (x / 1000);
            onLocationSelect(lat, lng);
        }
    };

    return (
        <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden relative border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-crosshair group">
            <div 
                ref={mapRef}
                onClick={handleMapClick}
                className="w-full h-full relative"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.8
                }}
            >
                {/* Overlay Text if not pinned */}
                {!pinned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="bg-white/90 dark:bg-black/80 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {t.dragPin[language]}
                        </div>
                    </div>
                )}
                
                {/* The Pin */}
                {pinned && (
                    <div 
                        className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
                        style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                    >
                        <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-xl" />
                        <div className="w-2 h-1 bg-black/50 rounded-full blur-[2px] mx-auto mt-[-4px]"></div>
                    </div>
                )}
            </div>
            
            {/* Grid Lines Overlay for "Map" Feel */}
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
                     backgroundSize: '40px 40px'
                 }}>
            </div>
        </div>
    );
};
