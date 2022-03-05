var VaultFactory = artifacts.require("./VaultFactory.sol");
var Vault = artifacts.require("./Vault.sol");
var Coin = artifacts.require("./Steinnegen.sol");
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

let ethToSend = web3.utils.toWei("0.002", "ether");
let someGas = web3.utils.toWei("0.001", "ether");
let vaultFactory;
let creator;
let owner;

contract("Vault", (accounts) => {
  let now = '1641042061';
  let end = '1643720461';
  // before tells our tests to run this first before anything else
  before(async () => {
    creator = accounts[0];
    owner = accounts[1];
    vaultFactory = await VaultFactory.new({ from: creator });
  });

  it("Owner can withdraw the funds after the unlock date", async () => {
    //set unlock date in unix epoch to now
    // let now = Math.floor(new Date().getTime() / 1000);

    //create the contract and load the contract with some eth
    let vault = await Vault.new(creator, owner, end, now);
    let info = await vault.info();


    console.log('Creator: '+info[0]);
    console.log('Owner: '+info[1]);
    console.log('End Date: '+new Date(info[2].toNumber()*1000));
    console.log('Start Date: '+new Date(info[3].toNumber()*1000));
    console.log('Balance: '+info[4].toNumber());
    console.log(await web3.eth.getBalance(vault.address));

    try {
    //   await vault.send(ethToSend, { from: creator });
      await vault.send(ethToSend, {
        from: accounts[0],
        gas: "1000000",
      });
      assert(ethToSend == (await web3.eth.getBalance(vault.address)));
      let balanceBefore = await web3.eth.getBalance(owner);
      console.log("Balance Before: " + balanceBefore);
      await vault.withdraw({ from: owner });
      let balanceAfter = await web3.eth.getBalance(owner);
      console.log("Balance After: " + balanceAfter);
      assert(balanceAfter - balanceBefore >= ethToSend - someGas);
    } catch (e) {
      console.log(e.message);
    }

   
  });

  it("Nobody can withdraw the funds before the unlock date", async () => {
    //set unlock date in unix epoch to some future date
    let futureTime = Math.floor(new Date().getTime() / 1000) + 50000;

    //create the contract
    let vault = await Vault.new(creator, owner, futureTime, now);

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
    let vault = await Vault.new(creator, owner, end, now);

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
    let vault = await Vault.new(creator, owner, end, now);

    //create coinInstance contract
    let coinInstance = await Coin.new({ from: creator });
    //check contract initiated well and has 1M of tokens
    assert(1000000000000 == (await coinInstance.balanceOf(creator)));

    //load the wallet with some Toptal tokens
    let amountOfTokens = 1000000000;
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
