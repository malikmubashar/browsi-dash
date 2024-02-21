import { ShortcutType } from "./schema";

export { ShortcutType };

export interface AppState {
    searchQuery: string;
    dialog: {
        current: string | null;
        props: any
    },
    isSelectionMode: boolean;
    homeScreen: number;
    appScreen: number;
}