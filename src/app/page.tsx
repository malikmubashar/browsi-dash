import Landing from "@/components/landing";
import Apps from "@/components/apps";



export default function Home() {

  return (
    <main className="*:min-w-[100vw] *:h-screen flex overflow-x-scroll snap-x snap-mandatory *:snap-center">

      <Landing />
      <Apps />

    </main>
  );
}
