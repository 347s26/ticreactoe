import type { Route } from "./+types/handle";
import { HandleHome } from "../handleHome";

export default function HandleRoute({ params }: Route.ComponentProps) {
    return <HandleHome handle={params.handle} />;
}
