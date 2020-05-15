const appContext = require.context("./", true, /\.spec\.ts$/);
console.log(appContext.keys());
appContext.keys().forEach(appContext);
