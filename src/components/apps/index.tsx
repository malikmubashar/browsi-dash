"use client";
import { useState, useRef, useEffect, use } from "react";
import ActionPopup from "./action-popup";
import { eventManager } from "./manager";
import Form from "./form";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from '@mui/material/styles';
import { openDB } from "idb";
import type { ShortcutType, AppState } from "@/types";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Popup = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'transparent'
    },
}));

const table = "shortcuts";

export default function Apps() {
    const [data, setData] = useState<any>([]);
    const db = useRef<any>();
    const router = useRouter();
    const updateScreen = useSelector(({ appScreen }: AppState) => appScreen);
    const sd = Object.entries(data.reduce((result: { [key: string]: Array<ShortcutType> }, x: ShortcutType) => {
        const key = typeof x.groupPart === "string" ? x.groupPart : "free";
        !result[key] && (result[key] = []);
        result[key].push(x);
        return result;
    }, {}));

    useEffect(() => {
        (async () => setData(await (db.current = await openDB('browsi-dash')).getAll('shortcuts')))();
    }, [updateScreen]);

    return (
        <Form>
            <section className="!h-min grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 items-start gap-y-5 p-2 overflow-y-auto [--box-size:calc(5vw+51px)] [--box-round:24px]" style={{
                gridTemplateRows: 'repeat(auto-fill, minmax(2, 1fr)'
            }}>
                {sd.map(([key, obj]: any, index: number) => {
                    if (key === 'free') return obj.map((x: ShortcutType) => <Box key={x._id} {...x} router={router} />);
                    else
                        return <Group key={index} name={key} obj={obj} db={db} router={router} />;
                })}
            </section>
        </Form>
    )
}

function Box({ name, icon, _id, url, router }: ShortcutType & { router: any }) {
    const [popup, setPopup] = useState(false);
    const elem = useRef(null);


    return (
        <>
            {popup && (<div className={"fixed inset-0 z-10 " + (popup ? "" : "bg-cl/50 backdrop-blur")} onClick={(e: any) => { e.stopPropagation(); popup && setPopup(false) }}></div>)}
            <div className="app-box flex flex-col items-center justify-start">
                <Popup
                    open={popup}
                    title={<ActionPopup
                        _for="app"
                        name={name}
                        _id={_id}
                        elem={elem.current}
                        cleanUp={() => setPopup(false)} />}>
                    <div className="relative">
                        <input
                            type="checkbox"
                            name="select"
                            data-item-id={_id}
                            data-item-type="app"
                            className="absolute pointer -top-2 -left-2" />
                        <div
                            id="box"
                            ref={elem}
                            data-url={url}
                            className="size-[--box-size] rounded-[--box-round] transition-all ring-cl/5 hover:ring-4 pointer backdrop-blur-sm bg-py/50"
                            onMouseDown={() => {
                                eventManager(elem.current, {
                                    onClick: () => router.push(url),
                                    onPress: () => setPopup(true)
                                });

                            }}
                        >
                            <img src={icon} alt={name} className="size-full rounded-[inherit] border border-cl/20 object-cover bg-cl/5 pointer-event-none" />
                        </div>
                    </div>
                </Popup>
                <p className="text-xs font-normal text-center p-1 overflow-hidden text-ellipsis text-nowrap">{name}</p>
            </div>
        </>
    );
}

function Group({ name, obj, db, router }: { name: string, obj: Array<ShortcutType>, db: { current: any }, router: any }) {
    const [open, setOpen] = useState(false);
    const [popup, setPopup] = useState(false);
    const elem = useRef(null);
    const newName = useRef("");

    return (
        <>
            {(open || popup) && (<div className={"fixed inset-0 z-10 pointer " + (popup ? "" : "bg-cl/5 backdrop-blur-3xl")} onClick={(e: any) => {
                e.stopPropagation();
                open && setOpen(false);
                popup && setPopup(false);
                if (newName.current !== name && newName.current !== "") {
                    const store = db.current.transaction(table, 'readwrite').objectStore(table);
                    obj.forEach((x: ShortcutType) => {
                        store.put({ ...x, groupPart: newName.current });
                    });
                }
            }}></div>)}
            <div
                className={"flex items-center justify-center " + (open ? "flex-col-reverse absolute inset-[50%] -translate-x-[50%] -translate-y-[50%] z-20" : "flex-col")}
            >
                <Popup
                    open={popup}
                    title={<ActionPopup
                        _for="group"
                        name={name}
                        _id={name}
                        elem={elem.current}
                        cleanUp={() => setPopup(false)} />}>
                    <div className={"relative " + (open && "pointer-events-none")}>
                        <input
                            type="checkbox"
                            name="select"
                            data-item-type="group"
                            data-item-id={name}
                            className="absolute pointer -top-2 -left-2" />
                        <div
                            ref={elem}
                            className={"grid gap-2 bg-cl/5 backdrop-blur-sm grid-cols-3 grid-rows-3 [&>div>div]:p-0 border border-cl/10 " + (open ? "z-20 bg-py/50 w-[min(97vw,550px)] [&_#box]:size-[calc(3vw+45px)] gap-6 p-6 pb-8 justify-between rounded-[32px] scale-75 !cursor-default pointer-events-auto " : "size-[--box-size] p-2 rounded-[--box-round] [&_p]:hidden [&>div>div]:size-full *:pointer-events-none pointer *:rounded-md")}
                            onMouseDown={(e: any) => {
                                open || eventManager(elem.current, {
                                    onClick: () => setOpen(true),
                                    onPress: () => setPopup(true)
                                });
                            }}
                        >
                            {obj.map((x: ShortcutType, i: number) => open ? (<Box key={i} {...x} router={router} />) : (i < 9 && (<img key={i} src={x.icon} className="size-full" />)))}
                        </div>
                    </div>
                </Popup>
                <input
                    type="text"
                    name="none"
                    className={"font-normal text-center p-1 focus:outline-none bg-transparent " + (open ? "z-20 font-semibold text-[calc(1vw+14px)] w-screen mx-2" : "text-xs w-full pointer-events-none")}
                    onInput={(e: any) => (newName.current = e.target.value)}
                    defaultValue={name}
                />
            </div>
        </>
    );
}
