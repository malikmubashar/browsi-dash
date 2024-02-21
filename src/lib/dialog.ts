"use client";
import { useDispatch } from "react-redux";
import { setDialog } from "@/lib/reducers";

export function useDialog(): { close: () => void, open: (name: string, props: any) => void } {
    const dispatch = useDispatch();
    const close = () => dispatch(setDialog({ current: null, props: {} }));
    const open = (name: string, props: any) => dispatch(setDialog({ current: name, props }));
    return {
        close: close,
        open: (name: string, props: any) => dispatch(setDialog({ current: name, props: { ...props, open: open, close: close } }))
    }
}


