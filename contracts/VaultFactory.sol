// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Vault.sol";

contract VaultFactory {
 
    mapping(address => address[]) wallets;

    address public wallet;

    function getWallets(address _user) 
        public
        view
        returns(address[] memory)
    {
        return wallets[_user];
    }

    function newVault(address _owner, uint256 _unlockDate)
        payable
        public
        returns(Vault vault)
    {
        // Create new wallet.
        vault = new Vault('default', msg.sender, _owner, _unlockDate);
        wallet = address(vault);
        
        // Add wallet to sender's wallets.
        wallets[msg.sender].push(wallet);

        // If owner is the same as sender then add wallet to sender's wallets too.
        if(msg.sender != _owner){
            wallets[_owner].push(wallet);
        }

        // Send ether from this transaction to the created contract.
        payable(wallet).transfer(msg.value);

        // Emit event.
        emit Created(wallet, msg.sender, _owner, block.timestamp, _unlockDate, msg.value);

        return vault;
    }

    // Prevents accidental sending of ether to the factory
    fallback () external {
        revert();
    }

    event Created(address wallet, address from, address to, uint256 createdAt, uint256 unlockDate, uint256 amount);
}