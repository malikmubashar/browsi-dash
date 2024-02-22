import toast from "react-hot-toast";


export function eventManager(elem: HTMLDivElement | null, {
    onClick,
    onPress,
    onLongPress,
}: {
    onClick: () => void,
    onPress: () => void,
    onLongPress?: () => void,
}) {
    let timerId: NodeJS.Timeout | undefined;
    let callback: () => void;

    const [pressTime, longPressTime] = [500, 1000];

    function eventEnd() {
        callback();
        clearTimeout(timerId);
        // cleanup
        timerId = undefined;
        callback = () => void 0;
        elem?.removeEventListener("mouseup", eventEnd);
        elem?.removeEventListener("touchend", eventEnd);
    }

    if (elem) {
        callback = onClick;

        elem.addEventListener("touchend", eventEnd);
        elem.addEventListener("mouseup", eventEnd);

        timerId = setTimeout(() => {
            callback = onPress;

            onLongPress && (timerId = setTimeout(() => {
                callback = () => void 0;
                onLongPress();
            }, longPressTime - pressTime));

        }, pressTime);
    }
}