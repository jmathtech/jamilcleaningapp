import { createContext, useContext, useState, useEffect } from "react";

// Defines the BookingContext type
interface BookingContextType {
  token: string;
  firstName: string | null;
  lastName: string | null;
  bookingId: string | null; // Keep bookingId for potential future use
  customerId: string; // Add customerId to the context
  setCustomerId: (id: string) => void;
  setToken: (token: string) => void;
  setFirstName: (name: string | null) => void;
  setLastName: (name: string | null) => void;
  setBookingId: (id: string | null) => void;
  serviceType: string; 
  setServiceType: (serviceType: string) => void;
  serviceDescription: string | null;
  setServiceDescription: (description: string) => void;
  hours: number;
  setHours: (hours: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  hasPets: boolean;
  setHasPets: (hasPets: boolean) => void;
  totalCost: number;
  setTotalCost: (totalCost: number) => void;
}

const BookingContext = createContext<BookingContextType>({
  token: "",
  firstName: null,
  lastName: null,
  bookingId: null,
  customerId: "", 
  setCustomerId: () => {},
  setToken: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setBookingId: () => {},
  serviceType: "",
  setServiceType: () => {},
  serviceDescription: "",
  setServiceDescription: () => {},
  hours: 0,
  setHours: () => {},
  notes: "",
  setNotes: () => {},
  date: "",
  setDate: () => {},
  time: "",
  setTime: () => {},
  hasPets: false,
  setHasPets: () => {},
  totalCost: 0,
  setTotalCost: () => {},
});

export const useBooking = () => useContext(BookingContext);

// Helper functions to manage cookies
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

// Set Cookies
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; httpOnly; secure; samesite=strict;`;
};

// Removes Cookies
const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>(""); 
  const [serviceType, setServiceType] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState("No description available.");
  const [hours, setHours] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [hasPets, setHasPets] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    // Retrieve values from cookies on mount
    const storedToken = getCookie("token");
  const storedFirstName = getCookie("first_name");
  const storedLastName = getCookie("last_name");
  const storedBookingId = getCookie("bookingId");
  const storedServiceType = getCookie("serviceType");
  const storedServiceDescription = getCookie("serviceDescription");
  const storedHours = getCookie("hours");
  const storedNotes = getCookie("notes");
  const storedDate = getCookie("date");
  const storedTime = getCookie("time");
  const storedHasPets = getCookie("hasPets");
  const storedTotalCost = getCookie("totalCost");

  if (storedToken) {
    setToken(storedToken);
  }

  if (storedFirstName) {
    setFirstName(storedFirstName);
  }

  if (storedLastName) {
    setLastName(storedLastName);
  }

  if (storedBookingId) {
    setBookingId(storedBookingId);
  }

  if (storedServiceType) {
    setServiceType(storedServiceType);
  }

  if (storedServiceDescription) {
    setServiceDescription(storedServiceDescription);
  }

  if (storedHours) {
    setHours(Number(storedHours)); 
  }

  if (storedNotes) {
    setNotes(storedNotes);
  }

  if (storedDate) {
    setDate(storedDate);
  }

  if (storedTime) {
    setTime(storedTime);
  }

  if (storedHasPets === "true") {
    setHasPets(true);
  } else if (storedHasPets === "false") {
    setHasPets(false);
  }

  if (storedTotalCost) {
    setTotalCost(Number(storedTotalCost));
  }
  }, []);

  useEffect(() => {
    // Save updated values to cookies
    if (token) {
      setCookie("token", token, 7); // Store for 7 days
    } else {
      removeCookie("token");
    }

    if (firstName !== null) {
      setCookie("first_name", firstName, 7);
    } else {
      removeCookie("first_name");
    }

    if (lastName !== null) {
      setCookie("last_name", lastName, 7);
    } else {
      removeCookie("last_name");
    }

    if (bookingId !== null) {
      setCookie("bookingId", bookingId, 7);
    } else {
      removeCookie("bookingId");
    }

    if (serviceType) {
      setCookie("serviceType", serviceType, 7);
    } else {
      removeCookie("serviceType");
    }

    if (serviceDescription) {
      setCookie("serviceDescription", serviceDescription, 7);
    } else {
      removeCookie("serviceDescription");
    }
  
    if (hours) {
      setCookie("hours", hours.toString(), 7); 
    } else {
      removeCookie("hours");
    }

    if (notes) {
      setCookie("notes", notes.toString(), 7); 
    } else {
      removeCookie("notes");
    }

    if (date) {
      setCookie("date", date.toString(), 7); 
    } else {
      removeCookie("date");
    }

    if (time) {
      setCookie("time", time.toString(), 7); 
    } else {
      removeCookie("time");
    }

    if (hasPets) {
      setCookie("hasPets", hasPets.toString(), 7); 
    } else {
      removeCookie("hasPets");
    }
  
    if (totalCost) {
      setCookie("totalCost", totalCost.toString(), 7); 
    } else {
      removeCookie("totalCost");
    }

  }, [token, firstName, lastName, bookingId, serviceType, serviceDescription, hours, notes, date, time, hasPets, totalCost]);

  return (
    <BookingContext.Provider
      value={{
        token,
        firstName,
        lastName,
        bookingId,
        customerId,
        setCustomerId,
        setToken,
        setFirstName,
        setLastName,
        setBookingId,
        serviceType,
        setServiceType,
        serviceDescription,
        setServiceDescription,
        hours,
        setHours,
        notes,
        setNotes,
        date,
        setDate,
        time,
        setTime,
        hasPets,
        setHasPets,
        totalCost,
        setTotalCost,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};