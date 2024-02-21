"use client";
import { useSelector } from "react-redux";
import type { AppState } from "@/types";
import ShortcutForm from "./dialogs/app-add-form";
import Permission from "./dialogs/permission";

export default function Dialogs() {
    const { current, props } = useSelector((state: AppState) => state.dialog);
    switch (current) {
        case "shortcuts":
            return <ShortcutForm {...props} />;
        case "permission":
            return <Permission {...props} />;
        default:
            return <></>;
    }
}
