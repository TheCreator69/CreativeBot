import * as Test from "./testcmd";

test("", () => {
    var testCmd = new Test.TestCommand("Desc");
    expect(testCmd.getDescription()).toBe("Desc");
});
