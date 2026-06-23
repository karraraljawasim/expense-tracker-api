const REDIS_KEY = {
  auth: {
    blacklist: (tokenHash: string) =>
      `expense-tracker:auth:blacklist:${tokenHash}`,
  },
} as const;

export default REDIS_KEY;
