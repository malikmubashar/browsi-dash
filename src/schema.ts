import z from "zod";
import { UniqueId, generateIcon } from "@/utils";


export const ShortcutSchema = z.object({
    _id: z.number().default(UniqueId),
    name: z.string().min(1),
    url: z.string().url(),
    icon: z.string().optional(),
    createdAt: z.number().default(() => new Date().getTime()),
    updatedAt: z.number().optional(),
    groupPart: z.string().optional(),
    home: z.number().optional().or(z.boolean()),
    isCheck: z.boolean().optional()
}).transform(async (data) => {
    // if isChech field is true then generateIcon not runs
    data.isCheck || (data['icon'] = await generateIcon(data.url));
    delete data.isCheck;
    // removing home field if its value is other than true
    data.home !== true && (delete data.home);
    // removing groupPart field if it has 0 values without spaces
    data.groupPart?.replaceAll(/\s/g, "").length === 0 && (delete data.groupPart);
    return data;
});

export type ShortcutType = z.infer<typeof ShortcutSchema>;