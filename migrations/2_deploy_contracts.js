const Steinnegen = artifacts.require("./Steinnegen.sol");
const VaultFactory = artifacts.require("./VaultFactory.sol");

module.exports = async (deployer) => {
  await deployer.deploy(VaultFactory);
  await deployer.deploy(Steinnegen);
}; 



