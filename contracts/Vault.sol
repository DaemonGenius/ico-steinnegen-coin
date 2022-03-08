// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Vault {
    address public creator;
    string public vaultName;
    address public owner;
    uint256 public unlockDate;
    uint256 public createdAt;
    uint256 public startedAt;
    uint256 public tokenHoldings;
    mapping(address => uint256) public balanceOf;

    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        address _creator,
        address _owner,
        uint256 _unlockDate
    ) {
        creator = _creator;
        vaultName = _name;
        owner = _owner;
        unlockDate = _unlockDate;
        createdAt = block.timestamp;
        balanceOf[address(this)] = 0;
    }

    // callable by owner only, after specified time
    function withdraw() public payable onlyOwner {
        require(block.timestamp >= unlockDate);
        //now send all the balance
        payable(msg.sender).transfer(address(this).balance);
        emit Withdrew(msg.sender, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens(address _tokenContract) public onlyOwner {
        require(block.timestamp >= unlockDate);
        ERC20 token = ERC20(_tokenContract);
        //now send all the token balance
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(owner, tokenBalance);
        emit WithdrewTokens(_tokenContract, msg.sender, tokenBalance);
    }

    function info()
        public
        view
        returns (
            string memory,
            address,
            address,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            vaultName,
            creator,
            owner,
            unlockDate,
            createdAt,
            balanceOf[address(this)]
        );
    }

    function transfer(uint256 _numberOfTokens) public returns (bool success) {
        // require that the value is greater or equal for transfer
        // transfer the amount and subtract the balance
        // add the balance
        balanceOf[address(this)] += _numberOfTokens;
        emit Transfer(msg.sender, address(this), _numberOfTokens);
        return true;
    }

    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
