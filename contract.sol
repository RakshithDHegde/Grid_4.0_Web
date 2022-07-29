// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

error NotOwner();

contract  mintGrid is  ERC721,ERC721URIStorage,ERC721Enumerable {

    using SafeMath for uint256;
    uint constant mintprice=0;
        struct  UserData{
        string name;
        string email;
        string phone;
        string[] productIds;
    }
     mapping(address=>UserData)users;
     mapping(string=>address)owners;
     mapping (string => uint256) producIdMapping;
     address[] rewardParticipants;
     address[]rewardWinners;
     function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
    address i_owner;
    uint256 reward;
    mapping(string=>uint256)cost;
    function storeUser(string memory email,string memory name,string memory phone) public{
        string [] memory arr;
        users[msg.sender]=UserData(name,email,phone,arr);
    }
    function checkUser()public view returns(bool){
        if(bytes(users[msg.sender].name).length==0)return false;
        else return true;
    }
    function getUser()public view returns(UserData memory){
        return users[msg.sender];
    }
  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
  function _burn(uint256 tokenId) internal override(ERC721,ERC721URIStorage){
      super._burn(tokenId);
  }
  function tokenURI(uint256 tokenId) public view override(ERC721,ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
    }
constructor() ERC721("GRIDMINTER","GRID"){
    i_owner=msg.sender;
    cost["prod1"]=430000000000000000;
    cost["prod2"]=120000000000000000;
    cost["prod3"]=180000000000000000;
    cost["prod4"]=50000000000000000;
    cost["prod5"]=120000000000000000;
    cost["prod6"]=36000000000000000;
    reward=5000000000000000;
}

function createWarranty (string memory _uri,string memory prodId,string memory productNo) public payable{
    require(cost[productNo]!=0,"Invalid Product No");
    require(msg.value == cost[productNo], "Incorrect Amount!");
    rewardParticipants.push(msg.sender);
    uint256 mintIndex=totalSupply();
    _safeMint(msg.sender,mintIndex);
    _setTokenURI(mintIndex,_uri);
    producIdMapping[prodId]=mintIndex;
    users[msg.sender].productIds.push(prodId);
    owners[prodId]=msg.sender;
}

function getUserProducts()public view returns(string [] memory){
string [] memory prodIdArr=users[msg.sender].productIds;
string [] memory products=new string[](prodIdArr.length);
uint256 tokenId;
for(uint256 i=0;i<prodIdArr.length;i++){
tokenId=producIdMapping[prodIdArr[i]];
products[i]=tokenURI(tokenId);
}
return products;
}
function getWarranty(string memory prodId)public view returns(string memory){
    return tokenURI(producIdMapping[prodId]);
}
function getOwner(string memory prodId)public view returns (string [] memory){
    string[] memory user=new string[] (3);
    address owner=owners[prodId];
    user[0]=users[owner].name;
    user[1]=users[owner].email;
    user[2]=Strings.toHexString(uint256(uint160(owner)), 20);
    return user;
}
modifier onlyOwner {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    } 
function withdraw() payable onlyOwner public {
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Withdraw failed");
    }
function random() private view returns(uint){ 
        return uint (keccak256(abi.encode(block.timestamp, rewardParticipants)));
    }
    function holdLottery() public onlyOwner{ 
require(rewardParticipants.length>0,"Insufficient Participients");
 uint256 index = random() % rewardParticipants.length; 
 (bool callSuccess, ) = payable (rewardParticipants[index]).call{value: reward}("");
 require(callSuccess, "Lottery failed");
        rewardWinners.push(rewardParticipants[index]);
         rewardParticipants[index] = rewardParticipants[rewardParticipants.length - 1];
    rewardParticipants.pop();
    }
function getRewardParticipants()public view returns(address[] memory){
    return rewardParticipants;
}
function getRewardWinners()public view returns(address[]memory){
    return rewardWinners;
}
function getContractOwner()public view returns(address){
    return i_owner;
}
function checkContractOwner()public view returns(bool){
    return (i_owner==msg.sender);
}
}