import { describe, it, expect } from "vitest";

describe("Analytics", () => {
  it("should calculate submission statistics", () => {
    const submissions = [
      { status: "draft", createdAt: new Date("2026-05-01") },
      { status: "submitted", createdAt: new Date("2026-05-05") },
      { status: "completed", createdAt: new Date("2026-05-10") },
      { status: "draft", createdAt: new Date("2026-05-12") },
      { status: "submitted", createdAt: new Date("2026-05-15") },
    ];

    const stats = {
      total: submissions.length,
      byStatus: {
        draft: submissions.filter((s) => s.status === "draft").length,
        submitted: submissions.filter((s) => s.status === "submitted").length,
        completed: submissions.filter((s) => s.status === "completed").length,
      },
      completionRate: (1 / submissions.length) * 100,
    };

    expect(stats.total).toBe(5);
    expect(stats.byStatus.draft).toBe(2);
    expect(stats.byStatus.submitted).toBe(2);
    expect(stats.byStatus.completed).toBe(1);
    expect(stats.completionRate).toBe(20);
  });

  it("should filter submissions by date range", () => {
    const submissions = [
      { id: 1, date: new Date("2026-05-01") },
      { id: 2, date: new Date("2026-05-05") },
      { id: 3, date: new Date("2026-05-10") },
      { id: 4, date: new Date("2026-05-15") },
    ];

    const dateFrom = new Date("2026-05-05");
    const dateTo = new Date("2026-05-12");

    const filtered = submissions.filter(
      (s) => s.date >= dateFrom && s.date <= dateTo
    );

    expect(filtered.length).toBe(2);
    expect(filtered[0]?.id).toBe(2);
    expect(filtered[1]?.id).toBe(3);
  });

  it("should search submissions by keyword", () => {
    const submissions = [
      { id: 1, title: "Edital CNPQ Pesquisador" },
      { id: 2, title: "Paulo Gustavo Cultura" },
      { id: 3, title: "CAPES Mestrado" },
    ];

    const keyword = "Pesquisador";
    const filtered = submissions.filter((s) =>
      s.title.toLowerCase().includes(keyword.toLowerCase())
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0]?.id).toBe(1);
  });

  it("should calculate monthly submission trends", () => {
    const submissions = [
      { month: "Janeiro", count: 2 },
      { month: "Fevereiro", count: 3 },
      { month: "Março", count: 5 },
      { month: "Abril", count: 4 },
      { month: "Maio", count: 6 },
    ];

    const totalSubmissions = submissions.reduce((sum, s) => sum + s.count, 0);
    const averagePerMonth = totalSubmissions / submissions.length;

    expect(totalSubmissions).toBe(20);
    expect(averagePerMonth).toBe(4);
  });
});
