/* Copyright (C) 2018 Elkael Maxime

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA. */

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