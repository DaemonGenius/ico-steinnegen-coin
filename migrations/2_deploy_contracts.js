const Steinnegen = artifacts.require("./Steinnegen.sol");
const VaultFactory = artifacts.require("./VaultFactory.sol");
var Coin = artifacts.require("./Steinnegen.sol");
var Vault = artifacts.require("./Vault.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

module.exports = async (deployer) => {
  let creator = "0x00a7718EE2cA322bE6Da3E3aC073b743e39399c1";
  let owner = "0x144Ae5F1C1a53d7F32341627846c1669Ac6d5e8E";
  let vaultAddress = await Vault.new("ICO", creator, owner, "1646683356");

  await deployer.deploy(Steinnegen, vaultAddress.address);
  await deployer.deploy(VaultFactory);

  let coinInstance = await Coin.deployed();

  let totalSupply = await coinInstance.totalSupply();
  totalSupply = web3.utils.fromWei(totalSupply, "ether") / 2;

  let tokenAllocation = web3.utils.toWei(totalSupply.toString(), "ether");
  let tokenReserve = web3.utils.toWei(totalSupply.toString(), "ether");

  console.log(tokenAllocation);

  console.log(vaultAddress.address);
  // let vaultAddress = await vaultFacotry.newVault(
  //   owner,
  //   "1646683356",
  //   {
  //     from: creator,
  //     value: 500,
  //   }
  // );
  // console.log(vaultAddress.logs[0]);
  // console.log(vaultAddress.logs[0].args.amount.toNumber());
  // console.log(vaultAddress.logs[0].address);

  // receipt = await coinInstance.transfer(vaultAddress.address, 500, {
  //   from: creator,
  // });

  // let vaultInfo = await vaultAddress.info()
  // console.log(vaultInfo);
  // console.log('Creator: ' + vaultInfo[0]);
  // console.log('Owner: ' + vaultInfo[1]);
  // console.log('Date Unlocked: ' +vaultInfo[3]);
  // console.log('Balance: '+ vaultInfo[4].toNumber());

  let receipt = await coinInstance.send({ from: creator, value: totalSupply });

  vaultInfo = await vaultAddress.info();
  console.log(vaultInfo);
  console.log("Vault Name: " + vaultInfo[0]);
  console.log("Creator: " + vaultInfo[1]);
  console.log("Owner: " + vaultInfo[2]);
  console.log("Date Unlocked: " + vaultInfo[3]);
  console.log("Date Created: " + vaultInfo[4]);
  console.log("Balance: " + vaultInfo[5].toNumber());

  let ownerBalance = await coinInstance.balanceOf(vaultAddress.address);
  console.log("Owner Balance: " + ownerBalance);

  console.log("receipt");
  console.log(receipt);
  console.log(receipt.logs[0]);

  console.log("vaultWallet: ");
  console.log(await web3.eth.getBalance(vaultAddress.address));

  console.log(accounts[0]);
};
