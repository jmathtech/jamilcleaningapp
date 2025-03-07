// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  setToken: (token: string) => void;
  setFirstName: (name: string | null) => void;
  setLastName: (name: string | null) => void;
  setEmail: (email: string | null) => void;
  setPhone: (phone: string | null) => void;
  setAddress: (address: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedFirstName = Cookies.get("first_name");
    const storedLastName = Cookies.get("last_name");
    const storedEmail = Cookies.get("email");
    const storedPhone = Cookies.get("phone");
    const storedAddress = Cookies.get("address");

    if (storedToken) setToken(storedToken);
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhone) setPhone(storedPhone);
    if (storedAddress) setAddress(storedAddress);
  }, []);

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    Cookies.set("token", newToken, {
      expires: 30,
      secure: true,
      sameSite: "strict",
    });
  };

  const handleSetFirstName = (name: string | null) => {
    setFirstName(name);
    if (name) {
      Cookies.set("first_name", name, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("first_name");
    }
  };

  const handleSetLastName = (name: string | null) => {
    setLastName(name);
    if (name) {
      Cookies.set("last_name", name, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("last_name");
    }
  };

  const handleSetEmail = (email: string | null) => {
    setEmail(email);
    if (email) {
      Cookies.set("email", email, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("email");
    }
  };

  const handleSetPhone = (phone: string | null) => {
    setPhone(phone);
    if (phone) {
      Cookies.set("phone", phone, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("phone");
    }
  };

  const handleSetAddress = (address: string | null) => {
    setAddress(address);
    if (address) {
      Cookies.set("address", address, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("address");
    }
  };

  const logout = () => {
    setToken(null);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setPhone(null);
    setAddress(null);
    Cookies.remove("token");
    Cookies.remove("first_name");
    Cookies.remove("last_name");
    Cookies.remove("email");
    Cookies.remove("phone");
    Cookies.remove("address");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        firstName,
        lastName,
        setFirstName: handleSetFirstName,
        setLastName: handleSetLastName,
        email,
        setEmail: handleSetEmail,
        phone,
        setPhone: handleSetPhone,
        address,
        setAddress: handleSetAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
