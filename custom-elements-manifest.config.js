/**
 * Custom Elements Manifest Configuration
 * 
 * Configuration for generating the custom elements manifest for the logic circuit widget.
 * This manifest provides comprehensive documentation for AI systems and developers.
 */

export default {
  // Globs to analyze
  globs: ['widgets/**/*.ts'],
  
  // Exclude certain files
  exclude: [
    'widgets/src/helper/**',
    'widgets/src/assets/**',
    'widgets/src/styles.ts',
    'localization/**'
  ],

  // Output path for the manifest
  outdir: './',

  // Generate custom elements manifest
  dev: false,

  // Include third party elements
  dependencies: false,

  // Plugin configuration
  plugins: [],

  // Package info
  packagejson: true
};