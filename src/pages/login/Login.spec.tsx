import { describe,expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "./login";
describe("login page", () => {
    it("should render the login page", () => {
        render(<Login />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button" ,{name: "Log in"})).toBeInTheDocument();
        expect(screen.getByRole("checkbox",{name: "Remember me"})).toBeInTheDocument();
        expect(screen.getByText("Forgot password?")).toBeInTheDocument();

    });

})
