import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("handle/:handle", "routes/handle.tsx"),
    route("handle/:handle/game/:joinCode", "routes/handle-game.tsx"),
    route("join/:joinCode", "routes/join.tsx"),
    route("login", "routes/login.tsx"),
    route("account/signup", "routes/account/signup.tsx"),
    route("account/verify-email/:key", "routes/account/verify-email.tsx"),
    route("account/password/reset/key/:key", "routes/account/password-reset-key.tsx"),
] satisfies RouteConfig;