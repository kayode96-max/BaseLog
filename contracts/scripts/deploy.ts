const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying JournalRegistry to Base...");

  // Deploy the contract
  const JournalRegistry = await hre.ethers.getContractFactory("JournalRegistry");
  const registry = await JournalRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();

  console.log(`✅ JournalRegistry deployed to: ${address}`);
  console.log("\n📝 Update your .env file with:");
  console.log(`NEXT_PUBLIC_JOURNAL_REGISTRY_ADDRESS=${address}`);

  // Wait for a few block confirmations before verifying
  console.log("\n⏳ Waiting for block confirmations...");
  await registry.deploymentTransaction().wait(5);

  // Verify contract on Basescan
  console.log("\n🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.log("⚠️  Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
