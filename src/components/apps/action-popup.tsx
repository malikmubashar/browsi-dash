"use client";
import { DeleteTwoTone, AddHomeRounded, CheckCircleTwoTone, DrawTwoTone, RemoveCircleOutlineRounded, DoneAllTwoTone } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { setSelectionMode, updateHomeScreen, updateAppScreen } from '@/lib/reducers';
import { openDB } from 'idb';
import type { ShortcutType } from '@/types';
import toast from 'react-hot-toast';
import { useDialog } from '@/lib/dialog';

export default function ActionPopup({ name = "", _id, elem, _for, cleanUp }: {
    name: string;
    _id: number | string;
    elem: HTMLDivElement | null;
    _for: "app" | "group";
    cleanUp: () => void;
}) {
    const db = useRef<any>();
    const [shortcut, setShortcut] = useState<ShortcutType>();
    const table = "shortcuts";
    const dispatch = useDispatch();
    const { open } = useDialog();

    useEffect(() => {
        (async () => ((db.current = await openDB('browsi-dash')) && _for === "app" && setShortcut(await db.current.get(table, _id))))();
    }, [_id]);

    return (
        <div className="bg-cl/10 backdrop-blur-xl rounded-xl text-cl/80 shadow w-36">
            <div className='p-2 text-xs'>
                <div className='pb-3 w-full flex justify-between'>
                    <p className='font-bold p-1'>{name}</p>
                    <div>
                        {_for === "app" && <DrawTwoTone className='scale-90 btn-icon' onClick={() => open('shortcuts', { action: "edit", _id })} />}
                    </div>
                </div>
            </div>
            <div className='flex justify-around py-1 px-2 bg-cl/5 rounded-[inherit] *:flex *:flex-col *:text-[10px] *:text-nowrap *:items-center *:scale-75 *:rounded *:pointer hover:*:text-bd/50 *:transition-all active:*:text-bd/80'>
                <div onClick={() => {
                    dispatch(setSelectionMode(true));
                    (elem?.previousElementSibling as HTMLInputElement).click();
                    cleanUp();
                }}>
                    <CheckCircleTwoTone />
                    <span>Select</span>
                </div>
                {_for === "app" && (
                    <div onClick={async () => {
                        shortcut?.home ? (delete shortcut.home) : (shortcut && (shortcut.home = true));
                        typeof (await db.current.put(table, shortcut)) === "number" && toast(shortcut?.home ? "Added To Home" : "Removed From Home") && !Boolean(cleanUp()) && dispatch(updateHomeScreen(null));
                    }}>
                        {shortcut?.home ? <RemoveCircleOutlineRounded /> : <AddHomeRounded />}
                        <span>{shortcut?.home ? "Remove Home" : "Add to Home"}</span>
                    </div>
                )}
                <div onClick={async () => {
                    try {
                        _for === "app" && await db.current.delete('shortcuts', _id);
                        if (_for === 'group') {
                            const store = await db.current.transaction(table, "readwrite").objectStore(table);
                            await Promise.all((await store.index("groupPart").getAll(_id)).map(async (x: ShortcutType) => {
                                delete x.groupPart;
                                return await store.put(x);
                            }));
                        }
                        dispatch(updateHomeScreen(null));
                        dispatch(updateAppScreen(null));
                        cleanUp();
                    } catch (err: any) {
                        toast.error(err.message);
                        console.error(err);
                    }
                }}>
                    <DeleteTwoTone />
                    <span>Delete</span>
                </div>
            </div>
        </div >
    )
}
