import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import type { AnonScholar } from "../types/contracts/AnonScholar";
import { AnonScholar__factory } from "../types/factories/contracts/AnonScholar__factory";

task("task:deployAnonScholar")
  .setDescription("Deploy the AnonScholar contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const { deploy } = deployments;
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying AnonScholar with account:", deployer.address);
    
    const anonScholar = await deploy("AnonScholar", {
      from: deployer.address,
      log: true,
    });
    
    console.log("AnonScholar deployed to:", anonScholar.address);
  });

task("task:getQuestionCount")
  .setDescription("Get the total number of questions")
  .addParam("contract", "The AnonScholar contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const contractAddr: string = taskArguments.contract as string;
    const [signer] = await ethers.getSigners();
    const anonScholar: AnonScholar = AnonScholar__factory.connect(contractAddr, signer);

    try {
      const counters = await anonScholar.getCounters();
      console.log("Question count:", counters[0].toString());
      console.log("Answer count:", counters[1].toString());
    } catch (e) {
      console.log("Error getting counters:", e);
    }
  });

// task("task:postTestQuestion")
//   .setDescription("Post a test question with encrypted content")
//   .addParam("contract", "The AnonScholar contract address")
//   .setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     // This task requires the relayer SDK which has import issues in the current setup
//     console.log("This task is temporarily disabled due to SDK import issues");
//   });

// task("task:postTestAnswer")
//   .setDescription("Post a test answer to a question")
//   .addParam("contract", "The AnonScholar contract address")
//   .addParam("questionid", "The question ID to answer")
//   .setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     // This task requires the relayer SDK which has import issues in the current setup
//     console.log("This task is temporarily disabled due to SDK import issues");
//   });

task("task:getRecentQuestions")
  .setDescription("Get recent questions from the platform")
  .addParam("contract", "The AnonScholar contract address")
  .addOptionalParam("count", "Number of questions to retrieve", "5")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const contractAddr: string = taskArguments.contract as string;
    const count: number = parseInt(taskArguments.count as string, 10);
    const [signer] = await ethers.getSigners();
    const anonScholar: AnonScholar = AnonScholar__factory.connect(contractAddr, signer);

    try {
      console.log(`Getting ${count} recent questions...`);
      
      const questionIds = await anonScholar.getRecentQuestions(count);
      console.log("Recent question IDs:", questionIds.map((id) => id.toString()));
      
      // Get details for each question
      for (let i = 0; i < questionIds.length; i++) {
        const questionId = questionIds[i];
        const question = await anonScholar.getQuestion(questionId);
        
        console.log(`\nQuestion ${questionId}:`);
        console.log("- Timestamp:", new Date(Number(question.timestamp) * 1000).toISOString());
        console.log("- Encrypted Content Handle:", question.encryptedContent);
        console.log("- Encrypted Asker Handle:", question.encryptedAsker);
        console.log("- Question ID:", question.questionId.toString());
      }
      
    } catch (e) {
      console.log("Error getting questions:", e);
    }
  });
