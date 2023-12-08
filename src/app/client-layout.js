import { UserProvider } from "./context/UserContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />;
}

const logError = (error, info) => {
  // Do something with the error, e.g. log to an external API
  console.log("Error has been logged: " + error);
};

export function ClientRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <div className="container">
              <ErrorBoundary
                fallbackRender={fallbackRender}
                onError={logError}
                onReset={(details) => {
                  // Reset the state of your app so the error doesn't happen again
                }}
              >
                <Navbar />

                {children}

                <Footer />
              </ErrorBoundary>
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
