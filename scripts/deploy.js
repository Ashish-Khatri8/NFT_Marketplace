const { ethers } = require("hardhat");

async function main() {
    const BlazeToken = await ethers.getContractFactory("BlazeToken");
    const NFT = await ethers.getContractFactory("NFT");

    // Deploy ERC20 token contract.
    const blazeToken = await BlazeToken.deploy(
        1000000,
        "BlazeK",
        "BLZ"
    );
    await blazeToken.deployed();

    // Deploy ERC721 token contract.
    const nft = await NFT.deploy(
        "NFT_Token",
        "NFT"
    );
    await nft.deployed();

    console.log("BlazeToken is deployed at: ", blazeToken.address);
    console.log("NFT deployed at: ", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    })
