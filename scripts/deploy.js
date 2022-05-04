const { ethers } = require("hardhat");

async function main() {
    // Deploy the ERC20 token contract
    const BlazeToken = await ethers.getContractFactory("BlazeToken");
    const blazeToken = await BlazeToken.deploy(
        100000000,
        "BlazeK",
        "BLZ"
    );
    await blazeToken.deployed();
    console.log("\nBlazeToken contract deployed at: ", blazeToken.address);

    // Deploy the NFT token contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(
        "NFT_Token",
        "NFT"
    );
    await nft.deployed();
    console.log("\nNFT contract deployed at: ", nft.address);

    // Deploy the Marketplace contract
    const Marketplace = await ethers.getContractFactory("MarketPlace");
    const marketplace = await Marketplace.deploy(
        blazeToken.address,
        nft.address
    );
    await marketplace.deployed();

    // Print contract addresses.
    console.log("\nMarketPlace contract deployed at: ", marketplace.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    })
