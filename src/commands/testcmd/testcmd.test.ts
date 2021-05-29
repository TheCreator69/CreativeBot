import * as Test from "./testcmd";

test("", () => {
    var testCmd = new Test.Command("Desc");
    expect(testCmd.getDescription()).toBe("Desc");
});
