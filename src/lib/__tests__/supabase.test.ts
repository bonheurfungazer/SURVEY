import { expect, test, mock, describe, beforeEach } from "bun:test";

// We use a variable to capture the arguments passed to createClient
let lastCreatedClient: { url: string; key: string } | null = null;

// Mock the @supabase/supabase-js module
mock.module("@supabase/supabase-js", () => {
  return {
    createClient: mock((url: string, key: string) => {
      lastCreatedClient = { url, key };
      return { url, key }; // Return a dummy client object
    }),
  };
});

describe("Supabase Client Export", () => {
  // Backup original env
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    lastCreatedClient = null;
  });

  test("should initialize createClient with values from process.env", async () => {
    // 1. Setup environment variables
    const mockUrl = "https://my-project.supabase.co";
    const mockKey = "my-awesome-anon-key";

    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockKey;

    try {
      // 2. Import the supabase client module
      // We use a query parameter to bypass Bun's module cache for testing purposes
      // @ts-ignore
      const { supabase } = await import(`../supabase.ts?test=${Math.random()}`);

      // 3. Verify it was called with our mock environment variables
      expect(supabase).toBeDefined();
      expect(lastCreatedClient).not.toBeNull();
      expect(lastCreatedClient?.url).toBe(mockUrl);
      expect(lastCreatedClient?.key).toBe(mockKey);

    } finally {
      // Restore original environment variables correctly
      if (originalUrl === undefined) {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      } else {
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      }

      if (originalKey === undefined) {
        delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      } else {
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
      }
    }
  });

  test("should use fallback values when environment variables are missing", async () => {
    // 1. Clear environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
      // 2. Import the supabase client module with a fresh cache
      // @ts-ignore
      const { supabase } = await import(`../supabase.ts?test=${Math.random()}`);

      // 3. Verify it was called with fallback values
      expect(supabase).toBeDefined();
      expect(lastCreatedClient).not.toBeNull();
      expect(lastCreatedClient?.url).toBe('https://VOTRE_URL_SUPABASE.supabase.co');
      expect(lastCreatedClient?.key).toBe('VOTRE_CLE_PUBLIQUE_SUPABASE');

    } finally {
      // Restore original environment variables
      if (originalUrl === undefined) {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      } else {
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      }

      if (originalKey === undefined) {
        delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      } else {
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
      }
    }
  });
});
