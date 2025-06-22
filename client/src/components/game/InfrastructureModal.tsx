import React, { useState } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { 
  Location, 
  InfrastructureType, 
  INFRASTRUCTURE_COSTS,
  PlayerInfrastructure,
} from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Warehouse, TrendingUp, MapPin } from 'lucide-react';

interface InfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfrastructureModal({ isOpen, onClose }: InfrastructureModalProps) {
  const [buildType, setBuildType] = useState<InfrastructureType | null>(null);
  const [showBuildDialog, setShowBuildDialog] = useState(false);
  
  const {
    currentLocation,
    infrastructure,
    cash,
    buildInfrastructure,
  } = useGameStore();

  if (!isOpen || !currentLocation) return null;

  const getLocationInfrastructure = () => {
    return infrastructure.filter(inf => inf.location === currentLocation);
  };

  const canBuildInLocation = (type: any) => {
    const existing = getLocationInfrastructure().find(inf => inf.type === type);
    return !existing; // Can only build one of each type per location
  };

  const handleBuildInfrastructure = async (type: any) => {
    if (!currentLocation) return;
    
    const costInfo = INFRASTRUCTURE_COSTS[type as keyof typeof INFRASTRUCTURE_COSTS];
    const cost = costInfo ? costInfo.build[0] : 1000; // Level 1 build cost
    if (cash < cost) {
      alert('Not enough cash to build this infrastructure!');
      return;
    }

    try {
      await buildInfrastructure(currentLocation, type);
      setShowBuildDialog(false);
      setBuildType(null);
    } catch (error) {
      console.error('Failed to build infrastructure:', error);
      alert('Failed to build infrastructure. Please try again.');
    }
  };

  const getInfrastructureIcon = (type: InfrastructureType) => {
    switch (type) {
      case InfrastructureType.Office:
        return <Building2 className="w-5 h-5" />;
      case InfrastructureType.Warehouse:
        return <Warehouse className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const locationInfrastructure = getLocationInfrastructure();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Infrastructure in {currentLocation}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Infrastructure */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Infrastructure</h3>
            {locationInfrastructure.length === 0 ? (
              <p className="text-gray-500 italic">No infrastructure built in this location yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationInfrastructure.map((infra) => (
                  <div key={infra.id} className="bg-background/50 p-4 rounded-3xl border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInfrastructureIcon(infra.type)}
                        <span className="font-medium">{infra.type}</span>
                      </div>
                      <Badge variant="secondary">Level {infra.level}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Daily Cost: ${infra.maintenanceCost.toFixed(2)}</p>
                      <p>Built: {new Date(infra.buildDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Build New Infrastructure */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Build New Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['office', 'warehouse'].map((type) => {
                const costInfo = INFRASTRUCTURE_COSTS[type as keyof typeof INFRASTRUCTURE_COSTS];
                const cost = costInfo ? costInfo.build[0] : 1000;
                const canBuild = canBuildInLocation(type as any);
                const canAfford = cash >= cost;

                return (
                  <div key={type} className="bg-background/30 p-4 rounded-3xl border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {type === 'office' ? <Building2 className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
                        <span className="font-medium capitalize">{type}</span>
                      </div>
                      <span className="text-sm font-medium">${cost.toLocaleString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      {type === 'office' && (
                        <p>Reduces travel costs and improves staff efficiency</p>
                      )}
                      {type === 'warehouse' && (
                        <p>Increases inventory capacity and reduces storage costs</p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full rounded-2xl"
                      disabled={!canBuild || !canAfford}
                      onClick={() => handleBuildInfrastructure(type as any)}
                      variant={canBuild && canAfford ? "default" : "secondary"}
                    >
                      {!canBuild ? 'Already Built' : 
                       !canAfford ? 'Not Enough Cash' : 
                       `Build for $${cost.toLocaleString()}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Infrastructure Benefits */}
          <div className="bg-blue-50 p-4 rounded-3xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">Infrastructure Benefits</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Offices reduce travel costs by 15% and boost staff productivity</li>
              <li>• Warehouses increase inventory capacity and reduce spoilage</li>
              <li>• Higher-level infrastructure provides greater benefits</li>
              <li>• Infrastructure requires daily maintenance costs</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}