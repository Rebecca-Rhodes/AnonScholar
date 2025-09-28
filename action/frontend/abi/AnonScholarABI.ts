// Auto-generated ABI file for AnonScholar contract
export const AnonScholarABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "answerId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AnswerPosted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contentId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isQuestion",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVisible",
        "type": "bool"
      }
    ],
    "name": "ContentModerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "QuestionPosted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "targetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isQuestion",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "answerCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "answerVotes",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "hasVoted",
        "type": "bytes32"
      },
      {
        "internalType": "ebool",
        "name": "voteType",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedVoteWeight",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "answers",
    "outputs": [
      {
        "internalType": "euint128",
        "name": "encryptedContent",
        "type": "bytes32"
      },
      {
        "internalType": "eaddress",
        "name": "encryptedAnswerer",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "answerId",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "encryptedUpvotes",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedDownvotes",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedScore",
        "type": "bytes32"
      },
      {
        "internalType": "ebool",
        "name": "isVisible",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedRandomRank",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "targetId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isQuestion",
        "type": "bool"
      },
      {
        "internalType": "externalEuint32",
        "name": "encryptedVoteType",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "voteTypeProof",
        "type": "bytes"
      },
      {
        "internalType": "externalEuint32",
        "name": "encryptedWeight",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "weightProof",
        "type": "bytes"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "encryptedActiveUsers",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "encryptedTotalAnswers",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "encryptedTotalQuestions",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "encryptedTotalVotes",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "answerId",
        "type": "uint256"
      }
    ],
    "name": "getAnswer",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint128",
            "name": "encryptedContent",
            "type": "bytes32"
          },
          {
            "internalType": "eaddress",
            "name": "encryptedAnswerer",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "questionId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "answerId",
            "type": "uint256"
          },
          {
            "internalType": "euint32",
            "name": "encryptedUpvotes",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "encryptedDownvotes",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "encryptedScore",
            "type": "bytes32"
          },
          {
            "internalType": "ebool",
            "name": "isVisible",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "encryptedRandomRank",
            "type": "bytes32"
          }
        ],
        "internalType": "struct AnonScholar.Answer",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCounters",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "currentQuestionCounter",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentAnswerCounter",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPlatformStats",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "totalQuestions",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "totalAnswers",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "totalVotes",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      }
    ],
    "name": "getQuestion",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint128",
            "name": "encryptedContent",
            "type": "bytes32"
          },
          {
            "internalType": "eaddress",
            "name": "encryptedAsker",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "euint32",
            "name": "encryptedViewCount",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "encryptedAnswerCount",
            "type": "bytes32"
          },
          {
            "internalType": "ebool",
            "name": "isActive",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "questionId",
            "type": "uint256"
          },
          {
            "internalType": "euint32",
            "name": "encryptedRandomSeed",
            "type": "bytes32"
          }
        ],
        "internalType": "struct AnonScholar.Question",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      }
    ],
    "name": "getQuestionAnswers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "name": "getRecentQuestions",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserAnswers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserQuestions",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "targetId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isQuestion",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasUserVoted",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      }
    ],
    "name": "incrementViewCount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "externalEuint128",
        "name": "encryptedContent",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "contentProof",
        "type": "bytes"
      },
      {
        "internalType": "externalEaddress",
        "name": "encryptedAnswerer",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "answererProof",
        "type": "bytes"
      }
    ],
    "name": "postAnswer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint128",
        "name": "encryptedContent",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "contentProof",
        "type": "bytes"
      },
      {
        "internalType": "externalEaddress",
        "name": "encryptedAsker",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "askerProof",
        "type": "bytes"
      }
    ],
    "name": "postQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "questionAnswerIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "questionCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "questionVotes",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "hasVoted",
        "type": "bytes32"
      },
      {
        "internalType": "ebool",
        "name": "voteType",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedVoteWeight",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "questions",
    "outputs": [
      {
        "internalType": "euint128",
        "name": "encryptedContent",
        "type": "bytes32"
      },
      {
        "internalType": "eaddress",
        "name": "encryptedAsker",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "encryptedViewCount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "encryptedAnswerCount",
        "type": "bytes32"
      },
      {
        "internalType": "ebool",
        "name": "isActive",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "encryptedRandomSeed",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userAnswerIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userQuestionIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

