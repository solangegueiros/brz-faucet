const Token = artifacts.require("BRZ");
const TokenMinter = artifacts.require("BRZTokenMinter");

const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

module.exports = async (deployer, network, accounts)=> {

  console.log("network", network);

  //id 5777
  if (network == 'develop') {
    await deployer.deploy(Token, {from: accounts[0]});
    token = await Token.deployed();
  }
  console.log("token.address", token.address);

/* 
  result = await token.hasRole(ADMIN_ROLE, accounts[0]);
  console.log("accounts[0] admin in token", result);

  console.log("mint BRZ");
  await token.mint (accounts[0], 10000000, {from: accounts[0]});

  result = (await token.balanceOf(accounts[0])).toString();
  console.log("token.balanceOf", result);
*/

  // Minter
  tokenMinter = await deployer.deploy(TokenMinter, token.address, {from: accounts[0]});
  console.log("tokenMinter.address", tokenMinter.address);

  result = await tokenMinter.tokenBRZ();
  console.log("token.address in tokenMinter", result);

  //Add tokenMinter in MinterRole on tokenBRZ
  console.log("token.grantRole ADMIN_ROLE to", tokenMinter.address);
  await token.grantRole (ADMIN_ROLE, tokenMinter.address, {from: accounts[0]});

  result = await token.hasRole(ADMIN_ROLE, tokenMinter.address);
  console.log("tokenMinter.address admin in token", result);

  console.log("tokenMinter mint BRZ");
  await tokenMinter.mint (accounts[0], 10000000, {from: accounts[0]});

  result = (await token.balanceOf(accounts[0])).toString();
  console.log("token.balanceOf", result);
/*

*/

};
