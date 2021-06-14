module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "defaults",
      },
    ],
    "@babel/preset-typescript",
  ],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
};