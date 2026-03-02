import {
type RouteConfig,
index,
route
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/sitemap.xml", "routes/sitemap[.].xml.ts"),
] satisfies RouteConfig;