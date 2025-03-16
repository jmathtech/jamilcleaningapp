
import { useRouter } from "next/router";
import { useAuth } from "../../pages/context/AuthContext";
import AdminLogin from '../AdminLogin';

// __tests__/AdminLogin.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import "@testing-library/jest-dom";

// __tests__/AdminLogin.test.tsx
// Mocking components
jest.mock("../AdminNavbar", () => () => <div>Mocked Navbar</div>);
jest.mock("../Footer", () => () => <div>Mocked Footer</div>);
jest.mock("next/image", () => ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />);
jest.mock("next/link", () => ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>);

// Mocking hooks
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../pages/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe('AdminLogin() AdminLogin method', () => {
  const mockPush = jest.fn();
  const mockSetToken = jest.fn();
  const mockSetFirstName = jest.fn();
  const mockSetLastName = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({
      setToken: mockSetToken,
      setFirstName: mockSetFirstName,
      setLastName: mockSetLastName,
    });
    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should render the login form correctly', () => {
      render(<AdminLogin />);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token', first_name: 'John', last_name: 'Doe', role: 'admin' }),
        })
      ) as jest.Mock;

      render(<AdminLogin />);
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalledWith('test-token');
        expect(mockSetFirstName).toHaveBeenCalledWith('John');
        expect(mockSetLastName).toHaveBeenCalledWith('Doe');
        expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should display an error message on failed login', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Invalid credentials' }),
        })
      ) as jest.Mock;

      render(<AdminLogin />);
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

      render(<AdminLogin />);
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
      });
    });
  });
});