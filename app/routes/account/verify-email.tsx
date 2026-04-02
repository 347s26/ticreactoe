import type { Route } from "./+types/verify-email";
import { VerifyEmail } from "../../verifyEmail";

export default function VerifyEmailRoute({ params }: Route.ComponentProps) {
    return <VerifyEmail emailKey={params.key} />;
}
