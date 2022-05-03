// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract MarketPlace is Ownable, ReentrancyGuard {

    using SafeERC20 for IERC20;
    IERC20 private tokenContract;
    IERC721 private nftContract;

    struct NFT_Owner {
        address payable addr;
        uint256 royaltyPercentage;
    }

    struct NFT_Item {
        NFT_Owner previousOwner;
        NFT_Owner owner;
        address payable seller;
        uint256 tokenId;
        uint256 price;
        bool isListed;
    }

    // Mapping tokenIds to Nft Listings.
    mapping(uint256 => NFT_Item) private nftListings;

    event NFT_Listed(
        address indexed by,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFT_Sold(
        address indexed by,
        address indexed to,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(
        IERC20 _tokenAddress,
        IERC721 _nftAddress
    ) {

        require(
            address(_tokenAddress) != address(0),
            "Marketplace: ERC20 token address cannot be null address."
        );
        require(
            address(_nftAddress) != address(0),
            "Marketplace: NFT token address cannot be null address."
        );
        require(
            address(_nftAddress) != address(_tokenAddress),
            "Marketplace: NFT and Token contracts cannot be same."
        );

        tokenContract = _tokenAddress;
        nftContract = _nftAddress;
    }

    function collectPlatformEarnings() external onlyOwner {
        tokenContract.safeTransfer(
            owner(),
            tokenContract.balanceOf(address(this))
        );
    }

    function listingDetails(uint256 _tokenId) external view returns(NFT_Item memory) {
        return nftListings[_tokenId];
    }

    function listNFT(
        uint256 _tokenId,
        uint256 _price,
        uint256 _royaltyPercentage
    ) public {
        require(
            nftContract.ownerOf(_tokenId) == msg.sender ||
            nftContract.getApproved(_tokenId) == msg.sender,
            "Marketplace: You are not authorized to list this NFT."
        );
        require(
            _price > 0,
            "Marketplace: NFT price must be greater than 0."
        );
        require(
            _royaltyPercentage >= 0 &&
            _royaltyPercentage < 31,
            "Marketplace: Royalty Percentage must be between 0 and 30%."
        );

        //  Update previous owner.
        NFT_Owner memory previousOwner = nftListings[_tokenId].owner;
        
        // Create new owner object.
        NFT_Owner memory owner = NFT_Owner(
            payable(nftContract.ownerOf(_tokenId)),
            _royaltyPercentage
        );

        // Create new nft item.
        NFT_Item memory newItem = NFT_Item(
            previousOwner,
            owner,
            payable(msg.sender),
            _tokenId,
            _price,
            true
        );

        // List the new item.
        nftListings[_tokenId] = newItem;
        // Emit the NFT_Listed event.
        emit NFT_Listed(
            msg.sender,
            _tokenId,
            _price
        );
    }

    function buyNFT(uint256 _tokenId) external payable {
        require(
            nftListings[_tokenId].isListed == true,
            "Marketplace: NFT with given id is not available for sale."
        );
        require(
            nftListings[_tokenId].owner.addr != msg.sender &&
            nftListings[_tokenId].seller != msg.sender,
            "Marketplace: Cannot buy your own NFT."
        );
        require(
            tokenContract.allowance(msg.sender, address(this)) >= nftListings[_tokenId].price,
            "Marketplace: Unsufficient token allowance."
        );

        // Calculate royalties and platform fees.
        uint256 nftPrice = nftListings[_tokenId].price;
        uint256 platformFees = (25 * nftPrice) / 1000; // 2.5%

        // ROyalties for previous owner.
        uint256 royalties = (
            nftListings[_tokenId].previousOwner.royaltyPercentage * nftPrice
        ) / 100;
        
        // NFT sell price after reductions.
        uint256 updatedPrice = nftPrice - platformFees - royalties;

        // Transfer updated sell price to current NFT owner.
        tokenContract.safeTransferFrom(
            msg.sender,
            nftListings[_tokenId].owner.addr,
            updatedPrice
        );

        // Transfer royalties to previous NFT owner.
        if (nftListings[_tokenId].previousOwner.addr != address(0)) {
            tokenContract.safeTransferFrom(
                msg.sender,
                nftListings[_tokenId].previousOwner.addr,
                royalties
            );
        }

        // Transfer platform fees to the contract.
        tokenContract.safeTransferFrom(
            msg.sender,
            address(this),
            platformFees
        );

        // Transfer NFT to the buyer.
        nftContract.safeTransferFrom(
            nftListings[_tokenId].owner.addr,
            msg.sender,
            _tokenId
        );

        // Remove NFT from listing
        nftListings[_tokenId].isListed = false;

        // Emit the NFT_Sold event.
        emit NFT_Sold(
            nftListings[_tokenId].seller,
            msg.sender,
            _tokenId,
            nftPrice
        );
    }

}
