const Steinnegen = artifacts.require("./Steinnegen.sol");
const VaultFactory = artifacts.require("./VaultFactory.sol");
var Coin = artifacts.require("./Steinnegen.sol");
var Vault = artifacts.require("./Vault.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

function tokens(number) {
  return web3.utils.toWei(number, 'ether')
}

module.exports = async (deployer) => {
  let creator = "0x3C81CFF5aC7a347088B1A979B59e3F01aAc9f3FC";
  let owner = "0x53ae0bB532FF0A463a98B515DAe84955C5A7ffe4";
  let vaultAddress = await Vault.new("ICO", creator, owner, "1646683356");

  await deployer.deploy(Steinnegen, vaultAddress.address);
  await deployer.deploy(VaultFactory);

  let coinInstance = await Coin.deployed();

  let totalSupply = await coinInstance.totalSupply();
  totalSupply = web3.utils.fromWei(totalSupply, "ether") / 2;

  let tokenAllocation = tokens(totalSupply.toString());

  let receipt;
  try {
    receipt = await coinInstance.send(tokenAllocation, {
      from: creator,
    });
  } catch (e) {
    console.error(e);
  }
  let creatorBalance = await coinInstance.balanceOf(creator);
  // console.log("Creator Balance: " + creatorBalance);

  // vaultInfo = await vaultAddress.info();
  // console.log(vaultInfo);
  // console.log("Vault Name: " + vaultInfo[0]);
  // console.log("Creator: " + vaultInfo[1]);
  // console.log("Owner: " + vaultInfo[2]);
  // console.log("Date Unlocked: " + vaultInfo[3]);
  // console.log("Date Created: " + vaultInfo[4]);
  // console.log("Balance: " + web3.utils.fromWei(vaultInfo[5], "ether"));

};
