// Use require for CommonJS compatibility with Jest mocking
const fetch = require('node-fetch');

const BASE_URL = 'https://api.svgl.app';

// --- Types ---
// Re-exporting types for consumers of the package
export interface Category {
  category: string;
  total: number;
}

export type ThemeOptions = {
  dark: string;
  light: string;
};

// Note: tCategory is a very large union type. For simplicity in this basic client,
// we'll represent it as string. Consumers can add more specific typing if needed.
export type tCategory = string;

export interface iSVG {
  id?: number;
  title: string;
  category: tCategory | tCategory[];
  route: string | ThemeOptions;
  wordmark?: string | ThemeOptions;
  brandUrl?: string;
  url: string;
}

// --- API Functions ---

/**
 * Fetches data from the SVGL API.
 * @param endpoint The API endpoint to call (e.g., "", "/categories", "/category/software").
 * @param params Optional query parameters.
 * @returns A promise that resolves to the fetched data.
 */
async function fetchData<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw error; // Re-throw the error
  }
}

/**
 * Get all SVGs or a limited number.
 * @param limit Optional limit for the number of SVGs to return.
 * @returns A promise that resolves to an array of SVGs.
 */
export async function getSvgs(limit?: number): Promise<iSVG[]> {
  const params = limit ? { limit } : undefined;
  return fetchData<iSVG[]>('', params);
}

/**
 * Filter SVGs by category.
 * @param category The category name to filter by.
 * @returns A promise that resolves to an array of SVGs matching the category.
 */
export async function getSvgsByCategory(category: string): Promise<iSVG[]> {
  if (!category) {
    throw new Error('Category cannot be empty');
  }
  // Basic sanitization: remove potential leading/trailing slashes
  const sanitizedCategory = category.replace(/^\/+|\/+$/g, '');
  return fetchData<iSVG[]>(`/category/${sanitizedCategory}`);
}

/**
 * Get all categories with the total count of SVGs in each.
 * @returns A promise that resolves to an array of categories.
 */
export async function getCategories(): Promise<Category[]> {
  return fetchData<Category[]>('/categories');
}

/**
 * Search SVGs by name.
 * @param query The search query.
 * @returns A promise that resolves to an array of SVGs matching the search query.
 */
export async function searchSvgs(query: string): Promise<iSVG[]> {
  if (!query) {
    throw new Error('Search query cannot be empty');
  }
  return fetchData<iSVG[]>('', { search: query });
} 