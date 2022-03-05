const Steinnegen = artifacts.require("./Steinnegen.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Steinnegen);
}; 



