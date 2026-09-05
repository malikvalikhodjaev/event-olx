import { describe, expect, it } from "vitest";
import { profileDestination, profileRoleOptions } from "@/lib/roles";

describe("profile roles", () => {
  it("shows exactly the two public profile choices", () => {
    expect(profileRoleOptions.map((option) => option.role)).toEqual(["client", "supplier"]);
  });

  it("keeps a client search destination and sends suppliers to their workspace", () => {
    expect(profileDestination("client", "/catalog?q=%D1%84%D0%BE%D1%82%D0%BE")).toBe("/catalog?q=%D1%84%D0%BE%D1%82%D0%BE");
    expect(profileDestination("client", "/supplier")).toBe("/catalog");
    expect(profileDestination("supplier", "/catalog?q=%D1%84%D0%BE%D1%82%D0%BE")).toBe("/supplier");
    expect(profileDestination("supplier", "/mobile_app/supplier")).toBe("/mobile_app/supplier");
    expect(profileDestination("supplier", "/chats")).toBe("/chats");
  });
});
