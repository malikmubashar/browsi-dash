"use client";
import { SearchOutlined, KeyboardVoiceTwoTone, Close, History } from '@mui/icons-material';
import { useAudio } from '@/lib/audio';
import React, { useState, useRef, useEffect } from 'react';

export default function SearchBar() {
    const [search, setSearch] = useState('');
    const audio = useAudio();
    const form = useRef<HTMLFormElement>(null);
    const isSpeechStart = useRef(false);

    function submit(e: any) {
        e.preventDefault();
        const txt = e.target['text'].value;
        window.location.href = `https://www.google.com/search?q=${txt}`;
    }

    return (
        <form ref={form} className='w-[min(576px,95%)] -z-40' onSubmit={submit} onInput={(e: any) => setSearch(e.target.value)}>
            <div className='rounded-3xl bg-py relative'>
                <div className='py-0.5 px-4 flex items-center gap-x-1 border border-transparent rounded-[inherit]'>
                    <SearchOutlined className='scale-90 opacity-50' />
                    <input type="text" name='text' placeholder="Search or type a URL" defaultValue={search} required minLength={1} className='bg-transparent focus:outline-none p-2 w-full text-cl/70' />
                    <div className='*:pointer'>
                        <KeyboardVoiceTwoTone className='btn-icon !scale-150 !p-1 !bg-transparent hover:!bg-cl/5' onClick={() => {
                            if (!(window as any).webkitSpeechRecognition) {
                                return alert('Your browser does not support speech recognition.');
                            };
                            const recognition = new (window as any).webkitSpeechRecognition();
                            console.log(isSpeechStart.current);
                            if (isSpeechStart.current) {
                                recognition.stop();
                                isSpeechStart.current = false;
                                return;
                            };
                            recognition.onresult = function (event: any) {
                                const txt = event.results[0][0].transcript;
                                setSearch(txt);
                                audio('speechSearchAffect')._play();
                                setTimeout(() => (form.current?.querySelector("input[type='submit']") as any)?.click(), 500);
                                recognition.stop();
                                isSpeechStart.current = false;
                            }
                            recognition.onend = function () {
                                isSpeechStart.current = false;
                            }
                            recognition.start();
                            isSpeechStart.current = true;
                        }} />
                    </div>
                    <input type="submit" className='hidden' />
                </div>
                <div className='absolute bg-inherit w-full rounded-[inherit] top-0 -z-10 ' style={{
                    boxShadow: '0 0 6px 0 hsl(var(--cl-hsl) / .3)',
                }}>
                    <div className='h-[46px]'></div>
                    <div className='h-0 overflow-hidden'>
                        <ul className='pb-5'>
                            {Array(5).fill(0).map((_, i) => <SearchMatchItem key={i} />)}
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    )
}

function SearchMatchItem() {
    const { isInHistory, image, text } = { isInHistory: true, image: "https://www.google.com/favicon.ico", text: "Google" };
    return (
        <li className='flex gap-x-5 py-3 pointer px-4 items-center hover:bg-cl/10 [&:hover_.remove-history]:opacity-60 transition-all'>
            <span className='size-5 flex items-center justify-center'>
                {Boolean(image) ? (<img src={image} alt="favicon" className='size-5 rounded-sm' />) : (isInHistory ? <History className='scale-75 opacity-50' /> : <SearchOutlined className='scale-75 opacity-50' />)}
            </span>
            <div className='flex justify-between items-center w-full'>
                <p className='font-bold'>{text}</p>
                {isInHistory && <Close className='scale-50 btn-icon opacity-0 remove-history' />}
            </div>
        </li>
    );
}
