// browsersync config
module.exports = {
  files: ["index.html", "css/*.css", "scripts/*.js", "templates/*.html"],
  server: true,
  browser: "google chrome",
  ghostMode: false,
  https: {
    key: "/usr/local/etc/httpd/certs/bs.key",
    cert: "/usr/local/etc/httpd/certs/bs.crt"
  },
  notify: false,
  startPath: "index.html",
  ui: false,
  logLevel: "debug"
};