import Main from "@/components/Main";
import { UsernameProvider } from "@/context/UsernameContext";

export default function Home() {
  return (
    <UsernameProvider>
      <Main />
    </UsernameProvider>
  )
}
