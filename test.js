const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// Create new block 
// bitcoin.createNewBlock(1000, '0183018018303', '013081308108130');
// // Create new tx
// bitcoin.createNewTransaction(100, 'JEN81083113', 'ALEX8310813');
// // Create new block to add transaction to
// bitcoin.createNewBlock(1001, '0183018018304', '013081308108131');

// Test pow
// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// See whole blockchain
// console.log(bitcoin)
// Test hashblock method
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 44635));

// See transactions
// console.log(bitcoin.chain[1]);

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1531069348776,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1531069421348,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1531069457820,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "b21b6b7082d011e88664873ca024ed20",
                    "transactionId": "dd614cf082d011e88664873ca024ed20"
                },
                {
                    "amount": 10,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "ea3aca5082d011e88664873ca024ed20"
                },
                {
                    "amount": 20,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "ed76946082d011e88664873ca024ed20"
                },
                {
                    "amount": 30,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "efa0a05082d011e88664873ca024ed20"
                }
            ],
            "nonce": 211729,
            "hash": "00004a70860c31007680d84a01b97332e676f21cff8b0652ce310b3e32d999a4",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1531069484754,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "b21b6b7082d011e88664873ca024ed20",
                    "transactionId": "f31ca7b082d011e88664873ca024ed20"
                },
                {
                    "amount": 40,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "fb9032e082d011e88664873ca024ed20"
                },
                {
                    "amount": 50,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "fd7b882082d011e88664873ca024ed20"
                },
                {
                    "amount": 60,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "ffc48dc082d011e88664873ca024ed20"
                },
                {
                    "amount": 70,
                    "sender": "1203810381014AU84",
                    "recipient": "120831081084081344",
                    "transactionId": "017fab4082d111e88664873ca024ed20"
                }
            ],
            "nonce": 887,
            "hash": "00008d3d3e2485f9e9e57df87fe40c226d8535ce117c5efa6c4da1db34170ddb",
            "previousBlockHash": "00004a70860c31007680d84a01b97332e676f21cff8b0652ce310b3e32d999a4"
        },
        {
            "index": 5,
            "timestamp": 1531069485918,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "b21b6b7082d011e88664873ca024ed20",
                    "transactionId": "0328c76082d111e88664873ca024ed20"
                }
            ],
            "nonce": 1187,
            "hash": "00006d0f9fcfebe5399baa77d7bc8e1272930a581a61906e8131f4e1791aaab3",
            "previousBlockHash": "00008d3d3e2485f9e9e57df87fe40c226d8535ce117c5efa6c4da1db34170ddb"
        },
        {
            "index": 6,
            "timestamp": 1531069488104,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "b21b6b7082d011e88664873ca024ed20",
                    "transactionId": "03da3d1082d111e88664873ca024ed20"
                }
            ],
            "nonce": 193024,
            "hash": "00007169a7eaae4625850a3689b1b5a36096f9370bf25a800755f878efbf97d",
            "previousBlockHash": "00006d0f9fcfebe5399baa77d7bc8e1272930a581a61906e8131f4e1791aaab3"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "b21b6b7082d011e88664873ca024ed20",
            "transactionId": "0527cbb082d111e88664873ca024ed20"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
};

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));