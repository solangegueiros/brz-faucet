import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import './App.css';
import Token from "./contracts/BRZ.json";
import TokenMinter from "./contracts/BRZTokenMinter.json";

function App() {
  const [account, setAccount] = useState('');
  const [tokenMinter, setTokenMinter] = useState(null);
  const [token, setToken] = useState(null);  
  const [name, setName] = useState('');

  const [inputValue, setInputValue] = useState();
  const [inputAddress, setInputAddress] = useState();  
 

  useEffect(() => {
    async function loadWeb3() {      
      //window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
      }
      console.log (window.web3.currentProvider);
    }
    
    async function loadBlockchainData() {
      try {
        const web3 = window.web3;
       
        // Load first account
        const [account] = await web3.eth.getAccounts();
        console.log ('account: ', account);
        setAccount(account);

        // Check which network is active on web3
        const networkId = await web3.eth.net.getId();
        console.log ('networkId: ', networkId);

        // Check if ElFederal has been published on that network
        var networkData = TokenMinter.networks[networkId];        
        if (networkData) {
          console.log ('TokenMinter address: ', networkData.address);
          var contract = new web3.eth.Contract(
            TokenMinter.abi,
            networkData.address,
          );
          setTokenMinter(contract);

          var tokenAddress = await contract.methods.tokenBRZ().call();
          console.log ('token address: ', tokenAddress);
          if (networkData) {
            contract = new web3.eth.Contract(
              Token.abi,
              tokenAddress,
            );
            setToken(contract);
            setName(await contract.methods.name().call());
          }
        } else {
          window.alert('Smart contract not deployed to detected network.');
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadWeb3().then(() => loadBlockchainData());
  }, []);

  const handleGetTokens = e => {
    e.preventDefault();

    console.log ('inputAddress: ', inputAddress);
    console.log ('inputValue: ', inputValue);
    tokenMinter.methods.mint(inputAddress.toLowerCase(), inputValue)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log ('transaction receipt: ', receipt);
        setInputAddress('');
        setInputValue();
      });
  };
   
  
  return (
    <Container>
      <div className="App">

        <div>
          <h1>BRZ Faucet</h1>
          {token && <p>Token {name}: {token._address}</p>}
          {account && <p>Your account: {account}</p>}
          <p>Networks: 
            <br/>
            Ethereum Rinkeby, <br/>
            Binance Smart Chain Testnet <br/>
            RSK Testnet <br/>
            <br/>
            Tokens will be issued to the selected network in your web wallet.
          </p>
          <p>Network selected: </p>
        </div>

        <Row>
          <Col>
            <Form onSubmit={handleGetTokens}>
              <Form.Group controlId="formMintAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  placeholder="Address"
                  onChange={(e) => setInputAddress(e.target.value)}
                  value={inputAddress}
                />
              </Form.Group>
              <Form.Group controlId="formMintValue">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  placeholder="Amount"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
              </Form.Group>
              <Button type="submit">Get Tokens</Button>
            </Form>          
          </Col>
        </Row>
      </div>
      
      <br/>
    </Container>

  );
}

export default App;
