import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const authGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuthentication = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.warn("authGuard: Token not found. Redirecting to login.");
          router.replace("/login");
          return;
        }

        setIsLoading(false); // Set loading state to false even if no further checks are needed
      };

      checkAuthentication();
    }, [router]);

    if (isLoading) {
      return <div className="spinner"></div>; // Replace with a spinner if needed
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default authGuard;
