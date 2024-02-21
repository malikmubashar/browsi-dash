"use server";

export async function Fetch(url: string) {
    return await (await fetch(url, { cache: "no-store" })).text();
}