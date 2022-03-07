var VaultFactory = artifacts.require("./VaultFactory.sol");
var Vault = artifacts.require("./Vault.sol");
var Coin = artifacts.require("./Steinnegen.sol");
const assert = require("assert");

let ethToSend = web3.utils.toWei("0.002", "ether");
let someGas = web3.utils.toWei("0.001", "ether");
let vaultFactory;
let creator;
let owner;

contract("Vault", (accounts) => {
  // before tells our tests to run this first before anything else
  before(async () => {
    creator = accounts[0];
    owner = accounts[1];
    vaultFactory = await VaultFactory.new({ from: creator });
  });

  it("Owner can withdraw the funds after the unlock date", async () => {
    //set unlock date in unix epoch to now
    let now = Math.floor(new Date().getTime() / 1000);
    //create the contract and load the contract with some eth
    let vault = await Vault.new(creator, owner, now);
    await vault.send(ethToSend, { from: creator });

    console.log(await web3.eth.getBalance(vault.address));
    assert(ethToSend == (await web3.eth.getBalance(vault.address)));
    let balanceBefore = await web3.eth.getBalance(owner);
    console.log("Balance Before: " + balanceBefore);

    try {
      await vault.withdraw({ from: owner });
    } catch (e) {
      console.log(e);
    }
    let balanceAfter = await web3.eth.getBalance(owner);
    console.log("Balance After: " + balanceAfter);
    assert(balanceAfter - balanceBefore >= ethToSend - someGas);
  });

  it("Nobody can withdraw the funds before the unlock date", async () => {
    //set unlock date in unix epoch to some future date
    let futureTime = Math.floor(new Date().getTime() / 1000) + 50000;

    //create the contract
    let vault = await Vault.new(creator, owner, futureTime);

    //load the contract with some eth
    await vault.send(ethToSend, { from: creator });
    assert(ethToSend == (await web3.eth.getBalance(vault.address)));
    try {
      await vault.withdraw({ from: owner });
      assert(false, "Expected error not received");
    } catch (error) {} //expected

    try {
      await vault.withdraw({ from: creator });
      assert(false, "Expected error not received");
    } catch (error) {} //expected

    try {
      await vault.withdraw({ from: other });
      assert(false, "Expected error not received");
    } catch (error) {} //expected

    //contract balance is intact
    assert(ethToSend == (await web3.eth.getBalance(vault.address)));
  });

  it("Nobody other than the owner can withdraw funds after the unlock date", async () => {
    //set unlock date in unix epoch to now
    let now = Math.floor(new Date().getTime() / 1000);

    //create the contract
    let vault = await Vault.new(creator, owner, now);

    //load the contract with some eth
    await vault.send(ethToSend, { from: creator });
    assert(ethToSend == (await web3.eth.getBalance(vault.address)));
    let balanceBefore = await web3.eth.getBalance(owner);

    try {
      await vault.withdraw({ from: creator });
      assert(false, "Expected error not received");
    } catch (error) {} //expected

    try {
      await vault.withdraw({ from: other });
      assert(false, "Expected error not received");
    } catch (error) {} //expected

    //contract balance is intact
    assert(ethToSend == (await web3.eth.getBalance(vault.address)));
  });

  it("Owner can withdraw the coinInstance after the unlock date", async () => {
    //set unlock date in unix epoch to now
    let now = Math.floor(new Date().getTime() / 1000);

    //create the wallet contract
    let vault = await Vault.new(creator, owner, now);

    //create coinInstance contract
    let coinInstance = await Coin.new({ from: creator });
    //check contract initiated well and has 1M of tokens
    assert(ethToSend == (await coinInstance.balanceOf(creator)));

    //load the wallet with some Toptal tokens
    let amountOfTokens = ethToSend;
    await coinInstance.transfer(vault.address, amountOfTokens, {
      from: creator,
    });
    //check that vault has coinInstances
    assert(amountOfTokens == (await coinInstance.balanceOf(vault.address)));
    //now withdraw tokens
    await vault.withdrawTokens(coinInstance.address, { from: owner });

    //check the balance is correct
    let balance = await coinInstance.balanceOf(owner);
    assert(balance.toNumber() == amountOfTokens);
  });

  it("Allow getting info about the wallet", async () => {
    // Remember current time.
    let now = Math.floor(new Date().getTime() / 1000);
    // Set unlockDate to future time.
    let unlockDate = now + 100000;
    // Create new LockedWallet.
    let vault = await Vault.new(creator, owner, unlockDate);
    // Send ether to the wallet.
    await vault.send(ethToSend, { from: creator });

    // Get info about the wallet.
    let info = await vault.info();

    // Compare result with expected values.
    assert(info[0] == creator);
    assert(info[1] == owner);
    assert(info[2].toNumber() == unlockDate);
    assert(info[3].toNumber() == now);
    assert(info[4].toNumber() == ethToSend);
  });
});
