export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "";

export function getCsrfToken(): string {
    return (
        document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1] ?? ""
    );
}
