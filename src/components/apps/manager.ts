


export function eventManager(elem: HTMLDivElement | null, {
    onClick,
    onPress,
    onLongPress,
}:{
    onClick: () => void,
    onPress: () => void,
    onLongPress?: () => void,
}) {
    let timerId: NodeJS.Timeout | undefined;
    let callback: () => void;

    const [pressTime, longPressTime] = [500, 1000];

    if (elem) {
        callback = onClick;
        elem.addEventListener("mouseup", () => {
            callback();
            clearTimeout(timerId);
            // cleanup
            timerId = undefined;
            callback = () => void 0;
        });

        timerId = setTimeout(() => {
            callback = onPress;

            onLongPress && (timerId = setTimeout(() => {
                callback = () => void 0;
                onLongPress();
            }, longPressTime - pressTime));

        }, pressTime);
    }
}