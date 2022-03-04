// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Steinnegen is ERC20 {
    constructor() ERC20("Steinnegen", "STEIN") {
        _mint(msg.sender, 100000000000000000000000000);
    }

    uint256 public totalWeiRaised;
    uint256 public tokensMinted;
    uint256 public totalSupply;
    uint256 public contributors;
    uint256 public decimalsMultiplier;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public remainingTokens;
    uint256 public allocatedTokens;
}
