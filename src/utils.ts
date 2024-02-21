"use client";
import { Fetch } from "@/lib/fetch";

export function UniqueId() {
    return new Date().getTime() + Math.round(100 + Math.random() * 899);
}

export async function generateIcon(url: string) {
    try {
        const res = new URL(new DOMParser().parseFromString(await Fetch(url), "text/html").head.querySelector("link[rel$='icon']")?.href).pathname;
        console.log(res);
        return new URL(res, new URL(url).origin).href;
    } catch (err) {
        console.error(err);
        return "https://www.google.com/favicon.ico";
    }
}