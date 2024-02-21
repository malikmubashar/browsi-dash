"use client";
import { Fetch } from "@/lib/fetch";

export function UniqueId() {
    return new Date().getTime() + Math.round(100 + Math.random() * 899);
}

export async function generateIcon(name: string, url: string) {
    try {
        const res = await Fetch(url);
        const icon_url = new URL(new URL(new DOMParser().parseFromString(res, "text/html").head.querySelector("link[rel$='icon']")?.getAttribute("href") as string).pathname, new URL(url).origin).href;
        console.log(await fetch(icon_url));
        return icon_url;
    } catch (err) {
        console.error(err);
        const size = 500;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
            ctx['fillStyle'] = '#235fe6';
            ctx.font = '300px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"';
            const s = ctx.measureText(name[0]);
            ctx.fillText(name[0], (size / 2) - s.width / 2, (size / 2) + s.actualBoundingBoxRight / 1.5);
        }
        return canvas.toDataURL();
    }
}