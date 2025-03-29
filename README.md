# SVGL API Client

A simple Node.js client library for interacting with the [SVGL API](https://svgl.app).
Fetch SVG logo information easily in your TypeScript or JavaScript projects.

[![npm version](https://badge.fury.io/js/svgl-client.svg)](https://badge.fury.io/js/svgl-client)

## Installation

```bash
npm install svgl-client
# or
yarn add svgl-client
```

## Usage

Import the necessary functions from the package:

```typescript
import {
  getSvgs,
  getSvgsByCategory,
  getCategories,
  searchSvgs,
  // Types (optional)
  iSVG,
  Category
} from 'svgl-client';

// Example usage:

// Get all SVGs
async function fetchAllSvgs() {
  try {
    const svgs: iSVG[] = await getSvgs();
    console.log('All SVGs:', svgs.slice(0, 5)); // Log first 5
  } catch (error) {
    console.error('Error fetching all SVGs:', error);
  }
}

// Get a limited number of SVGs
async function fetchLimitedSvgs(limit: number) {
  try {
    const svgs: iSVG[] = await getSvgs(limit);
    console.log(`Limited SVGs (first ${limit}):`, svgs);
  } catch (error) {
    console.error('Error fetching limited SVGs:', error);
  }
}

// Get SVGs by category
async function fetchSvgsByCategory(categoryName: string) {
  try {
    const svgs: iSVG[] = await getSvgsByCategory(categoryName);
    console.log(`SVGs in category "${categoryName}":`, svgs.slice(0, 5)); // Log first 5
  } catch (error) {
    console.error(`Error fetching SVGs for category ${categoryName}:`, error);
  }
}

// Get all categories
async function fetchCategories() {
  try {
    const categories: Category[] = await getCategories();
    console.log('All Categories:', categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Search SVGs by name
async function searchSvgsByName(query: string) {
  try {
    const svgs: iSVG[] = await searchSvgs(query);
    console.log(`Search results for "${query}":`, svgs);
  } catch (error) {
    console.error(`Error searching for SVGs with query "${query}":`, error);
  }
}

// --- Run examples ---
fetchAllSvgs();
fetchLimitedSvgs(10);
fetchSvgsByCategory('Software');
fetchCategories();
searchSvgsByName('axiom');

```

## API

*   `getSvgs(limit?: number): Promise<iSVG[]>`: Fetches all SVGs or a limited number.
*   `getSvgsByCategory(category: string): Promise<iSVG[]>`: Fetches SVGs filtered by a specific category name.
*   `getCategories(): Promise<Category[]>`: Fetches all available categories and the count of SVGs in each.
*   `searchSvgs(query: string): Promise<iSVG[]>`: Searches for SVGs by name.

## Types

The package exports the following TypeScript types:

*   `iSVG`: Interface representing an SVG object.
```typescript
interface iSVG {
  id?: number;
  title: string;
  category: tCategory | tCategory[];
  route: string | ThemeOptions;
  wordmark?: string | ThemeOptions;
  brandUrl?: string;
  url: string;
}
```
*   `Category`: Interface representing a category object.
```typescript
interface Category {
  category: string;
  total: number;
}
```
*   `ThemeOptions`: Type for theme-specific routes/wordmarks.
```typescript
type ThemeOptions = {
  dark: string;
  light: string;
};
```
*   `tCategory`: Type representing the category name (currently `string`).

## Testing

This package uses Jest for testing.

*   **Mock Tests (Default):** These tests run quickly using mocked API responses and do not hit the live SVGL API. Run them with:
    ```bash
    npm test
    ```
*   **Live Integration Tests:** These tests make actual requests to the SVGL API to ensure real-world integration. They are slower and may be subject to rate limiting by the API. Run them sequentially with:
    ```bash
    npm run test:live
    ```

## Limitations

*   The SVGL API is rate-limited. Please use responsibly.
*   Per the API owner: "Don't use the API for create the same product as SVGL. The API is intended to be used for extensions, plugins, or other tools that can help the community."

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](./LICENSE) 