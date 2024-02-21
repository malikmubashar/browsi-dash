"use client";

const sounds: { [key: string]: string } = {
    speechSearchAffect: './sounds/speechSearchEffect.mp3',
};

type modAudioTypeReturn = {
    _play: () => modAudioTypeReturn;
} & HTMLAudioElement;
type useAudioTypeReturn<T> = T extends string ? modAudioTypeReturn : (name: string) => modAudioTypeReturn;

export function useAudio<T>(name?: T): useAudioTypeReturn<T> {


    if (typeof name === "string") return modAudio(name) as useAudioTypeReturn<T>;

    return function (name: string) {
        return modAudio(name);
    } as useAudioTypeReturn<T>;
}

function modAudio(name: string): modAudioTypeReturn {
    const audio = new Audio(sounds[name]);
    return {
        ...audio,
        _play: function () { audio.play(); return this; }
    };
}