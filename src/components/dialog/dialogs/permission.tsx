"use client";

export default function Permission({ title, message, onAccept, close }: { title: string, message: string, onAccept: () => void, close: () => void }) {
    return (
        <div className="fixed inset-0 bg-cl/10 z-[999] flex items-center justify-center">
            <form className="bg-py p-4 rounded-xl shadow shadow-cl/20 flex flex-col gap-y-3 w-[min(500px,95%)]">
                <h1 className="text-xs font-bold font-mono text-bd/50">Permission</h1>
                <div className="p-3">
                    <h2 className="text-sm font-bold opacity-70">Are you want to delete?</h2>
                    <p className="text-xs opacity-60 py-2">Permission is required for this action.</p>
                </div>
                <div className="flex justify-end gap-x-2">
                    <button className="btn btn-sy bg-bd/50" onClick={close}>Cancel</button>
                    <button className="btn">Accept</button>
                </div>
            </form>
        </div>
    )
}
