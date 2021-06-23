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
  else if (network == 'rinkeby') {
    tokenAddress = '0x06d164e8d6829e1da028a4f745d330eb764dd3ac';
    token = await Token.at(tokenAddress);
  }
  else if (network == 'rskTestnet') {
    tokenAddress = '0x06d164e8d6829e1da028a4f745d330eb764dd3ac';
    token = await Token.at(tokenAddress);
  }
  console.log("token.address", token.address);

  // Minter
  tokenMinter = await deployer.deploy(TokenMinter, token.address, {from: accounts[0]});
  console.log("tokenMinter.address", tokenMinter.address);

  //Add tokenMinter in MinterRole on tokenBRZ
  console.log("token.grantRole ADMIN_ROLE to", tokenMinter.address);
  await token.grantRole (ADMIN_ROLE, tokenMinter.address, {from: accounts[0]});

};
