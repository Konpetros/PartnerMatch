import { Listing, SearchFilters } from '../types';

export const filterListings = (listings: Listing[], filters: SearchFilters): Listing[] => {
  const query = filters.searchQuery.toLowerCase().trim();
  return listings.filter((item) => {
    const cityValue = item.submitterProfile?.city || '';
    const matchesQuery = !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      cityValue.toLowerCase().includes(query);
    const matchesCountry = !filters.country || item.country === filters.country;
    const matchesOrgType = !filters.organisationType || item.type === filters.organisationType;
    const matchesKeyAction = filters.keyActions.length === 0 ||
      filters.keyActions.some(action => item.keyActions.includes(action));
    const matchesThematic = !filters.thematicArea || item.thematicAreas.includes(filters.thematicArea);
    const matchesProjectRole = !filters.projectRole || item.projectRole === filters.projectRole;
    const matchesSector = !filters.sector || item.submitterProfile?.sector === filters.sector;
    return matchesQuery && matchesCountry && matchesOrgType && matchesKeyAction && matchesThematic && matchesSector && matchesProjectRole;
  });
};

export const sortListings = (listings: Listing[], sortBy: 'newest' | 'deadline' | 'views'): Listing[] => {
  return [...listings].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return a.id.localeCompare(b.id);
    } else if (sortBy === 'deadline') {
      return (a.partnerSearchDeadline || '').localeCompare(b.partnerSearchDeadline || '');
    } else if (sortBy === 'views') {
      return (b.views ?? 0) - (a.views ?? 0);
    }
    return 0;
  });
};
