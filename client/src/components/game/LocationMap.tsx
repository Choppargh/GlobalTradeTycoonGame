import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Location } from '@shared/schema';
import { cn } from '@/lib/utils';

interface LocationMapProps {
  currentLocation: Location;
  onSelect?: (location: Location) => void;
  interactive?: boolean;
}

interface LocationPoint {
  location: Location;
  x: string;
  y: string;
  className?: string;
}

export function LocationMap({ currentLocation, onSelect, interactive = false }: LocationMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  
  // Define the position of each location on the map
  const locationPoints: LocationPoint[] = [
    { location: Location.Africa, x: "50%", y: "60%", className: "bg-yellow-600" },
    { location: Location.Antarctica, x: "50%", y: "85%", className: "bg-blue-200" },
    { location: Location.Asia, x: "70%", y: "40%", className: "bg-red-600" },
    { location: Location.Europe, x: "48%", y: "30%", className: "bg-blue-600" },
    { location: Location.NorthAmerica, x: "20%", y: "35%", className: "bg-green-600" },
    { location: Location.Oceania, x: "80%", y: "70%", className: "bg-purple-600" },
    { location: Location.SouthAmerica, x: "30%", y: "65%", className: "bg-orange-600" }
  ];

  const handleLocationClick = (location: Location) => {
    if (interactive && onSelect && location !== currentLocation) {
      onSelect(location);
    }
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-0">
      <CardContent className="p-0 relative">
        <div 
          className="relative w-full h-[250px] bg-cover bg-center bg-gray-100"
          style={{ 
            backgroundImage: 'url(/images/world-map.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        >
          {/* Location points */}
          {locationPoints.map((point) => (
            <div
              key={point.location}
              className={cn(
                "absolute w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2",
                point.className,
                currentLocation === point.location && "ring-2 ring-white ring-offset-1",
                interactive && point.location !== currentLocation && "cursor-pointer hover:ring-2 hover:ring-white",
                !interactive && "cursor-default"
              )}
              style={{ left: point.x, top: point.y }}
              onClick={() => handleLocationClick(point.location)}
              onMouseEnter={() => setHoveredLocation(point.location)}
              onMouseLeave={() => setHoveredLocation(null)}
            />
          ))}
          
          {/* Tooltip for hovered location */}
          {hoveredLocation && (
            <div 
              className="absolute bg-black/80 text-white text-xs py-1 px-2 rounded pointer-events-none z-10"
              style={{ 
                left: locationPoints.find(p => p.location === hoveredLocation)?.x,
                top: `calc(${locationPoints.find(p => p.location === hoveredLocation)?.y} - 20px)`,
                transform: 'translateX(-50%)'
              }}
            >
              {hoveredLocation}
            </div>
          )}
          
          {/* Current location indicator */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
            Current: {currentLocation}
          </div>
          
          {interactive && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
              Click a location to travel
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
