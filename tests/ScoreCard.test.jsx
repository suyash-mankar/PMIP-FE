import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreCard from "../src/components/ScoreCard/ScoreCard";

describe("ScoreCard Component", () => {
  it("renders score card with provided scores", () => {
    const mockScores = {
      structure: 8,
      metrics: 7,
      prioritization: 9,
      user_empathy: 6,
      communication: 8,
      feedback: "Great answer! Well structured.",
      sample_answer: "Sample answer text here...",
    };

    render(<ScoreCard scores={mockScores} />);

    // Check if the component renders
    expect(screen.getByText("Your Score")).toBeTruthy();

    // Check if score badges are rendered
    expect(screen.getByText("Structure")).toBeTruthy();
    expect(screen.getByText("Metrics")).toBeTruthy();
    expect(screen.getByText("Prioritization")).toBeTruthy();
  });

  it("returns null when no scores provided", () => {
    const { container } = render(<ScoreCard scores={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("calculates average score correctly", () => {
    const mockScores = {
      structure: 10,
      metrics: 10,
      prioritization: 10,
      user_empathy: 10,
      communication: 10,
      feedback: "",
      sample_answer: "",
    };

    render(<ScoreCard scores={mockScores} />);

    // Average should be 10
    expect(screen.getByText("10/10")).toBeTruthy();
  });
});
