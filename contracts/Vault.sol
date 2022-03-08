// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Vault {
    address public creator;
    string public name;
    address public owner;
    uint256 public unlockDate;
    uint256 public createdAt;
    uint256 public startedAt;

    
    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);

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
        name = _name;
        owner = _owner;
        unlockDate = _unlockDate;
        createdAt = block.timestamp;
    }

     // callable by owner only, after specified time
    function withdraw() onlyOwner public payable {
       require(block.timestamp >= unlockDate);
       //now send all the balance
       payable(msg.sender).transfer(address(this).balance);
       emit Withdrew(msg.sender, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens(address _tokenContract) onlyOwner public {
       require(block.timestamp >= unlockDate);
       ERC20 token = ERC20(_tokenContract);
       //now send all the token balance
       uint256 tokenBalance = token.balanceOf(address(this));
       token.transfer(owner, tokenBalance);
       emit WithdrewTokens(_tokenContract, msg.sender, tokenBalance);
    }

    function info() public view returns(string memory, address, address, uint256, uint256, uint256) {
        return (name, creator, owner, unlockDate, createdAt,  address(this).balance);
    }

    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}
