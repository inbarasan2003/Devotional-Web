import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";
import { AudioProvider } from "./context/AudioProvider"; // 🔥 import

export default function App() {
  return (
    <>
      <Toaster position="top-right" />

      <AudioProvider>
        <RouterProvider router={router} />
      </AudioProvider>
    </>
  );
}
