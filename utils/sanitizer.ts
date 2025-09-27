/**
 * A simple HTML sanitizer that removes script tags to prevent XSS.
 * For a production app with complex user-input, a more robust library 
 * like DOMPurify would be recommended, but this provides a basic layer of security.
 * @param html The HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHTML = (html: string): string => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    // Remove <script> tags and their content
    let sanitized = html.replace(/<script\b[^>]*>.*?<\/script>/gi, '');
    // Remove on* event attributes
    sanitized = sanitized.replace(/ on\w+="[^"]*"/g, '');
    sanitized = sanitized.replace(/ on\w+='[^']*'/g, '');
    return sanitized;
};

/**
 * Performs a deep clone of an object, safely handling circular references
 * and converting complex Firestore types (Timestamp, GeoPoint, DocumentReference)
 * into simple, serializable JavaScript objects. This is crucial for copying
 * state from Firebase to prevent errors with JSON serialization or React state updates.
 * @param obj The object to clone.
 * @param cache A WeakMap to store cloned objects to handle cycles.
 * @returns A deep, sanitized copy of the object.
 */
export const cloneDeep = <T>(obj: T, cache = new WeakMap()): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Firestore Timestamps by converting them to JS Dates.
  if (typeof (obj as any).toDate === 'function' && (obj as any).nanoseconds !== undefined && (obj as any).seconds !== undefined) {
    try {
      return (obj as any).toDate() as any;
    } catch (e) {
      return null as any; // Or handle error appropriately
    }
  }

  // Handle Firestore GeoPoint
  if (obj && typeof (obj as any).latitude === 'number' && typeof (obj as any).longitude === 'number' && typeof (obj as any).isEqual === 'function') {
      return { latitude: (obj as any).latitude, longitude: (obj as any).longitude } as any;
  }

  // Handle Firestore DocumentReference
  if (obj && typeof (obj as any).path === 'string' && typeof (obj as any).id === 'string' && (obj as any).firestore) {
      return (obj as any).path as any; // Convert reference to its string path
  }

  // Handle standard JS Dates
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  // Handle cycles by returning the already-cloned instance
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const copy: any = Array.isArray(obj) ? [] : {};
  // Store the new copy in the cache before recursively cloning to handle cycles
  cache.set(obj, copy);
  
  // Use for...in with hasOwnProperty to safely iterate over all owned properties.
  // Crucially, we skip functions to avoid cloning methods that might hold circular references.
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];
      // Only clone data properties, not methods/functions.
      if (typeof value !== 'function') {
        copy[key] = cloneDeep(value, cache);
      }
    }
  }
  
  return copy as T;
};