const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  // const account = await web3.eth.getAccounts();
  // console.log(account[0]);
  // const balance = await web3.eth.getBalance(account[0]);
  // console.log(balance);
};
