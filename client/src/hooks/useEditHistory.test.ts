import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditHistory } from "./useEditHistory";

describe("useEditHistory", () => {
  it("should initialize with the initial state", () => {
    const { result } = renderHook(() => useEditHistory("initial"));
    expect(result.current.state).toBe("initial");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should update state and enable undo", () => {
    const { result } = renderHook(() => useEditHistory("initial"));

    act(() => {
      result.current.setState("updated");
    });

    expect(result.current.state).toBe("updated");
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should undo to previous state", () => {
    const { result } = renderHook(() => useEditHistory("initial"));

    act(() => {
      result.current.setState("updated");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("should redo to next state", () => {
    const { result } = renderHook(() => useEditHistory("initial"));

    act(() => {
      result.current.setState("updated");
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe("updated");
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should clear future history when setting new state after undo", () => {
    const { result } = renderHook(() => useEditHistory("initial"));

    act(() => {
      result.current.setState("updated1");
    });

    act(() => {
      result.current.setState("updated2");
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.setState("updated3");
    });

    expect(result.current.state).toBe("updated3");
    expect(result.current.canRedo).toBe(false);
  });

  it("should clear history", () => {
    const { result } = renderHook(() => useEditHistory("initial"));

    act(() => {
      result.current.setState("updated");
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.state).toBe("updated");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});
