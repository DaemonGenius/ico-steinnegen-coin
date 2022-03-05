// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Steinnegen is ERC20 {
    bool public transfersEnabled;
    bool public masterTransfersEnabled;
    address public masterWallet = 0xD8271285C255Ce31b9b25E46ac63619322Af5934;
    uint256 public constant TOTAL_PRESALE_TOKENS = 100000000000000000000000000;

    struct Checkpoint {
        uint128 fromBlock;
        uint128 value;
    }

    Checkpoint[] totalSupplyHistory;
    
    mapping(address => Checkpoint[]) balances;
    mapping(address => mapping(address => uint256)) allowed;

    bool public mintingFinished = false;
    bool public presaleBalancesLocked = false;

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    constructor() ERC20("Steinnegen", "STEIN") {}

    /**
     * Token creation functions - can only be called by the tokensale controller during the tokensale period
     * @param _owner {address}
     * @param _amount {uint256}
     * @return success {bool}
     */
    function mint(address _owner, uint256 _amount)
        public
        canMint
        returns (bool)
    {
        uint256 curTotalSupply = totalSupply();
        uint256 previousBalanceTo = balanceOf(_owner);

        require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
        require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow

        _mint(msg.sender, TOTAL_PRESALE_TOKENS);

        return true;
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
