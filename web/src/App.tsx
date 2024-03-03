import Providers from "./components/providers.tsx";
import { Toaster } from "sonner";
import Routes from "./routes/index.tsx";

function App() {
  return (
    <Providers>
      <Toaster />
      <Routes />
    </Providers>
  );
}

export default App;
