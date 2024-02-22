"use client";
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Tooltip } from '@mui/material';
import { openDB } from 'idb';
import type { ShortcutType } from "@/types";
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import Link from 'next/link';


export default function Page() {
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        (async () => setData(await (await openDB('browsi-dash')).getAll("shortcuts")))();
    }, []);

    return (
        <main id='datasheet' className='bg-py'>
            <div className='p-4 flex justify-end'>
                <FileDownloadRoundedIcon className='btn-icon !rounded-md !scale-150' onClick={() => {
                    const elem = document.createElement('a');
                    elem.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
                    elem.setAttribute("download", "browsi-dash.json");
                    elem.click();
                    elem.remove();
                }} />
            </div>
            <TableContainer className='mt-8'>
                <Table size="small" aria-label="a dense table" className='[&_*]:text-cl/70'>
                    <TableHead>
                        <TableRow className='*:font-bold *:text-nowrap hover:*:bg-cl/5 *:!text-cl'>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Group</TableCell>
                            <TableCell align="center">Added To Home</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">URL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((x: ShortcutType) => (
                            <TableRow
                                key={x._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <div className='flex items-center gap-x-3'>
                                        <KeyboardDoubleArrowRightIcon className='opacity-50 text-sm' />
                                        <Link href={x.url} >
                                            {x.name}
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell className='font-bold !text-cl/50 text-xs text-nowrap font-mono' align="center">{x.groupPart}</TableCell>
                                <TableCell align="center" className='opacity-80'>{x.home ? <CheckCircleTwoToneIcon className='!fill-bd ' /> : <span className='!text-cl/30'>--</span>}</TableCell>
                                <TableCell
                                    align="right">
                                    <Tooltip arrow title={x.updatedAt ? "Modified Date" : "Created Date"}>
                                        <div className={'text-[10px] mx-auto rounded-full text-center w-fit px-2 text-nowrap ' + (x.updatedAt ? "bg-green-500/20 border border-green-500/50 !text-green-500" : "bg-bd/20 border-bd/20 border !text-bd")}>{new Date(x.updatedAt || x.createdAt).toLocaleDateString("en", { dateStyle: "medium" })}</div>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip arrow title={x.url} placement='left'>
                                        <div className='flex items-center gap-x-2 border px-2.5 py-0.5 w-fit mx-auto text-sm border-cl/5 rounded-md !text-cl/70 bg-cl/5 pointer transition-all hover:rounded-none [box-shadow:0_0_0_0_red] hover:[box-shadow:2px_1.5px_0_.5px_hsl(var(--bd-hsl)/.5)] hover:border-cl/30 active:scale-90' onClick={() => {
                                            navigator.clipboard.writeText(x.url);
                                        }}>
                                            <span>copy</span>
                                            <ContentCopyTwoToneIcon className='text-xs' />
                                        </div>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    );
}
