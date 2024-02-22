"use client";
import { ModeEditOutlineRounded, Add } from '@mui/icons-material';
import { useDialog } from "@/lib/dialog";
import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import type { ShortcutType, AppState } from "@/types";
import { useSelector } from 'react-redux';

export default function ShortcutPanel() {
  const dg = useDialog();
  const updateScreen = useSelector(({ homeScreen }: AppState) => homeScreen);
  const [data, setDb] = useState<any>([]);
  async function loadData() {
    setDb((await (await openDB('browsi-dash')).getAll('shortcuts')).filter(x => x.home));
  }

  useEffect(() => {
    loadData();
  }, [updateScreen]);

  return (
    <div className="-z-20 w-[min(576px,95%)] relative mt-1">
      <div className="flex flex-wrap justify-center gap-1">
        {data.map((x: ShortcutType, i: number) => <ShortcutPanelItem key={i} {...x} open={dg.open} />)}
        <ShortcutPanelAddItem open={dg.open} />
      </div>
    </div>
  );
}

function ShortcutPanelItem({ open, _id, name, url, icon }: { open: (x: string, props: any) => void } & ShortcutType) {

  return (
    <div className="flex flex-col gap-y-5 justify-center items-center p-3 rounded-lg hover:bg-bd/20 hover:text-bd bg-py/50 backdrop-blur size-28 transition-all pointer select-none relative [&:hover_.shortcut-item-edit-menu]:opacity-20" onClick={(e: any) => {
      window.location.href = url;
    }}>
      <div className='absolute right-1 top-1 flex flex-col items-end w-full'>
        <ModeEditOutlineRounded className="opacity-0 p-1.5 scale-105 transition-all rounded-full hover:bg-cl/10 active:scale-100 shortcut-item-edit-menu print:bg-orange-500 hover:!opacity-40" onClick={(e: any) => {
          e.stopPropagation();
          open("shortcuts", { action: "edit", _id });
        }} />
      </div>
      <div className="size-1/2 bg-cl/5 rounded-full overflow-hidden">
        <img src={icon} alt={name} className="size-full rounded-[inherit] bg-bd/10" />
      </div>
      <p className="text-xs text-center text-nowrap w-full overflow-hidden overflow-ellipsis font-[400]">{name}</p>
    </div>
  );
}

function ShortcutPanelAddItem({ open }: { open: (x: string, props: any) => void }) {
  const dg = useDialog();
  return (
    <div className="flex flex-col justify-between items-center p-4 rounded-lg hover:bg-bd/10 size-28 transition-all bg-py/50 backdrop-blur-sm pointer select-none [&:hover_.shortcut-item-edit-menu]:opacity-50 active:scale-95 " onClick={() => open('shortcuts', { action: "add" })}>
      <Add className='p-1.5 scale-[2] bg-bd/50 rounded-full translate-y-3' />
      <p className="text-xs text-center text-nowrap w-full overflow-hidden overflow-ellipsis font-[400]">Add Shortcut</p>
    </div>
  );
}