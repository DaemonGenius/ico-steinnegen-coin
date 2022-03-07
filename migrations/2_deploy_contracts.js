const Steinnegen = artifacts.require("./Steinnegen.sol");
const VaultFactory = artifacts.require("./VaultFactory.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Steinnegen);

  let vaultFacotry = await deployer.deploy(VaultFactory);

  let vaultAddress = await vaultFacotry.newVault('0x14607953Cf74fC71CD1ACD471b326bD947a864E9', '1646683356', {
    from: '0x00a7718EE2cA322bE6Da3E3aC073b743e39399c1',
    value: 5000000000000,
  });

  console.log(vaultAddress);
};
