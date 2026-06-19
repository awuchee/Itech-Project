module.exports = function(api) {
  api.cache(true);

  // Detect if we are running an Expo npm lifecycle script
  const isExpo = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes("expo");

  if (isExpo) {
    return {
      presets: ['babel-preset-expo']
    };
  }

  // Next.js standard build preset fallback
  return {
    presets: ['next/babel']
  };
};


