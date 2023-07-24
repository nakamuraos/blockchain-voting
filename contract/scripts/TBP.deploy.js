const { ethers, upgrades } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // deploy
  const TBP = await hre.ethers.getContractFactory("TheBestPhotography");
  const tbp = await TBP.deploy("1689801963", "1690665963", "https://raw.githubusercontent.com/App-Voting/The-Best-Photography/main/blockchain");
  await tbp.deployed();
  console.log("tbp deployed to:", tbp.address);

  await sleep(10000);

  await hre.run("verify:verify", {
    address: tbp.address,
    constructorArguments: ["1689801963", "1690665963", "https://raw.githubusercontent.com/App-Voting/The-Best-Photography/main/blockchain"],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
