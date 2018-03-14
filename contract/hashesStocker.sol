pragma solidity^0.4.17;


contract hashes {
    mapping(bytes32 => string) descriptions;
    mapping(bytes32 => address) senderAddresses;


    function uploadHash(string _hash, string _description) public returns(string){
        bytes32 hashedHash = keccak256(_hash);
        require(bytes(descriptions[hashedHash]).length == 0);
        descriptions[hashedHash] = _description;
        senderAddresses[hashedHash] = msg.sender;
        return _hash;
    }

    function getHash(string _hash) constant public returns (address, string, bytes32){
        bytes32 hashedHash = keccak256(_hash);
        return (senderAddresses[hashedHash], descriptions[hashedHash], hashedHash);
    }
}