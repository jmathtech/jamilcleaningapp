import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const authGuard = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const token = localStorage.getItem('admin_token');
                    localStorage.getItem("admin_name");
                    localStorage.getItem("role");
      if (!token) {
        router.push('/admin/login');
      } else {
        setLoading(false); // Token found, stop loading
      }
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // You can replace this with a spinner or loading component
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default authGuard;