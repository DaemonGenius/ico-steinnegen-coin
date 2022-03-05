// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Steinnegen is ERC20 {
    
    bool public transfersEnabled;
    bool public masterTransfersEnabled;

    constructor() ERC20("Steinnegen", "STEIN") {
        _mint(msg.sender, 100000000000000000000000000);
    }

    /**
     * Enable or block transfers - to be called in case of emergency
     * @param _value {bool}
     */
    function enableTransfers(bool _value) public {
        transfersEnabled = _value;
    }

    /**
     * Enable or block transfers - to be called in case of emergency
     * @param _value {bool}
     */
    function enableMasterTransfers(bool _value) public {
        masterTransfersEnabled = _value;
    }
}
