const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", () => {

    let owner;
    let buyer1;
    let buyer2;
    let buyer3;

    let NFT;
    let nft;

    const tokenUri = "https://jsonkeeper.com/b/SAGC";

    beforeEach(async () => {
        [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();
        // Deploy the contract.
        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
            "NFT_Token",
            "NFT"
        );
        await nft.deployed();
    });

    it("Owner can mint NFT", async () => {
        const txn = await nft.mintNFT(tokenUri);
        txn.wait();
        const ownerBalance = await nft.balanceOf(owner.address);
        expect(ownerBalance).to.equal(1);
        expect(await nft.ownerOf(1)).to.equal(owner.address);
    });

    it("Other buyers can mint NFTs with incrementing token ids.", async () => {
        await nft.connect(buyer1).mintNFT(tokenUri);
        expect(await nft.balanceOf(buyer1.address)).to.equal(1);
        expect(await nft.ownerOf(1)).to.equal(buyer1.address);

        await nft.connect(buyer2).mintNFT(tokenUri);
        expect(await nft.balanceOf(buyer2.address)).to.equal(1);
        expect(await nft.ownerOf(2)).to.equal(buyer2.address);

        await nft.connect(buyer3).mintNFT(tokenUri);
        expect(await nft.balanceOf(buyer3.address)).to.equal(1);
        expect(await nft.ownerOf(3)).to.equal(buyer3.address);
    });

});
