import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportModal from "./ReportModal";

afterEach(cleanup);

test("if name and comment are entered the upload status takes on a value", async () => {
  render(<ReportModal setOpenModal={jest.fn()} setRefetch={jest.fn()} />);

  userEvent.type(screen.getByTestId("report-name-input"), "August 2022");
  userEvent.type(screen.getByTestId("report-date-input"), "22.10.");
  userEvent.click(await screen.getByTestId("report-submit"), undefined);

  expect(await screen.getByTestId("reportUploadStatus").textContent).toBe(
    "Failed - Faulty date"
  );
});