const { ethers } = require("hardhat");

async function main() {
    const BlazeToken = await ethers.getContractFactory("BlazeToken");
    const blazeToken = await BlazeToken.deploy(
        1000000,
        "BlazeK",
        "BLZ"
    );
    await blazeToken.deployed();
    console.log("BlazeToken is deployed at: ", blazeToken.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    })
