"use client";
import { useState, useRef, useEffect } from "react";
import { ShortcutSchema } from "@/schema";
import { openDB } from "idb";
import { AddHomeRounded } from '@mui/icons-material';
import type { ShortcutType } from "@/types";
import { useDispatch } from "react-redux";
import { updateHomeScreen, updateAppScreen } from "@/lib/reducers";
import toast from "react-hot-toast";

export default function ShortcutForm({ action, close, _id }: { action: "add" | "edit", close: () => void, _id?: number }) {
    const table = "shortcuts";
    const db = useRef<any>();
    const [disabled, setDisabled] = useState<["d" | "l", Boolean]>(["d", true]);
    const data = useRef({ name: "", url: "", groupPart: "", home: false });
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            db.current = await openDB('browsi-dash');
            if (_id && action === "edit") {
                data.current = await db.current.get(table, _id);
                setDisabled(["d", true]);
            }
        })();
    }, []);

    async function validateHandler(e: { target: { name: string, value: boolean } }) {
        let { name, value } = e.target;
        (data['current'] as any)[name] = value;
        const res = await ShortcutSchema.safeParseAsync({ ...data.current, isCheck: true });
        console.log(res);
        res.success ? setDisabled(['d', false]) : setDisabled(['d', true]);
    }

    async function submitHandler(e: any) {
        e.preventDefault();
        try {
            if (disabled[1]) return;
            setDisabled(['l', true]);
            if (action === "add")
                typeof (await db.current.add(table, (await ShortcutSchema.safeParseAsync(data.current) as { data: ShortcutType }).data)) === "number" && toast.success("Successfully Inserted to Database.");
            else if (_id && action === "edit") {
                typeof (await db.current.put(table, { ...data.current, updatedAt: new Date().getTime() })) === "number" && toast.success("Successfully Updated to Database.");
            }
            dispatch(updateHomeScreen(null));
            dispatch(updateAppScreen(null));
            close();
        } catch (err: any) {
            setDisabled(['d', true]);
            toast.error(err.message);
            console.error(err);
        }
    }

    return (
        <div className="fixed inset-0 bg-cl/5 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <form
                className="p-5 z-50 bg-py rounded-2xl shadow shadow-cl/5 w-[min(500px,95%)] flex flex-col gap-y-4"
                onSubmit={submitHandler}
                onChange={validateHandler as never}>
                <h1 className="text-sm">{action === "add" ? 'Add' : "Edit"} shortcut</h1>
                <div className="flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2 relative">
                        <label
                            htmlFor="name"
                            className="text-[11px] font-medium opacity-70">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            autoFocus
                            className="w-full bg-cl/10 hover:bg-cl/20 rounded-t-xl p-2.5 focus:outline-none caret-bd text-xs border-b border-cl/50 [&:focus+*]:animate-spread-border [&:focus+*]:bg-bd "
                            defaultValue={data.current.name} />
                        <div className="h-[1.4px] absolute w-full bottom-0"></div>
                    </div>
                    <div className="flex flex-col gap-y-2 relative">
                        <label
                            htmlFor="url"
                            className="text-[11px] font-medium opacity-70">
                            URL
                        </label>
                        <input
                            type="text"
                            name="url"
                            className="w-full bg-cl/10 hover:bg-cl/20 rounded-t-xl p-2.5 focus:outline-none caret-bd text-xs border-b border-cl/50 [&:focus+*]:animate-spread-border [&:focus+*]:!bg-bd"
                            defaultValue={data.current.url} />
                        <div className="h-[1.4px] absolute w-full bottom-0"></div>
                    </div>
                </div>
                <div className="flex items-center gap-x-3 pt-3">
                    <input
                        type="text"
                        name="groupPart"
                        placeholder="Group Name"
                        className="px-2.5 py-1.5 border border-cl/20 w-32 rounded-lg text-sm focus:outline-none focus:border-bd/30 font-semibold focus:opacity-70 opacity-50 bg-cl/5"
                        defaultValue={data.current.groupPart} />
                    <div
                        className="flex justify-center items-center relative">
                        <AddHomeRounded className={"!scale-150 btn-icon !rounded-lg " + (data.current.home ? "!border-bd/30 !bg-bd/20 text-bd" : "!border-cl/10 text-cl/70")} onClick={async () => await validateHandler({ target: { name: "home", value: !data.current.home } })} />
                    </div>
                </div>
                <div className="flex justify-end gap-x-2 mt-5">
                    <button
                        type="button"
                        className="btn !rounded-full btn-sy"
                        onClick={close}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn !rounded-full"
                        data-loading={(disabled[0] === "l" && disabled[1])}
                        data-disabled={(disabled[0] === "d" && disabled[1])} >
                        Done
                    </button>
                </div>
            </form>
        </div>
    )
}
