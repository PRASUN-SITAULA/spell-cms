import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryProvider } from "./providers/ReactQueryProvider.tsx";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes.tsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<div>there is an error</div>}>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </ErrorBoundary>
  </StrictMode>,
);
