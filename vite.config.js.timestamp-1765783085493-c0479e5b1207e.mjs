// vite.config.js
import { defineConfig } from "file:///E:/laragon/www/ncmd-es/node_modules/vite/dist/node/index.js";
import laravel from "file:///E:/laragon/www/ncmd-es/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///E:/laragon/www/ncmd-es/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///E:/laragon/www/ncmd-es/node_modules/@tailwindcss/vite/dist/index.mjs";
import svgr from "file:///E:/laragon/www/ncmd-es/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/js/main.jsx",
        "resources/sass/app.scss",
        "resources/css/app.css"
      ],
      refresh: true
    }),
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        exportAsDefault: false,
        exportType: "named"
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxuY21kLWVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxuY21kLWVzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9sYXJhZ29uL3d3dy9uY21kLWVzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFtcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2pzL21haW4uanN4JywgXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9zYXNzL2FwcC5zY3NzJyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2Nzcy9hcHAuY3NzJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICAgICAgc3Zncih7IFxuICAgICAgICBzdmdyT3B0aW9uczoge1xuICAgICAgICAgICAgZXhwb3J0QXNEZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydFR5cGU6ICduYW1lZCdcbiAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UCxTQUFTLG9CQUFvQjtBQUN6UixPQUFPLGFBQWE7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sVUFBVTtBQUdqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDSDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0osU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBLE1BQ0wsYUFBYTtBQUFBLFFBQ1QsaUJBQWlCO0FBQUEsUUFDakIsWUFBWTtBQUFBLE1BQ2hCO0FBQUEsSUFDQSxDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
