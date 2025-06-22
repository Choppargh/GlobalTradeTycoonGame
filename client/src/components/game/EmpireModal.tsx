import React, { useState } from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { 
  Location, 
  InfrastructureType, 
  StaffType, 
  REPUTATION_TIERS, 
  STAFF_TYPES, 
  INFRASTRUCTURE_COSTS,
  PlayerInfrastructure,
  PlayerStaff,
  PlayerReputation 
} from '@shared/schema';

interface EmpireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmpireModal({ isOpen, onClose }: EmpireModalProps) {
  const [buildType, setBuildType] = useState<InfrastructureType | null>(null);
  const [showBuildDialog, setShowBuildDialog] = useState(false);
  
  const {
    currentLocation,
    infrastructure,
    staff,
    reputation,
    cash,
    buildInfrastructure,
    hireStaff,
    fireStaff
  } = useGameStore();

  if (!isOpen || !currentLocation) return null;

  const getReputationTier = (score: number) => {
    if (score >= 76) return REPUTATION_TIERS.GOLD;
    if (score >= 51) return REPUTATION_TIERS.SILVER;
    if (score >= 25) return REPUTATION_TIERS.BRONZE;
    return REPUTATION_TIERS.POOR;
  };

  const getLocationInfrastructure = () => {
    return infrastructure.filter(inf => inf.location === currentLocation);
  };

  const getLocationStaff = () => {
    return staff.filter(s => s.location === currentLocation);
  };

  const getLocationReputation = (): PlayerReputation | null => {
    return reputation[currentLocation] || null;
  };

  const canBuildInLocation = (type: InfrastructureType) => {
    const existing = getLocationInfrastructure();
    const hasType = existing.some(inf => inf.type === type);
    return !hasType; // Can only build one of each type per location
  };

  const canHireStaff = () => {
    const locationInfra = getLocationInfrastructure();
    return locationInfra.length > 0; // Need at least one building to hire staff
  };

  const handleBuildInfrastructure = async () => {
    if (buildType) {
      await buildInfrastructure(currentLocation, buildType);
      setShowBuildDialog(false);
      setBuildType(null);
    }
  };

  const handleHireStaff = async (staffType: StaffType) => {
    await hireStaff(currentLocation, staffType);
  };

  const handleFireStaff = async (staffId: number) => {
    await fireStaff(staffId);
  };

  const locationInfra = getLocationInfrastructure();
  const locationStaff = getLocationStaff();
  const locationRep = getLocationReputation();
  const repTier = locationRep ? getReputationTier(locationRep.score) : REPUTATION_TIERS.POOR;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">{currentLocation} Operations</h2>
              <span className="text-3xl">{repTier.medal}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Reputation Status */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Regional Reputation</h3>
              <span className="text-lg font-bold text-gray-700">
                {locationRep ? `${locationRep.score}%` : '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${locationRep ? locationRep.score : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{repTier.name} Tier</span>
              {locationRep && (
                <span>{locationRep.totalTrades} trades completed</span>
              )}
            </div>
          </div>

          {/* Infrastructure Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Buildings</h3>
              <button
                onClick={() => setShowBuildDialog(true)}
                disabled={locationInfra.length >= 2}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-colors"
              >
                Build
              </button>
            </div>
            
            {locationInfra.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locationInfra.map(inf => (
                  <div key={inf.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{inf.type}</span>
                      <span className="text-sm text-gray-500">Level {inf.level}</span>
                    </div>
                    <div className="text-sm text-red-600">
                      Maintenance: ${inf.maintenanceCost}/day
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No buildings in this location</p>
                <p className="text-sm">Build an office or warehouse to expand your operations</p>
              </div>
            )}
          </div>

          {/* Staff Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Staff ({locationStaff.length})
            </h3>
            
            {locationStaff.length > 0 ? (
              <div className="space-y-3 mb-4">
                {locationStaff.map(s => (
                  <div key={s.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          {STAFF_TYPES[s.staffType as keyof typeof STAFF_TYPES]?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {STAFF_TYPES[s.staffType as keyof typeof STAFF_TYPES]?.benefit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-600 font-medium">
                          ${s.salary}/day
                        </div>
                        <button
                          onClick={() => handleFireStaff(s.id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 mb-4">
                <p>No staff in this location</p>
                {!canHireStaff() && (
                  <p className="text-sm">Build an office or warehouse to hire staff</p>
                )}
              </div>
            )}

            {/* Hire Staff Options */}
            {canHireStaff() && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(STAFF_TYPES).map(([type, info]) => (
                  <button
                    key={type}
                    onClick={() => handleHireStaff(type as StaffType)}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm transition-colors"
                  >
                    <div className="font-medium">Hire {info.name}</div>
                    <div className="text-xs opacity-90">${info.baseSalary}/day</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Build Dialog */}
        {showBuildDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Build in {currentLocation}</h3>
              
              <div className="space-y-3 mb-6">
                {Object.entries(INFRASTRUCTURE_COSTS).map(([type, costs]) => {
                  const canBuild = canBuildInLocation(type as InfrastructureType);
                  const cost = costs.build[0];
                  const maintenance = costs.maintenance[0];
                  
                  return (
                    <button
                      key={type}
                      onClick={() => setBuildType(type as InfrastructureType)}
                      disabled={!canBuild || cash < cost}
                      className={`w-full p-4 rounded-2xl text-left transition-colors ${
                        buildType === type 
                          ? 'bg-amber-500 text-white' 
                          : canBuild && cash >= cost
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-medium capitalize">{type}</div>
                      <div className="text-sm opacity-80">
                        Cost: ${cost} | Maintenance: ${maintenance}/day
                      </div>
                      {!canBuild && (
                        <div className="text-xs text-red-500">Already built</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBuildDialog(false);
                    setBuildType(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuildInfrastructure}
                  disabled={!buildType}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-colors"
                >
                  Build
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}