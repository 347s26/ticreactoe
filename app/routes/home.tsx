import type { Route } from "./+types/home";
import { Landing } from "../Landing/index";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TicReacToe" },
        { name: "description", content: "TicTacToe in React" },
    ];
}

export default function Home() {
    return <Landing />;
}