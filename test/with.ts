export async function env<T>(envVars: Record<string, string>, fn: () => Promise<T>): Promise<T> {
  const originalEnv = { ...process.env };

  try {
    // Set temporary env vars
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });

    return await fn();
  } finally {
    // Restore original env vars
    process.env = originalEnv;
  }
}