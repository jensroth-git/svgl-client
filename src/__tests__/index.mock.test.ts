// Remove fetchMock import
// import fetchMock from 'jest-fetch-mock';

// Remove fetchMock.enableMocks();

// Tell Jest to mock node-fetch. This MUST be at the top.
jest.mock('node-fetch');

// Import the code under test AFTER jest.mock
import {
    getSvgs,
    getSvgsByCategory,
    getCategories,
    searchSvgs,
    iSVG,
    Category,
    ThemeOptions
} from '../index';

// Import the mocked fetch function AFTER jest.mock
import fetch from 'node-fetch';

// Cast fetch to Jest's mock function type for type safety
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

// Sample data adhering to the interfaces
const mockSvg1: iSVG = {
    id: 1,
    title: 'Mock SVG 1',
    category: 'Software',
    route: 'https://svgl.app/mock1.svg',
    url: 'https://mock1.com'
};
const mockSvg2: iSVG = {
    id: 2,
    title: 'Mock SVG 2',
    category: ['Library', 'Software'],
    route: {
        light: 'https://svgl.app/mock2-light.svg',
        dark: 'https://svgl.app/mock2-dark.svg'
    },
    wordmark: 'https://svgl.app/mock2-wordmark.svg',
    url: 'https://mock2.com'
};
const mockCategory1: Category = { category: 'Software', total: 50 };
const mockCategory2: Category = { category: 'Library', total: 20 };

// Reset mocks before each test
beforeEach(() => {
    mockedFetch.mockClear();
});

describe('SVGL API Client - Mock Tests', () => {

    describe('getSvgs', () => {
        it('should fetch all SVGs', async () => {
            const mockResponseData = [mockSvg1, mockSvg2];
            // Use mockImplementationOnce and cast the resolved object
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: async () => mockResponseData,
            } as any)); // Use type assertion

            const svgs = await getSvgs();

            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith('https://api.svgl.app/');
            expect(svgs).toEqual(mockResponseData);
        });

        it('should fetch a limited number of SVGs', async () => {
            const limit = 1;
            const mockResponseData = [mockSvg1];
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: async () => mockResponseData,
            } as any)); // Use type assertion

            const svgs = await getSvgs(limit);

            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith(`https://api.svgl.app/?limit=${limit}`);
            expect(svgs).toEqual(mockResponseData);
            expect(svgs.length).toBeLessThanOrEqual(limit);
        });

        it('should handle fetch errors (e.g., network error)', async () => {
            const networkError = new Error('Network Error');
            mockedFetch.mockRejectedValueOnce(networkError);

            await expect(getSvgs()).rejects.toThrow('Network Error');
            expect(mockedFetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('getSvgsByCategory', () => {
        it('should fetch SVGs for a valid category', async () => {
            const category = 'Software';
            const mockResponseData = [mockSvg1, mockSvg2];
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: async () => mockResponseData,
            } as any)); // Use type assertion

            const svgs = await getSvgsByCategory(category);

            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith(`https://api.svgl.app/category/${category}`);
            expect(svgs).toEqual(mockResponseData);
        });

        it('should reject if category does not exist (API 404)', async () => {
            const category = 'NonExistent';
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            } as any)); // Use type assertion

            await expect(getSvgsByCategory(category)).rejects.toThrow('HTTP error! status: 404 Not Found');
            expect(mockedFetch).toHaveBeenCalledWith(`https://api.svgl.app/category/${category}`);
            expect(mockedFetch).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if category is empty (client-side)', async () => {
            await expect(getSvgsByCategory('')).rejects.toThrow('Category cannot be empty');
            expect(mockedFetch).not.toHaveBeenCalled();
        });
    });

    describe('getCategories', () => {
        it('should fetch all categories', async () => {
            const mockResponseData = [mockCategory1, mockCategory2];
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: async () => mockResponseData,
            } as any)); // Use type assertion

            const categories = await getCategories();

            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith('https://api.svgl.app/categories');
            expect(categories).toEqual(mockResponseData);
        });

        it('should handle fetch errors', async () => {
            const apiError = new Error('API Down');
            mockedFetch.mockRejectedValueOnce(apiError);

            await expect(getCategories()).rejects.toThrow('API Down');
            expect(mockedFetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('searchSvgs', () => {
        it('should fetch SVGs matching a search query', async () => {
            const query = 'Mock';
            const mockResponseData = [mockSvg1, mockSvg2];
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: async () => mockResponseData,
            } as any)); // Use type assertion

            const svgs = await searchSvgs(query);

            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(mockedFetch).toHaveBeenCalledWith(`https://api.svgl.app/?search=${query}`);
            expect(svgs).toEqual(mockResponseData);
        });

        it('should reject if search query yields no results (API 404)', async () => {
            const query = 'NotFoundQuery';
            mockedFetch.mockImplementationOnce(() => Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            } as any)); // Use type assertion

            await expect(searchSvgs(query)).rejects.toThrow('HTTP error! status: 404 Not Found');
            expect(mockedFetch).toHaveBeenCalledWith(`https://api.svgl.app/?search=${query}`);
            expect(mockedFetch).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if search query is empty (client-side)', async () => {
            await expect(searchSvgs('')).rejects.toThrow('Search query cannot be empty');
            expect(mockedFetch).not.toHaveBeenCalled();
        });
    });
}); 