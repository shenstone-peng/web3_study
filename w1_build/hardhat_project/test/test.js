const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("test", async function () {
    const [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const count_test1 = await Counter.deploy();
    await count_test1.deployed();

    expect(await count_test1.set_n());
    expect(await count_test1.count()).to.equal(1);
    expect(await count_test1.n()).to.equal(1);
    expect(await count_test1.set_n());
    expect(await count_test1.count()).to.equal(2);
    expect(await count_test1.n()).to.equal(2);
  });
});
