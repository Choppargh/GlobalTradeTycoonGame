import React from 'react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { 
  Location, 
  StaffType, 
  STAFF_TYPES,
  PlayerStaff,
} from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Briefcase, Search, MessageCircle, Shield } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffModal({ isOpen, onClose }: StaffModalProps) {
  const {
    currentLocation,
    staff,
    cash,
    hireStaff,
    fireStaff,
  } = useGameStore();

  if (!isOpen || !currentLocation) return null;

  const getLocationStaff = () => {
    return staff.filter(s => s.location === currentLocation);
  };

  const handleHireStaff = async (staffType: StaffType) => {
    if (!currentLocation) return;
    
    const staffInfo = STAFF_TYPES[staffType];
    if (cash < staffInfo.salary) {
      alert('Not enough cash to hire this staff member!');
      return;
    }

    try {
      await hireStaff(currentLocation, staffType);
    } catch (error) {
      console.error('Failed to hire staff:', error);
      alert('Failed to hire staff. Please try again.');
    }
  };

  const handleFireStaff = async (staffId: number) => {
    if (!confirm('Are you sure you want to fire this staff member?')) return;

    try {
      await fireStaff(staffId);
    } catch (error) {
      console.error('Failed to fire staff:', error);
      alert('Failed to fire staff. Please try again.');
    }
  };

  const getStaffIcon = (type: StaffType) => {
    switch (type) {
      case StaffType.MANAGER:
        return <Briefcase className="w-5 h-5" />;
      case StaffType.ANALYST:
        return <Search className="w-5 h-5" />;
      case StaffType.NEGOTIATOR:
        return <MessageCircle className="w-5 h-5" />;
      case StaffType.SECURITY:
        return <Shield className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const locationStaff = getLocationStaff();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff in {currentLocation}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Staff */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Staff</h3>
            {locationStaff.length === 0 ? (
              <p className="text-gray-500 italic">No staff hired in this location yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationStaff.map((member) => (
                  <div key={member.id} className="bg-background/50 p-4 rounded-3xl border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStaffIcon(member.type)}
                        <span className="font-medium">{member.type}</span>
                      </div>
                      <Badge variant="secondary">Level {member.level}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Daily Salary: ${member.salary.toFixed(2)}</p>
                      <p>Hired: {new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full rounded-2xl"
                      onClick={() => handleFireStaff(member.id)}
                    >
                      Fire Staff
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hire New Staff */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Hire New Staff</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(STAFF_TYPES).map(([type, info]) => {
                const staffType = type as StaffType;
                const canAfford = cash >= info.salary;
                const alreadyHired = locationStaff.some(s => s.type === staffType);

                return (
                  <div key={type} className="bg-background/30 p-4 rounded-3xl border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStaffIcon(staffType)}
                        <span className="font-medium">{type}</span>
                      </div>
                      <span className="text-sm font-medium">${info.salary.toFixed(2)}/day</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p>{info.description}</p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full rounded-2xl"
                      disabled={!canAfford || alreadyHired}
                      onClick={() => handleHireStaff(staffType)}
                      variant={canAfford && !alreadyHired ? "default" : "secondary"}
                    >
                      {alreadyHired ? 'Already Hired' : 
                       !canAfford ? 'Not Enough Cash' : 
                       `Hire for $${info.salary.toFixed(2)}/day`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff Benefits */}
          <div className="bg-green-50 p-4 rounded-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-800">Staff Benefits</h4>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Managers improve overall business efficiency and reduce costs</li>
              <li>• Analysts provide better market insights and price predictions</li>
              <li>• Negotiators help secure better deals and contracts</li>
              <li>• Security staff reduce theft and protect your investments</li>
              <li>• Staff can be trained to higher levels for better performance</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}