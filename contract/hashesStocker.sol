pragma solidity^0.4.17;


contract hashes {
    mapping(bytes32 => string) public descriptions;
    mapping(bytes32 => address) public senderAddresses;

    function uploadHash(bytes32 _hash, string _description) public returns(bytes32) {
        //_hash has to be a keccak256 hash
        
        require(bytes(descriptions[_hash]).length == 0);
        descriptions[_hash] = _description;
        senderAddresses[_hash] = msg.sender;
        return _hash;
    }
}