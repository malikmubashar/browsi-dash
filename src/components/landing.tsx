import SearchBar from "./search-bar";
import ShortcutPanel from "./shortcut-panel";

export default function Landing() {
  return (
    <section className="flex justify-center items-center gap-y-3 flex-col z-50">
      <SearchBar />
      <ShortcutPanel />
    </section>
  )
}
