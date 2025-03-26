import { useRouter } from "next/router";
import { useState, useEffect } from "react";

/**
 * A higher-order component (HOC) that wraps a given component and provides authentication
 * guard functionality. It checks for the presence of a token in the session storage and
 * redirects to the login page if the token is not found. If the token is present, it stops
 * the loading process and renders the wrapped component.
 *
 * @template P - The props type of the wrapped component.
 *
 * @param WrappedComponent - The component to be wrapped by the authentication guard.
 *
 * @returns A new component that checks for authentication and renders the wrapped component
 * if the user is authenticated, otherwise redirects to the login page.
 */

const authGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isTokenChecked, setIsTokenChecked] = useState(false); // New state variable

    useEffect(() => {
      const checkAuthentication = async () => {
        // Add a small delay to allow time for the token to be set
        await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms delay

        const token = sessionStorage.getItem("token");
        if (!token) {
          console.warn("authGuard: Token not found. Redirecting to login.");
          router.replace("/login");
          return;
        }

        setIsLoading(false); // Set loading state to false
        setIsTokenChecked(true); // Token has been checked
      };

      checkAuthentication();
    }, [router]);

    if (isLoading) {
      return <div className="spinner"></div>; // Replace with a spinner if needed
    }

    // Only render the wrapped component if the token has been checked
    return isTokenChecked ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default authGuard;
