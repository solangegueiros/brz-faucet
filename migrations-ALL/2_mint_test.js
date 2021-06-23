const Token = artifacts.require("BRZ");
const TokenMinter = artifacts.require("BRZTokenMinter");

const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

module.exports = async (deployer, network, accounts)=> {

  console.log("network", network);

  //id 5777
  if (network == 'develop') {
    await deployer.deploy(Token, {from: accounts[0]});
    token = await Token.deployed();

    // Minter
    tokenMinter = await deployer.deploy(TokenMinter, token.address, {from: accounts[0]});
  }
  /*
  else if (network == 'rinkeby') {
    tokenAddress = '0x06d164e8d6829e1da028a4f745d330eb764dd3ac';
    token = await Token.at(tokenAddress);
  }
  */
  else if (network == 'rskTestnet') {
    tokenAddress = '0x06d164e8d6829e1da028a4f745d330eb764dd3ac';
    token = await Token.at(tokenAddress);

    tokenMinterAddress ='0x5573852041d11885809775dc381a99d3b097d7e4';
    tokenMinter = await TokenMinter.at(tokenMinterAddress);
  }

  console.log("token.address", token.address);
  console.log("tokenMinter.address", tokenMinter.address);

  result = await token.hasRole(ADMIN_ROLE, tokenMinter.address);
  console.log("tokenMinter.address is admin in token", result);

if (result == false) {
  console.log("token.grantRole ADMIN_ROLE to", tokenMinter.address);
  await token.grantRole (ADMIN_ROLE, tokenMinter.address, {from: accounts[0]});

  result = await token.hasRole(ADMIN_ROLE, tokenMinter.address);
  console.log("tokenMinter.address is admin in token", result);
}

 /*
  console.log("mint BRZ");
  //await token.mint (accounts[0], 10000000, {from: accounts[0]});
  //result = await token.balanceOf(accounts[0]);
  //console.log("token.balanceOf", result.toString());

  BrunoAddress = "0x3d4112Ca1801d4e46eCaFEfB64c0eDBcc55778EA"
  await token.mint (BrunoAddress, 10000000, {from: accounts[0]});
  result = await token.balanceOf(BrunoAddress);
  console.log("token.balanceOf", result.toString());
*/


  console.log("mint BRZ");
  await tokenMinter.mint (accounts[0], 10000000, {from: accounts[2]});
  result = (await token.balanceOf(accounts[0])).toString();
  console.log("token.balanceOf", result.toString());
  

/*
*/

};
