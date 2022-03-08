// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./Vault.sol";

//100000000000000000000000000
contract Steinnegen is ERC20 {
    Vault public tokenContract;

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event TransferToVault(
        address indexed from,
        Vault indexed tokenContract,
        uint256 value
    );

    constructor(Vault _tokenContract) ERC20("Steinnegen", "STEIN") {
        _mint(msg.sender, 100000000000000000000000000);
        tokenContract = _tokenContract;
    }

    function send() public payable {
        require(msg.sender != address(0), "ERC20: transfer from the zero address");
        require(address(tokenContract) != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(msg.sender, address(tokenContract), msg.value);

        uint256 fromBalance = balanceOf(msg.sender);

        require(
            fromBalance >= msg.value,
            "ERC20: transfer amount exceeds balance"
        );


        
        payable(address(tokenContract)).transfer(msg.value);

        emit TransferToVault(msg.sender, tokenContract, msg.value);
    }
}
