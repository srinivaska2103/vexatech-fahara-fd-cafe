import { axiosInstance } from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

const normalizePackage = (pkg, cafeInfo = null) => {
  let inc = pkg.inclusions;
  if (typeof inc === 'string') {
    try { inc = JSON.parse(inc); } catch (e) { inc = []; }
  }

  let eventType = pkg.event_type ||
    (inc && typeof inc === 'object' && !Array.isArray(inc) ? (inc.event_type || inc.category) : null) ||
    pkg.category;

  // Smart fallback for existing packages: infer category from package_name if missing or default
  const pkgNameLower = (pkg.package_name || '').toLowerCase();
  if (pkgNameLower.includes('anniversary')) {
    eventType = 'Anniversary';
  } else if (pkgNameLower.includes('corporate')) {
    eventType = 'Corporate Meeting';
  } else if (pkgNameLower.includes('date night') || pkgNameLower.includes('candlelight')) {
    eventType = 'Date Night';
  } else if (pkgNameLower.includes('wedding')) {
    eventType = 'Wedding';
  } else if (pkgNameLower.includes('engagement')) {
    eventType = 'Engagement';
  } else if (pkgNameLower.includes('photoshoot')) {
    eventType = 'Photoshoot';
  } else if (pkgNameLower.includes('workshop')) {
    eventType = 'Workshop';
  } else if (pkgNameLower.includes('baby shower')) {
    eventType = 'Baby Shower';
  } else if (!eventType) {
    eventType = 'Birthday';
  }

  const durationVal = pkg.duration_value || (inc && typeof inc === 'object' && !Array.isArray(inc) ? inc.duration_value : null) || pkg.duration_hours || null;
  const durationUnit = pkg.duration_unit || (inc && typeof inc === 'object' && !Array.isArray(inc) ? inc.duration_unit : null) || 'Hours';
  const maxGuests = pkg.maximum_persons || pkg.max_guests || (inc && typeof inc === 'object' && !Array.isArray(inc) ? inc.maximum_persons : null) || null;

  const finalInclusions = Array.isArray(inc)
    ? inc
    : (Array.isArray(inc?.items) ? inc.items : (Array.isArray(inc?.inclusions) ? inc.inclusions : (Array.isArray(pkg.package_inclusions) ? pkg.package_inclusions : [])));

  return {
    ...pkg,
    event_type: eventType,
    category: eventType,
    duration_value: durationVal,
    duration_unit: durationUnit,
    maximum_persons: maxGuests,
    inclusions: finalInclusions,
    cafe: cafeInfo || pkg.cafe || null,
  };
};

export const eventService = {
  // Aggregate all events (packages) from the owner's cafes
  getEvents: async (params = {}) => {
    const response = await axiosInstance.get(ENDPOINTS.cafes.list, { params });
    const cafes = Array.isArray(response.data?.data) ? response.data.data : [];
    
    let allEvents = [];
    cafes.forEach(cafe => {
      if (cafe.cafe_packages && Array.isArray(cafe.cafe_packages)) {
        const packagesWithCafeInfo = cafe.cafe_packages.map(pkg => 
          normalizePackage(pkg, { id: cafe.id, name: cafe.name })
        );
        allEvents = [...allEvents, ...packagesWithCafeInfo];
      }
    });
    
    return allEvents;
  },

  // Get a single event by ID
  getEventById: async (id) => {
    // 1. Check cafe packages endpoint first (primary source of truth for cafe owner packages)
    try {
      const cafePkgRes = await axiosInstance.get(`/cafes/packages/${id}`);
      const cafePkg = cafePkgRes.data?.data || cafePkgRes.data;
      if (cafePkg && cafePkg.id) {
        return { data: normalizePackage(cafePkg) };
      }
    } catch (e) {
      // Not found in cafe_packages directly
    }

    // 2. Check event-packages table
    try {
      const pkgRes = await axiosInstance.get(ENDPOINTS.events.detail(id));
      const pkg = pkgRes.data?.data || pkgRes.data;
      if (pkg && pkg.id) {
        return { data: normalizePackage(pkg) };
      }
    } catch (e) {
      // Fallback
    }

    // 3. Fallback scan across all owner cafes
    const response = await axiosInstance.get(ENDPOINTS.cafes.list);
    const cafes = Array.isArray(response.data?.data) ? response.data.data : [];
    
    let foundEvent = null;
    cafes.forEach(cafe => {
      if (cafe.cafe_packages && Array.isArray(cafe.cafe_packages)) {
        const pkg = cafe.cafe_packages.find(p => p.id === id);
        if (pkg) {
          foundEvent = normalizePackage(pkg, { id: cafe.id, name: cafe.name });
        }
      }
    });

    if (!foundEvent) throw new Error('Event not found');
    return { data: foundEvent };
  },

  // Create a new event (package)
  createEvent: async (cafeId, data) => {
    const inclusionsArr = Array.isArray(data.inclusions) ? data.inclusions : [];
    
    // Primary: create in cafe_packages table
    const cafePkgRes = await axiosInstance.post(`/cafes/${cafeId}/packages`, {
      ...data,
      event_type: data.event_type || 'Birthday',
      inclusions: inclusionsArr,
    });

    const createdPackage = cafePkgRes.data?.data || cafePkgRes.data;

    // Optional sync to event_packages table
    try {
      const pkgPayload = {
        id: createdPackage?.id,
        provider_id: cafeId,
        provider_type: 'CAFE',
        event_type: data.event_type || 'Birthday',
        package_name: data.package_name,
        package_level: 'CUSTOM',
        description: data.description,
        base_price: Number(data.price || data.base_price || 0),
        inclusions: inclusionsArr,
      };
      await axiosInstance.post(ENDPOINTS.events.create, pkgPayload);
    } catch (e) {
      console.warn('Sync to event-packages endpoint skipped:', e.message);
    }

    return cafePkgRes.data;
  },

  // Update an existing event
  updateEvent: async (packageId, data) => {
    const inclusionsArr = Array.isArray(data.inclusions) ? data.inclusions : [];

    const response = await axiosInstance.put(`/cafes/packages/${packageId}`, {
      ...data,
      event_type: data.event_type || 'Birthday',
      inclusions: inclusionsArr,
    });

    if (data.cafe_id) {
      try {
        const pkgPayload = {
          id: packageId,
          provider_id: data.cafe_id,
          provider_type: 'CAFE',
          event_type: data.event_type || 'Birthday',
          package_name: data.package_name,
          package_level: 'CUSTOM',
          description: data.description,
          base_price: Number(data.price || data.base_price || 0),
          inclusions: inclusionsArr,
        };
        await axiosInstance.post(ENDPOINTS.events.create, pkgPayload);
      } catch (e) {
        console.warn('Sync to event-packages endpoint skipped:', e.message);
      }
    }

    return response.data;
  },

  // Delete an event
  deleteEvent: async (packageId) => {
    try {
      await axiosInstance.delete(ENDPOINTS.events.delete(packageId));
    } catch(e) {}

    const response = await axiosInstance.delete(`/cafes/packages/${packageId}`);
    return response.data;
  },

  uploadGalleryImages: async (id, formData) => {
    return { success: true, data: [] };
  },

  deleteGalleryImage: async (eventId, imageId) => {
    return { success: true };
  },

  updateAvailability: async (id, data) => {
    return { success: true };
  }
};
