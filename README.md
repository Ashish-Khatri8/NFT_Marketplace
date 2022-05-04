# ERC721 NFT MarketPlace

## Contract: BlazeToken.sol

This contract deploys an ERC20 token with the following details.

- Name: "BlazeK"
- Symbol: "BLZ"
- Decimals: 18
- Total Supply: 100 million => 10**8 => 100000000

- Contract deployed on [rinkeby test network](https://rinkeby.etherscan.io/address/0x0b73b6C81f5345052fF326e64978fB5881CaF02B) at:

> 0x0b73b6C81f5345052fF326e64978fB5881CaF02B

## Contract: NFT.sol

- An ERC721 token minting contract that could be used to mint your own NFTs.

- A simple ERC721 token NFT minted on [rinkeby test network](https://rinkeby.etherscan.io/address/0xf001c13d21f1CC95D4Eac5fc8e957771BF312623).

- Contract Address: 0xf001c13d21f1CC95D4Eac5fc8e957771BF312623

## Marketplace.sol

- A marketplace contract where users can list their minted NFTs(from the NFT.sol contract) for sale, which then could be purchased by other users with ERC20 tokens(BlazeToken.sol).

- NFT owner can set a royalty percentage between 0 and 30%.

- Platform fees is 2.5%.

- Contract Address: 0xEf291DEF72092A3f9fa9FC46e078a45f132213ad

- Contract deployed on [rinkeby test network](https://rinkeby.etherscan.io/address/0xEf291DEF72092A3f9fa9FC46e078a45f132213ad).

### Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case.

```shell
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
