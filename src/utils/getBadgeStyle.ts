import { KeyAction } from '../types';

export const getKeyActionBadgeStyle = (action: KeyAction): string => {
  switch (action) {
    case 'KA1': return 'bg-blue-100 text-blue-700';
    case 'KA210': return 'bg-green-100 text-green-700';
    case 'KA220': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const getStatusBadgeStyle = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'expired': return 'bg-red-100 text-red-600';
    case 'partnership-found': return 'bg-blue-100 text-blue-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export const getProjectRoleBadgeStyle = (role: string): string => {
  switch (role) {
    case 'Coordinator': return 'bg-purple-100 text-purple-700';
    case 'Partner': return 'bg-teal-100 text-teal-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};
