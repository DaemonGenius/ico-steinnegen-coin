var VaultFactory = artifacts.require("./VaultFactory.sol")
var vault = artifacts.require("./Vault.sol")
const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

let ethToSend = web3.utils.toWei('1', "ether");
let someGas = web3.utils.toWei('0.01', "ether");
let vaultFactory;
let creator;
let owner;

contract('VaultFactory', (accounts) => {

    before(async () => {
        creator = accounts[0];
        owner = accounts[1];
        vaultFactory = await VaultFactory.new({from: creator});

    });

    it("Factory created contract is working well", async () => {
        // Create the wallet contract.
        // let now = Math.floor((new Date).getTime() / 1000);
        let now = '1646519809';
        let end = '1649182035';
        await vaultFactory.newVault(
            owner, end, now, {from: creator, value: ethToSend}
        );

        // Check if wallet can be found in creator's wallets.
        let creatorWallets = await vaultFactory.getWallets.call(creator);
        assert(1 == creatorWallets.length);

        // Check if wallet can be found in owners's wallets.
        let ownerWallets = await vaultFactory.getWallets.call(owner);
        assert(1 == ownerWallets.length);
        
        // Check if this is the same wallet for both of them.
        assert(creatorWallets[0] === ownerWallets[0]);
    });

});