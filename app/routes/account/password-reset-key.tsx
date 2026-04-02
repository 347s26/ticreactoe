import type { Route } from "./+types/password-reset-key";
import { PasswordResetKey } from "../../passwordResetKey";

export default function PasswordResetKeyRoute({ params }: Route.ComponentProps) {
    return <PasswordResetKey emailKey={params.key} />;
}
