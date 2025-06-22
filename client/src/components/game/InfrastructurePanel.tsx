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

export function InfrastructurePanel() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showBuildDialog, setShowBuildDialog] = useState(false);
  const [buildType, setBuildType] = useState<InfrastructureType | null>(null);
  
  const {
    infrastructure,
    staff,
    reputation,
    cash,
    buildInfrastructure,
    hireStaff,
    fireStaff
  } = useGameStore();

  const getReputationTier = (score: number) => {
    if (score >= 76) return REPUTATION_TIERS.GOLD;
    if (score >= 51) return REPUTATION_TIERS.SILVER;
    if (score >= 25) return REPUTATION_TIERS.BRONZE;
    return REPUTATION_TIERS.POOR;
  };

  const getLocationInfrastructure = (location: Location) => {
    return infrastructure.filter(inf => inf.location === location);
  };

  const getLocationStaff = (location: Location) => {
    return staff.filter(s => s.location === location);
  };

  const getLocationReputation = (location: Location): PlayerReputation | null => {
    return reputation[location] || null;
  };

  const canBuildInLocation = (location: Location, type: InfrastructureType) => {
    const existing = getLocationInfrastructure(location);
    const hasType = existing.some(inf => inf.type === type);
    return !hasType; // Can only build one of each type per location
  };

  const canHireStaff = (location: Location) => {
    const locationInfra = getLocationInfrastructure(location);
    return locationInfra.length > 0; // Need at least one building to hire staff
  };

  const handleBuildInfrastructure = async () => {
    if (selectedLocation && buildType) {
      await buildInfrastructure(selectedLocation, buildType);
      setShowBuildDialog(false);
      setBuildType(null);
    }
  };

  const handleHireStaff = async (location: Location, staffType: StaffType) => {
    await hireStaff(location, staffType);
  };

  const handleFireStaff = async (staffId: number) => {
    await fireStaff(staffId);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Global Infrastructure</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.values(Location).map(location => {
          const locationInfra = getLocationInfrastructure(location);
          const locationStaff = getLocationStaff(location);
          const locationRep = getLocationReputation(location);
          const repTier = locationRep ? getReputationTier(locationRep.score) : REPUTATION_TIERS.POOR;

          return (
            <div key={location} className="border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">{location}</h3>
                  <span className="text-2xl">{repTier.medal}</span>
                  <span className="text-sm text-gray-600">
                    {locationRep ? `${locationRep.score}% ${repTier.name}` : '0% Poor'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedLocation(location);
                    setShowBuildDialog(true);
                  }}
                  disabled={locationInfra.length >= 2}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Build
                </button>
              </div>

              {/* Infrastructure */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Buildings</h4>
                {locationInfra.length > 0 ? (
                  <div className="space-y-2">
                    {locationInfra.map(inf => (
                      <div key={inf.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{inf.type}</span>
                          <span className="text-xs text-gray-500">Level {inf.level}</span>
                        </div>
                        <span className="text-xs text-red-500">${inf.maintenanceCost}/day</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No buildings</p>
                )}
              </div>

              {/* Staff */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Staff ({locationStaff.length})</h4>
                {locationStaff.length > 0 ? (
                  <div className="space-y-2">
                    {locationStaff.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                        <div>
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-xs text-gray-500">{STAFF_TYPES[s.staffType as keyof typeof STAFF_TYPES]?.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500">${s.salary}/day</span>
                          <button
                            onClick={() => handleFireStaff(s.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Fire
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No staff</p>
                )}
              </div>

              {/* Hire Staff Options */}
              {canHireStaff(location) && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STAFF_TYPES).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => handleHireStaff(location, type as StaffType)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-colors"
                      title={`${info.name} - ${info.benefit}`}
                    >
                      Hire {info.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Build Dialog */}
      {showBuildDialog && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Build in {selectedLocation}</h3>
            
            <div className="space-y-3 mb-6">
              {Object.entries(INFRASTRUCTURE_COSTS).map(([type, costs]) => {
                const canBuild = canBuildInLocation(selectedLocation, type as InfrastructureType);
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
  );
}