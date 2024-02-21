"use client";
import { useSelector, useDispatch } from "react-redux";
import { setSelectionMode, updateHomeScreen, updateAppScreen } from "@/lib/reducers";
import type { AppState, ShortcutType } from "@/types";
import { ArrowBackIosRounded, DeleteRounded, FolderCopyRounded } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { openDB } from "idb";

export default function Form({ children }: { children: React.ReactNode }) {
    const table = "shortcuts";
    const isSelectionMode = useSelector(({ isSelectionMode }: AppState) => isSelectionMode);
    const form = useRef<HTMLFormElement>(null);
    const [disabling, setDisabling] = useState<{
        remove: boolean,
        group: boolean
        groupLabel: "Group" | "Merge"
    }>({
        remove: true,
        group: true,
        groupLabel: 'Group'
    });
    const data = useRef({
        apps: new Set([]),
        groups: new Set([])
    });
    let [appsLen, groupsLen]: [number, number] = [0, 0];
    const dispatch = useDispatch();
    const db = useRef<any>();

    useEffect(() => {
        (async () => db.current = await openDB('browsi-dash'))()
    }, []);

    async function submitHandle(e: any) {
        e.preventDefault();
        if (e.target?.name === "none") return;
        const action = ((e.nativeEvent as any).submitter.getAttribute('data-action') as string);
        const store = await db.current.transaction(table, "readwrite").objectStore(table);

        if (action === 'remove') {
            data.current.apps.forEach(async (x: string) => {
                await store.delete(Number(x));
            });

            data.current.groups.forEach(async (x: string) => {
                await Promise.all((await store.index("groupPart").getAll(x)).map((x: ShortcutType) => {
                    delete x.groupPart;
                    return store.put(x);
                }));
            });
        }
        else if (action === 'group') {
            if (data.current.groups.size > 0) {
                const firstGroupSelected = data.current.groups.entries().next().value?.[0];
                data.current.apps.forEach(async (x: string) => {
                    await store.put({ ...(await store.get(Number(x))), groupPart: firstGroupSelected });

                });
                data.current.groups.forEach(async (x: string) => {
                    (await store.index("groupPart").getAll(x)).map(async (x: ShortcutType) => {
                        x.groupPart = firstGroupSelected;
                        return await store.put(x);
                    })
                });
            }
            else {
                const rndm = Math.random().toString(34).slice(2);
                data.current.apps.forEach(async (x: string) => {
                    await store.put({ ...(await store.get(Number(x))), groupPart: rndm });
                });
            }
        }

        dispatch(updateHomeScreen(null));
        dispatch(updateAppScreen(null));
        cleanUp(false);
    }

    function validationHandle(e: any) {
        const type = e.target.getAttribute('data-item-type') as string;
        const id = e.target.getAttribute('data-item-id') as never;
        const checked = e.target.checked as boolean;

        if (type === 'app') {
            if (checked) data.current.apps.add(id);
            else data.current.apps.delete(id);
        } else if (type === 'group') {
            if (checked) data.current.groups.add(id);
            else data.current.groups.delete(id);
        }
        [appsLen, groupsLen] = [data.current.apps.size, data.current.groups.size];

        setDisabling({
            remove: (groupsLen > 0 || appsLen > 0) ? false : true,
            group: (groupsLen + appsLen) > 1 ? false : true,
            groupLabel: (groupsLen === 0 && appsLen >= 0) ? 'Group' : 'Merge'
        });
    }

    function cleanUp(hide: boolean = true) {
        data.current.apps.clear();
        data.current.groups.clear();
        [appsLen, groupsLen] = [0, 0];
        form.current?.reset();
        setDisabling({ remove: true, group: true, groupLabel: 'Group' });
        hide && dispatch(setSelectionMode(false));
    }

    return (
        <form
            ref={form}
            className={"p-2 " + (isSelectionMode ? "[&_input[type='checkbox']]:block" : "[&_input[type='checkbox']]:hidden")}
            onSubmit={submitHandle}
            onChange={validationHandle}>
            {isSelectionMode && (
                <div className="bg-cl/5 p-3 flex items-center justify-center rounded-xl text-cl/80 backdrop-blur mb-6">
                    <div>
                        <ArrowBackIosRounded className="btn-icon scale-150" onClick={() => cleanUp()} />
                    </div>
                    <div className="w-full flex justify-end gap-x-6 *:flex *:items-center *:gap-x-1 *:px-2 *:py-0.5 *:bg-cl/5 *:rounded-lg first:*:*:scale-75 *:text-xs hover:*:bg-bd/10 hover:*:text-bd active:*:scale-95 *:pointer">
                        <button type="submit" data-action="remove" data-disabled={disabling.remove}>
                            <DeleteRounded />
                            <p>Remove</p>
                        </button>
                        <button type="submit" data-action="group" data-disabled={disabling.group}>
                            <FolderCopyRounded />
                            <p>{disabling.groupLabel}</p>
                        </button>
                    </div>
                </div>
            )}
            {children}
        </form>
    )
}
