const bs = require("browser-sync").create();

bs.init({
  server: "./public"
});

bs.watch(["public/**/*"]).on("change", bs.reload);