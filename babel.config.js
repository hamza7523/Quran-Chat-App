module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 1. Process TypeScript FIRST, and explicitly tell it to allow JSX/TSX tags!
      ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true }],
      
      // 2. Transform the class properties for Supabase and Hermes
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object',
      
      // 3. Reanimated must always be LAST
      'react-native-reanimated/plugin',
    ],
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
    },
  };
};