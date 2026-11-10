import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Cuppie homepage", () => {
  render(<App />);

  expect(
    screen.getByText(/WELCOME TO CUPPIE/i)
  ).toBeInTheDocument();

  expect(
    screen.getByText("สำรวจคาเฟ่")
  ).toBeInTheDocument();
});