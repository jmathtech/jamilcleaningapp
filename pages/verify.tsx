import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      if (!token || typeof token !== "string") {
        setError("Invalid token.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (data.success) {
          // Store the new token in sessionStorage
          sessionStorage.setItem("token", data.token);

          // Redirect to dashboard
          router.replace("/dashboard");
        } else {
          setError(data.message || "Verification failed.");
          // Check if the user is already on the login page
          if (router.pathname !== "/login") {
            router.replace('/login');
          }
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An error occurred during verification.");
        // Check if the user is already on the login page
        if (router.pathname !== "/login") {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [token, router]);

  if (loading) {
    return <p>Verifying token...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return null; // Should not reach here if verification is successful
}
