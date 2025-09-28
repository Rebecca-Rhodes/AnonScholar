import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying AnonScholar contract...");
  console.log("Deployer address:", deployer);

  const deployedAnonScholar = await deploy("AnonScholar", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });

  console.log(`AnonScholar contract deployed at: ${deployedAnonScholar.address}`);
  console.log(`Transaction hash: ${deployedAnonScholar.transactionHash}`);
  
  // Verify contract on etherscan if not on local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    
    try {
      await hre.run("verify:verify", {
        address: deployedAnonScholar.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
};

export default func;
func.id = "deploy_anonscholar"; // id required to prevent reexecution
func.tags = ["AnonScholar"];


