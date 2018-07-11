const exec          = require('child_process').exec;
const uuid          = require('uuid/v1');
const rp            = require('request-promise');
const Blockchain    = require('../../blockchain');

const nodeAddress   = uuid().split('-').join('');
const nickcoin      = new Blockchain();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

module.exports = (app) => {
    app.get('/blockchain', (req, res) => {
        res.send(nickcoin);
    });
    
    app.post('/transaction', (req, res) => {
        const newTransaction = req.body;
        const blockIndex = nickcoin.addTransactionToPendingTransactions(newTransaction);
        res.json({ note: `Transaction will be added in block ${blockIndex}` });
    });
    
    app.post('/transaction/broadcast', (req, res) => {
        const newTransaction = nickcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
        nickcoin.addTransactionToPendingTransactions(newTransaction);
        const requestPromises = [];
        nickcoin.networkNodes.forEach(networkNodeUrl => {
            const options = {
                uri: networkNodeUrl + '/transaction',
                method: 'POST',
                body: newTransaction,
                json: true
            };
            requestPromises.push(rp(options));
        });
        Promise.all(requestPromises)
        .then(data => {
            res.json({ note: 'Transaction created and broadcast successfully' });
        }, error => {
            console.log(`There was an error: ${error}`);
        });
    });
    
    app.get('/mine', (req, res) => {
        const lastBlock = nickcoin.getLastBlock();
        const previousBlockHash = lastBlock['hash'];
        const currentBlockData = {
            transactions: nickcoin.pendingTransactions,
            index: lastBlock['index'] + 1
        };
        const nonce = nickcoin.proofOfWork(previousBlockHash, currentBlockData);
        const blockHash = nickcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    
        const newBlock = nickcoin.createNewBlock(nonce, previousBlockHash, blockHash);
        const requestPromises = [];
        nickcoin.networkNodes.forEach(networkNodeUrl => {
            const options = {
                uri: networkNodeUrl + '/receive-new-block',
                method: 'POST',
                body: { newBlock: newBlock },
                json: true
            };
            requestPromises.push(rp(options))
        });
    
        Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: nickcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: '00',
                    recipient: nodeAddress
                },
                json: true
            };
            return rp(requestOptions);
        }, error => {
            console.log(`An error occured: ${error}`)
        })
        .then(data => {
            res.json({
                note: `New block mined and broadcast successfully`,
                block: newBlock
            });
        }, error => {
            console.log(`An error occured: ${error}`);
        });
        
    });
    
    app.post('/receive-new-block', (req, res) => {
        const newBlock = req.body.newBlock;
        const lastBlock = nickcoin.getLastBlock();
        const correctHash = lastBlock.hash === newBlock.previousBlockHash;
        const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    
        if (correctHash && correctIndex) {
            nickcoin.chain.push(newBlock);
            nickcoin.pendingTransactions = [];
            res.json({
                node: 'New block received and accepted',
                newBlock: newBlock
            });
        } else {
            res.json({
                note: 'New block rejected',
                newBlock: newBlock
            });
        };
    })
    
    // Register and broadcast node to entire network
    app.post('/register-and-broadcast-node', (req, res) => {
        const newNodeUrl = req.body.newNodeUrl;
        if (nickcoin.networkNodes.indexOf(newNodeUrl) == -1) nickcoin.networkNodes.push(newNodeUrl);
        console.log(newNodeUrl);
        const regNodesPromises = [];
        nickcoin.networkNodes.forEach(networkNodeUrl => {
            const options = {
                uri: networkNodeUrl + '/register-node',
                method: 'POST',
                body: { newNodeUrl: newNodeUrl },
                json: true
            };
            regNodesPromises.push(rp(options))
        });
        Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [ ...nickcoin.networkNodes, nickcoin.currentNodeUrl ] },
                json: true
            };
            return rp(bulkRegOptions);
        }, error => {
            console.log('There was an error:' + error);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully!' });
        }, error => {
            console.log('There was an error' + error);
        })
        .catch(err => console.log(err));
    });
    
    // Register a new node with the network
    app.post('/register-node', (req, res) => {
        const newNodeUrl = req.body.newNodeUrl;
        const nodeNotAlreadyPresent = nickcoin.networkNodes.indexOf(newNodeUrl) == -1;
        const notCurrentNode = nickcoin.currentNodeUrl !== newNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) nickcoin.networkNodes.push(newNodeUrl);
        res.json({ note: 'New node registered successfully!' });
    });
    
    // Register multiple nodes at once
    app.post('/register-nodes-bulk', (req, res) => {
        const allNetworkNodes = req.body.allNetworkNodes;
        allNetworkNodes.forEach(networkNodeUrl => {
            const nodeNotAlreadyPresent = nickcoin.networkNodes.indexOf(networkNodeUrl) == -1;
            const notCurrentNode = nickcoin.currentNodeUrl !== networkNodeUrl;
            if (nodeNotAlreadyPresent && notCurrentNode) nickcoin.networkNodes.push(networkNodeUrl);
        });
    
        res.json({ note: 'Bulk registration successful' });
    });
    
    app.get('/consensus', (req, res) => {
        const requestPromises = [];
        nickcoin.networkNodes.forEach(networkNodeUrl => {
            const options = {
                uri: networkNodeUrl + '/blockchain',
                method: 'GET',
                json: true
            };
            requestPromises.push(rp(options))
        });
    
        Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = nickcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;
    
            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });
    
            if (!newLongestChain || (newLongestChain && !nickcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: nickcoin.chain
                });
            } else {
                nickcoin.chain = newLongestChain;
                nickcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced',
                    chain: nickcoin.chain
                });
            };
        });
    });

    app.get('/ip', (req, res) => {
        let ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).split(",")[0];
        console.log(ip);
        res.json({ip: ip});
    });

    app.get('/start', (req, res) => {
        let ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).split(",")[0];
        // execSync('nodemon --watch dev -e js index.js http://localhost:3001 3001');
        exec(`node /src/api/networkNode.js http://${ip}:3001 3001`, (error, stdout, stderr) => {
            const port = 3001;
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            };
            app.listen(port, () => {
                console.log('App listening on port ' + port);
            });
        });
    })
    
    
    app.get('/block/:blockHash', (req, res) => {
        const blockHash = req.params.blockHash;
        const correctBlock = nickcoin.getBlock(blockHash);
        res.json({
            block: correctBlock
        });
    });
    
    app.get('/transaction/:transactionId', (req, res) => {
        const transactionId = req.params.transactionId;
        const transactionData = nickcoin.getTransaction(transactionId);
        res.json({
            transaction: transactionData.transaction,
            block: transactionData.block
        });
    });
    
    app.get('/address/:address', (req, res) => {
        const address = req.params.address;
        const addressData = nickcoin.getAddressData(address);
        res.json({
            addressData: addressData
        });
    });
    
    app.get('/block-explorer', (req, res) => {
        res.sendFile('./block-explorer/index.html', {root: __dirname})
    });
}