const Steinnegen = artifacts.require("./Steinnegen.sol");
const VaultFactory = artifacts.require("./VaultFactory.sol");
var Coin = artifacts.require("./Steinnegen.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

module.exports = async (deployer) => {
  await deployer.deploy(Steinnegen);
  let creator = "0x00a7718EE2cA322bE6Da3E3aC073b743e39399c1";
  let owner = "0x144Ae5F1C1a53d7F32341627846c1669Ac6d5e8E";

  let coinInstance = await Coin.deployed();

  let totalSupply = await coinInstance.totalSupply();
  totalSupply = web3.utils.fromWei(totalSupply, "ether") / 2
  console.log(totalSupply);

  let tokenAllocation = web3.utils.toWei(totalSupply.toString(), "ether")
  let tokenReserve = web3.utils.toWei(totalSupply.toString(), "ether")

  console.log(tokenAllocation);


  let vaultFacotry = await deployer.deploy(VaultFactory);

  let vaultAddress = await vaultFacotry.newVault(
    owner,
    "1646683356",
    {
      from: creator,
      value: 0,
    }
  );

  console.log(vaultAddress.logs[0]);
  console.log(vaultAddress.logs[0].args.amount.toNumber());
  console.log(vaultAddress.logs[0].address);

  receipt = await coinInstance.transfer(vaultAddress.logs[0].address, tokenAllocation, {
    from: creator,
  });

  console.log(receipt.logs[0]);
  console.log(accounts[0]);
};
