// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor(string memory nftName, string memory nftSymbol)
        ERC721(nftName, nftSymbol) {}

    function mintNFT(string memory tokenUri) public returns(uint256) {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenUri);

        return newTokenId;
    }

}
