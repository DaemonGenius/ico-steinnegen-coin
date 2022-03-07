var Coin = artifacts.require("./Steinnegen.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const totalSupplyAmount = web3.utils.toWei("0.002", "ether");
let creator;

contract("Coin", async function (accounts) {
  let CoinInstance;
  // before tells our tests to run this first before anything else
  before(async () => {
    coinInstance = await Coin.deployed();
    creator = accounts[0];
  });
  console.log(totalSupplyAmount);

  it("Initializes the contract with the correct Symbol", async () => {
    let symbol = await coinInstance.symbol();
    assert.equal(symbol, "STEIN", "Has the correct symbol");
  });

  it("Initializes the contract with the correct Name", async () => {
    let name = await coinInstance.name();
    assert.equal(name, "Steinnegen", "Has the correct name");
  });

  it("sets the total supply upon deployment", async () => {
    let totalSupply = await coinInstance.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      totalSupplyAmount,
      "sets the total supply to 1 000 000 000 000"
    );
  });

  it("BalanceOf", async () => {
    let BalanceOf = await coinInstance.balanceOf(creator);
    assert.equal(
      BalanceOf.toNumber(),
      totalSupplyAmount,
      "allocates the initial supply to the admin account"
    );
  });

  it("Transfers Token Ownership", async () => {
    let transferInstance = "";
    let transferAmount = 250000;
    let balance;
    try {
      await coinInstance.transfer.call(accounts[1], 99999999999999999999999);
    } catch (error) {
      assert(
        error.message.indexOf("overflow") >= 0,
        "error message must contain revert"
      );

      assert.equal(
        await coinInstance.transfer.call(creator, transferAmount),
        true,
        "Transfer Successful"
      );
    }
    try {
      receipt = await coinInstance.transfer(accounts[1], transferAmount, {
        from: creator,
      });
      assert.equal(receipt.logs.length, 1, "triggers one event");
      assert.equal(
        receipt.logs[0].event,
        "Transfer",
        'should be the "Transfer" event'
      );
      assert.equal(
        receipt.logs[0].args.from,
        accounts[0],
        "logs the account the tokens are transferred from"
      );
      assert.equal(
        receipt.logs[0].args.to,
        accounts[1],
        "logs the account the tokens are transferred to"
      );
      assert.equal(
        receipt.logs[0].args.value,
        250000,
        "logs the transfer amount"
      );
    } catch (error) {
      assert(error, "Transfer failure");
    }

    balance = await coinInstance.balanceOf(accounts[0]);

    assert.equal(
      balance.toNumber(),
      1999999999750000,
      "deducts the amount from the sending account"
    );
    balance = await coinInstance.balanceOf(accounts[1]);
    assert.equal(
      balance.toNumber(),
      250000,
      "adds the amount to the receiving account"
    );
  });

  // it('transfers token ownership', function() {
  //   return Coin.deployed().then(function(instance) {
  //     tokenInstance = instance;
  //     // Test `require` statement first by transferring something larger than the sender's balance
  //     return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
  //   }).then(assert.fail).catch(function(error) {
  //     console.log(error);
  //     assert(error.message.indexOf('overflow') >= 0, 'error message must contain revert');
  //     // This will only call the function, and not write to disk
  //     // We want to inspect the function return value rather than the transaction receipt
  //     return tokenInstance.transfer.call(accounts[1], 250000);
  //   }).then(function(success) {
  //     assert.equal(success, true, 'it returns true')
  //     // Actually transfer by calling the function & writing to disk
  //     return tokenInstance.transfer(accounts[1], 250000);
  //   }).then(function(receipt) {
  //     assert.equal(receipt.logs.length, 1, 'triggers one event');
  //     assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
  //     assert.equal(receipt.logs[0].args.from, accounts[0], 'logs the account the tokens are transferred from');
  //     assert.equal(receipt.logs[0].args.to, accounts[1], 'logs the account the tokens are transferred to');
  //     assert.equal(receipt.logs[0].args.value, 250000, 'logs the transfer amount');
  //     return tokenInstance.balanceOf(accounts[0]);
  //   }).then(function(balance) {
  //     assert.equal(balance.toNumber(), 1999999999750000, 'deducts the amount from the sending account');
  //     return tokenInstance.balanceOf(accounts[1]);
  //   }).then(function(balance) {
  //     assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
  //   })
  // });

  it("approves tokens for delegated transfer", async () => {
    let approve = await coinInstance.approve.call(accounts[1], 100);
    assert.equal(approve, true, "Success");

    let receipt = await coinInstance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Approval",
      'Should be the "Approval" event'
    );

    console.log(receipt);

    let allowance = await coinInstance.allowance(creator, accounts[1]);

    assert.equal(
      allowance,
      100,
      "stores the allowance for the delegated transfer"
    );
  });

  it("handles delegated token transfer", async () => {
    let fromAccount = accounts[2];
    let toAccount = accounts[3];
    let spendingAccount = accounts[4];
    let transferAmount = 10;
    await coinInstance.transfer(fromAccount, 100, {
      from: creator,
    });

    await coinInstance.approve(spendingAccount, transferAmount, {
      from: fromAccount,
    });

    try {
      // Try transfering somethign larget than the sender's balance

      await coinInstance.transferFrom(fromAccount, toAccount, 99999999999, {
        from: spendingAccount,
      });
    } catch (error) {
      assert(
        error.message.indexOf("revert") >= 0,
        "Cannot transfer more than current balance"
      );
    }

    try {
      // Try transfering somethign larget than the approved amount
      await coinInstance.transferFrom(fromAccount, toAccount, 20, {
        from: spendingAccount,
      });
    } catch (error) {
      assert(
        error.message.indexOf("revert") >= 0,
        "CAnnot transfer more than approved amount balance"
      );
    }

    try {
      assert.equal(
        await coinInstance.transferFrom.call(fromAccount, toAccount, 20, {
          from: spendingAccount,
        }),
        true,
        "Transfer Successful"
      );
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, error.message);
    }

    try {
      let receipt = await coinInstance.transferFrom(
        fromAccount,
        toAccount,
        10,
        {
          from: spendingAccount,
        }
      );
      assert.equal(receipt.logs.length, 2, "triggers one event");
      assert.equal(
        receipt.logs[1].event,
        "Transfer",
        'Should be the "Transfer" event'
      );
      assert.equal(
        receipt.logs[1].args.from,
        fromAccount,
        "logs the account the tokens are trasferred from"
      );
      assert.equal(
        receipt.logs[1].args.to,
        toAccount,
        "logs the account the tokens are trasferred to"
      );
      assert.equal(receipt.logs[1].args.value, 10, "logs the transfer amount");

      console.log(receipt);
      console.log("Receipt Logs: " + JSON.stringify(receipt.logs[1]));
      console.log(
        "Receipt Logs Transfer Amount: " + receipt.logs[1].args.value
      );
    } catch (error) {
      console.log(error);
      assert(error.message.indexOf("revert") >= 0, error.message);
    }

    BalanceOfFrom = await coinInstance.balanceOf(fromAccount);

    assert.equal(
      BalanceOfFrom.toNumber(),
      90,
      "deducts the amount to the sending account"
    );
    console.log("From Account: " + BalanceOfFrom.toNumber());

    BalanceOfTo = await coinInstance.balanceOf(toAccount);

    assert.equal(
      BalanceOfTo.toNumber(),
      10,
      "adds the amount to the receiving account"
    );
    console.log("From Account: " + BalanceOfTo.toNumber());

    allowance = await coinInstance.allowance(fromAccount, spendingAccount);

    assert.equal(
      allowance.toNumber(),
      0,
      "deducts the amount form the allowance"
    );
  });
});
