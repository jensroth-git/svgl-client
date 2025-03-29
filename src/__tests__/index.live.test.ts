import {
  getSvgs,
  getSvgsByCategory,
  getCategories,
  searchSvgs,
  iSVG,
  Category
} from '../index'; // Adjust import path relative to the test file

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Increase timeout for tests involving network requests AND the delay
jest.setTimeout(20000); // Increased timeout to account for delays (e.g., 15s + 1s delay)

describe('SVGL API Client - Integration Tests', () => {

  // Add delay before each test to mitigate rate limiting
  beforeEach(async () => {
    // Adjust delay (in ms) if needed based on API rate limits
    await delay(1000); // 1 second delay
  });

  describe('getSvgs', () => {
    it('should fetch all SVGs', async () => {
      const svgs: iSVG[] = await getSvgs();
      expect(Array.isArray(svgs)).toBe(true);
      expect(svgs.length).toBeGreaterThan(0);
      // Check structure of the first item (if exists)
      if (svgs.length > 0) {
        expect(svgs[0]).toHaveProperty('id');
        expect(svgs[0]).toHaveProperty('title');
        expect(svgs[0]).toHaveProperty('category');
        expect(svgs[0]).toHaveProperty('route');
        expect(svgs[0]).toHaveProperty('url');
      }
    });

    it('should fetch a limited number of SVGs', async () => {
      const limit = 5;
      const svgs: iSVG[] = await getSvgs(limit);
      expect(Array.isArray(svgs)).toBe(true);
      // The API might return less if total < limit, so check <= limit
      expect(svgs.length).toBeGreaterThan(0);
      expect(svgs.length).toBeLessThanOrEqual(limit);
      if (svgs.length > 0) {
          expect(svgs[0]).toHaveProperty('id');
          expect(svgs[0]).toHaveProperty('title');
      }
    });
  });

  describe('getSvgsByCategory', () => {
    it('should fetch SVGs for a valid category (e.g., Software)', async () => {
      const category = 'Software';
      const svgs: iSVG[] = await getSvgsByCategory(category);
      expect(Array.isArray(svgs)).toBe(true);
      expect(svgs.length).toBeGreaterThan(0);
      // Check if all returned SVGs match the requested category
      svgs.forEach(svg => {
          // Category can be string or array of strings
          if (Array.isArray(svg.category)) {
              expect(svg.category).toContain(category);
          } else {
              expect(svg.category).toEqual(category);
          }
      });
      if (svgs.length > 0) {
        expect(svgs[0]).toHaveProperty('id');
        expect(svgs[0]).toHaveProperty('title');
      }
    });

    it('should reject if category does not exist', async () => {
        const category = 'NonExistentCategory12345';
        // Expect the promise to be rejected because the API returns 404
        await expect(getSvgsByCategory(category)).rejects.toThrow(
            'HTTP error! status: 404 Not Found'
        );
    });

    it('should throw an error if category is empty', async () => {
        await expect(getSvgsByCategory('')).rejects.toThrow('Category cannot be empty');
    });
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const categories: Category[] = await getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      // Check structure of the first item (if exists)
      if (categories.length > 0) {
        expect(categories[0]).toHaveProperty('category');
        expect(categories[0]).toHaveProperty('total');
        expect(typeof categories[0].category).toBe('string');
        expect(typeof categories[0].total).toBe('number');
      }
    });
  });

  describe('searchSvgs', () => {
    it('should fetch SVGs matching a search query (e.g., discord)', async () => {
      const query = 'discord'; // Use a common term likely to exist
      const svgs: iSVG[] = await searchSvgs(query);
      expect(Array.isArray(svgs)).toBe(true);
      // Search might return 0 results, which is valid
      if (svgs.length > 0) {
        expect(svgs[0]).toHaveProperty('id');
        expect(svgs[0]).toHaveProperty('title');
        expect(svgs[0].title.toLowerCase()).toContain(query.toLowerCase());
      }
    });

     it('should reject if search query yields no results', async () => {
        const query = 'NoWayThisExistsInSvglDatabaseXxXyZz';
        // Expect the promise to be rejected because the API returns 404
         await expect(searchSvgs(query)).rejects.toThrow(
            'HTTP error! status: 404 Not Found'
        );
    });

    it('should throw an error if search query is empty', async () => {
        await expect(searchSvgs('')).rejects.toThrow('Search query cannot be empty');
    });
  });
}); 