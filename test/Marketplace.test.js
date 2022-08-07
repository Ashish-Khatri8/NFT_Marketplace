const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", () => {

    let owner;
    let buyer1;
    let buyer2;
    let buyer3;

    let BlazeToken;
    let blazeToken;

    let NFT;
    let nft;

    let Marketplace;
    let marketplace;

    const tokenUri = "https://jsonkeeper.com/b/SAGC";

    beforeEach(async () => {
        [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();
        // Deploy the ERC20 token contract
        BlazeToken = await ethers.getContractFactory("BlazeToken");
        blazeToken = await BlazeToken.deploy(
            100000000,
            "BlazeK",
            "BLZ"
        );
        await blazeToken.deployed();

        // Deploy the NFT token
        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
            "NFT_Token",
            "NFT"
        );
        await nft.deployed();

        // Deploy the Marketplace contract
        Marketplace = await ethers.getContractFactory("MarketPlace");
        marketplace = await Marketplace.deploy(
            blazeToken.address,
            nft.address
        );
        await marketplace.deployed();

        // Send tokens to other accounts
        await blazeToken.transfer(
            buyer1.address,
            ethers.utils.parseUnits("1000000", 18)
        );
        await blazeToken.transfer(
            buyer2.address,
            ethers.utils.parseUnits("1000000", 18)
        );

        // Give marketplace contract erc20 token allowance and
        // ERC721 NFT token approvals from all accounts.
        
        await blazeToken.approve(
            marketplace.address, 
            ethers.utils.parseUnits("1000000", 18)
        );
        await nft.setApprovalForAll(
            marketplace.address,
            true
        );

        await blazeToken.connect(buyer1).approve(
            marketplace.address, 
            ethers.utils.parseUnits("1000000", 18)
        );
        await nft.connect(buyer1).setApprovalForAll(
            marketplace.address,
            true
        );

        await blazeToken.connect(buyer2).approve(
            marketplace.address, 
            ethers.utils.parseUnits("1000000", 18)
        );
        await nft.connect(buyer2).setApprovalForAll(
            marketplace.address,
            true
        );
        
    });

    it("User can mint NFT", async () => {
        await nft.mintNFT(tokenUri);
        const ownerBalance = await nft.balanceOf(owner.address);
        expect(ownerBalance).to.equal(1);
        expect(await nft.ownerOf(1)).to.equal(owner.address);
    });

    it("User can list the minted NFT", async() => {
        //Mint the NFT
        await nft.mintNFT(tokenUri);

        // List the NFT token.
        await marketplace.listNFT(
            1,
            ethers.utils.parseUnits("1000", 18),
            30
        );

        const listingDetails = await marketplace.listingDetails(1);
        expect(listingDetails.owner.addr).to.equal(owner.address);
    });

    it("Other users can buy the listed NFTs", async () => {
        const ownerInitialBalance = await blazeToken.balanceOf(owner.address);
        //Mint the NFT
        await nft.mintNFT(tokenUri);

        // List the NFT token.
        await marketplace.listNFT(
            1,
            ethers.utils.parseUnits("1000", 18),
            30
        );
        expect(await nft.ownerOf(1)).to.equal(owner.address);

        // Now, buy the listed NFT with another account.
        await marketplace.connect(buyer1).buyNFT(1);

        // Check if ownership of NFT transferred correctly.
        expect(await nft.ownerOf(1)).to.equal(buyer1.address);
        
        // Check if the contract received the platform fees.
        const contractBalance = await blazeToken.balanceOf(marketplace.address);
        expect(contractBalance).to.equal(
            ethers.utils.parseUnits("25", 18)
        );

        // Check if the NFT seller received the rest of sell price.
        expect(ownerInitialBalance).to.not.equal(await blazeToken.balanceOf(owner.address));
    });
});
