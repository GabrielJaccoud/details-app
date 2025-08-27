import { worker } from "../mocks/browser";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { renderHook, act } from "@testing-library/react-hooks";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Authentication with MSW", () => {
  beforeAll(() => worker.start());
  afterEach(() => {
    worker.resetHandlers();
    localStorageMock.clear();
    mockNavigate.mockClear();
  });
  afterAll(() => worker.stop());

  test("should register a new user successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    
    await act(async () => {
      const response = await result.current.register("Test User", "new.user@example.com", "password123");
      expect(response.email).toBe("new.user@example.com");
      expect(response.id).toBeDefined();
    });
  });

  test("should log in an existing user successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    expect(localStorage.getItem("token_type")).toBe("bearer");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("should fail to log in with invalid credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await expect(result.current.login("test@example.com", "wrongpassword")).rejects.toThrow(
        "Erro ao fazer login"
      );
    });
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  test("should log out a user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    localStorage.setItem("access_token", "mock-access-token");
    localStorage.setItem("token_type", "bearer");

    await act(async () => {
      result.current.logout();
    });

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});


