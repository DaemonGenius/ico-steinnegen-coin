// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./Vault.sol";

//100000000000000000000000000
contract Steinnegen is ERC20 {

    constructor() ERC20("Steinnegen", "STEIN") {
        _mint(msg.sender, 2000000000000000);
    }


}
