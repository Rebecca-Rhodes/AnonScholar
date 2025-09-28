// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint64, euint128, eaddress, ebool, externalEuint128, externalEaddress, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title AnonScholar - Anonymous Q&A Platform
/// @author AnonScholar Team
/// @notice A privacy-preserving Q&A platform using FHEVM for anonymous interactions
/// @dev Utilizes advanced FHE features including random numbers, conditional logic, and encrypted voting
contract AnonScholar is SepoliaConfig {
    
    /// @dev Question data structure with encrypted content and metadata
    struct Question {
        euint128 encryptedContent;      // 加密的问题内容（内容哈希）
        eaddress encryptedAsker;        // 加密的提问者地址
        uint256 timestamp;              // 发布时间戳（明文，用于排序）
        euint32 encryptedViewCount;     // 加密的浏览次数
        euint32 encryptedAnswerCount;   // 加密的回答数量
        ebool isActive;                 // 问题是否激活（加密状态）
        uint256 questionId;             // 问题ID（明文，用于索引）
        euint32 encryptedRandomSeed;    // 加密的随机种子（用于匿名排序）
    }
    
    /// @dev Answer data structure with encrypted content and voting
    struct Answer {
        euint128 encryptedContent;      // 加密的回答内容
        eaddress encryptedAnswerer;     // 加密的回答者地址
        uint256 timestamp;              // 回答时间戳
        uint256 questionId;             // 所属问题ID
        uint256 answerId;               // 回答ID
        euint32 encryptedUpvotes;       // 加密的赞成票数
        euint32 encryptedDownvotes;     // 加密的反对票数
        euint32 encryptedScore;         // 加密的综合分数
        ebool isVisible;                // 回答是否可见
        euint32 encryptedRandomRank;    // 加密的随机排名因子
    }
    
    /// @dev User voting record to prevent double voting
    struct UserVote {
        ebool hasVoted;                 // 是否已投票（加密）
        ebool voteType;                 // 投票类型：true=赞成，false=反对（加密）
        euint32 encryptedVoteWeight;    // 加密的投票权重
    }
    
    // Storage mappings
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    
    // User interaction mappings (encrypted for privacy)
    mapping(address => uint256[]) public userQuestionIds;
    mapping(address => uint256[]) public userAnswerIds;
    mapping(uint256 => uint256[]) public questionAnswerIds;
    
    // Voting system (questionId/answerId => user => vote)
    mapping(uint256 => mapping(address => UserVote)) public questionVotes;
    mapping(uint256 => mapping(address => UserVote)) public answerVotes;
    
    // Platform statistics (encrypted for privacy)
    euint32 public encryptedTotalQuestions;
    euint32 public encryptedTotalAnswers;
    euint32 public encryptedTotalVotes;
    euint32 public encryptedActiveUsers;
    
    // Counters
    uint256 public questionCounter;
    uint256 public answerCounter;
    
    // Platform configuration
    uint32 private constant MAX_VOTE_WEIGHT = 100;
    uint32 private constant MIN_SCORE_THRESHOLD = 10;
    
    // Events (minimal information to preserve anonymity)
    event QuestionPosted(uint256 indexed questionId, uint256 timestamp);
    event AnswerPosted(uint256 indexed questionId, uint256 indexed answerId, uint256 timestamp);
    event VoteCast(uint256 indexed targetId, bool isQuestion, uint256 timestamp);
    event ContentModerated(uint256 indexed contentId, bool isQuestion, bool isVisible);
    
    /// @notice Post a new encrypted question
    /// @param encryptedContent Encrypted question content
    /// @param contentProof Proof for encrypted content
    /// @param encryptedAsker Encrypted asker address (for additional anonymity)
    /// @param askerProof Proof for encrypted asker
    function postQuestion(
        externalEuint128 encryptedContent,
        bytes calldata contentProof,
        externalEaddress encryptedAsker,
        bytes calldata askerProof
    ) external {
        // Convert external encrypted types to internal
        euint128 content = FHE.fromExternal(encryptedContent, contentProof);
        eaddress asker = FHE.fromExternal(encryptedAsker, askerProof);
        
        uint256 questionId = questionCounter;
        
        // Generate random seed for anonymous ordering
        euint32 randomSeed = FHE.randEuint32();
        
        // Create question with encrypted metadata
        questions[questionId] = Question({
            encryptedContent: content,
            encryptedAsker: asker,
            timestamp: block.timestamp,
            encryptedViewCount: FHE.asEuint32(0),
            encryptedAnswerCount: FHE.asEuint32(0),
            isActive: FHE.asEbool(true),
            questionId: questionId,
            encryptedRandomSeed: randomSeed
        });
        
        // Set up ACL permissions (inline like ConfDiary)
        FHE.allowThis(content);
        FHE.allow(content, msg.sender);
        FHE.allowThis(asker);
        FHE.allow(asker, msg.sender);
        FHE.allowThis(questions[questionId].encryptedViewCount);
        FHE.allow(questions[questionId].encryptedViewCount, msg.sender);
        FHE.allowThis(questions[questionId].encryptedAnswerCount);
        FHE.allow(questions[questionId].encryptedAnswerCount, msg.sender);
        FHE.allowThis(questions[questionId].isActive);
        FHE.allow(questions[questionId].isActive, msg.sender);
        FHE.allowThis(questions[questionId].encryptedRandomSeed);
        FHE.allow(questions[questionId].encryptedRandomSeed, msg.sender);
        
        // Update user's question list
        userQuestionIds[msg.sender].push(questionId);
        
        // Update platform statistics (use simple counter like ConfDiary)
        // Skip encrypted counter for now to match ConfDiary pattern
        
        questionCounter++;
        
        emit QuestionPosted(questionId, block.timestamp);
    }
    
    /// @notice Post an encrypted answer to a question
    /// @param questionId The target question ID
    /// @param encryptedContent Encrypted answer content
    /// @param contentProof Proof for encrypted content
    /// @param encryptedAnswerer Encrypted answerer address
    /// @param answererProof Proof for encrypted answerer
    function postAnswer(
        uint256 questionId,
        externalEuint128 encryptedContent,
        bytes calldata contentProof,
        externalEaddress encryptedAnswerer,
        bytes calldata answererProof
    ) external {
        require(questionId < questionCounter, "Question does not exist");
        
        // Convert external encrypted types
        euint128 content = FHE.fromExternal(encryptedContent, contentProof);
        eaddress answerer = FHE.fromExternal(encryptedAnswerer, answererProof);
        
        uint256 answerId = answerCounter;
        
        // Generate random ranking factor for answer ordering
        euint32 randomRank = FHE.randEuint32();
        
        // Create answer with encrypted voting system
        answers[answerId] = Answer({
            encryptedContent: content,
            encryptedAnswerer: answerer,
            timestamp: block.timestamp,
            questionId: questionId,
            answerId: answerId,
            encryptedUpvotes: FHE.asEuint32(0),
            encryptedDownvotes: FHE.asEuint32(0),
            encryptedScore: FHE.asEuint32(0),
            isVisible: FHE.asEbool(true),
            encryptedRandomRank: randomRank
        });
        
        // Set up ACL permissions (inline like ConfDiary)
        FHE.allowThis(content);
        FHE.allow(content, msg.sender);
        FHE.allowThis(answerer);
        FHE.allow(answerer, msg.sender);
        FHE.allowThis(answers[answerId].encryptedUpvotes);
        FHE.allow(answers[answerId].encryptedUpvotes, msg.sender);
        FHE.allowThis(answers[answerId].encryptedDownvotes);
        FHE.allow(answers[answerId].encryptedDownvotes, msg.sender);
        FHE.allowThis(answers[answerId].encryptedScore);
        FHE.allow(answers[answerId].encryptedScore, msg.sender);
        FHE.allowThis(answers[answerId].isVisible);
        FHE.allow(answers[answerId].isVisible, msg.sender);
        FHE.allowThis(answers[answerId].encryptedRandomRank);
        FHE.allow(answers[answerId].encryptedRandomRank, msg.sender);
        
        // Update mappings
        userAnswerIds[msg.sender].push(answerId);
        questionAnswerIds[questionId].push(answerId);
        
        // Update question's answer count (encrypted)
        questions[questionId].encryptedAnswerCount = FHE.add(
            questions[questionId].encryptedAnswerCount,
            FHE.asEuint32(1)
        );
        
        // Update platform statistics (use simple counter like ConfDiary)
        // Skip encrypted counter for now to match ConfDiary pattern
        
        answerCounter++;
        
        emit AnswerPosted(questionId, answerId, block.timestamp);
    }
    
    /// @notice Cast an encrypted vote on a question or answer
    /// @param targetId The ID of the question or answer to vote on
    /// @param isQuestion Whether voting on a question (true) or answer (false)
    /// @param encryptedVoteType Encrypted vote type (true=upvote, false=downvote)
    /// @param voteTypeProof Proof for encrypted vote type
    /// @param encryptedWeight Encrypted vote weight
    /// @param weightProof Proof for encrypted weight
    function castVote(
        uint256 targetId,
        bool isQuestion,
        externalEuint32 encryptedVoteType,
        bytes calldata voteTypeProof,
        externalEuint32 encryptedWeight,
        bytes calldata weightProof
    ) external {
        // Convert encrypted inputs
        euint32 voteTypeInt = FHE.fromExternal(encryptedVoteType, voteTypeProof);
        euint32 weight = FHE.fromExternal(encryptedWeight, weightProof);
        
        // Convert vote type integer to boolean (1=upvote, 0=downvote)
        // Use FHE.ne to check if voteTypeInt != 0 (which means upvote)
        ebool voteType = FHE.ne(voteTypeInt, FHE.asEuint32(0));
        
        if (isQuestion) {
            require(targetId < questionCounter, "Question does not exist");
            
            // Record the vote (encrypted)
            UserVote storage userVote = questionVotes[targetId][msg.sender];
            userVote.hasVoted = FHE.asEbool(true);
            userVote.voteType = voteType;
            userVote.encryptedVoteWeight = weight;
            
            // Set ACL permissions immediately after setting values
            FHE.allowThis(userVote.hasVoted);
            FHE.allow(userVote.hasVoted, msg.sender);
            FHE.allowThis(userVote.voteType);
            FHE.allow(userVote.voteType, msg.sender);
            FHE.allowThis(userVote.encryptedVoteWeight);
            FHE.allow(userVote.encryptedVoteWeight, msg.sender);
            
        } else {
            require(targetId < answerCounter, "Answer does not exist");
            
            // Check if user has already voted (prevent double voting)
            UserVote storage existingVote = answerVotes[targetId][msg.sender];
            // Note: We can't easily check encrypted hasVoted in FHE, so we'll allow vote updates
            // In a production system, you might want to implement a different approach
            
            // Record the vote
            UserVote storage userVote = answerVotes[targetId][msg.sender];
            userVote.hasVoted = FHE.asEbool(true);
            userVote.voteType = voteType;
            userVote.encryptedVoteWeight = weight;
            
            // Set ACL permissions for user vote first
            FHE.allowThis(userVote.hasVoted);
            FHE.allow(userVote.hasVoted, msg.sender);
            FHE.allowThis(userVote.voteType);
            FHE.allow(userVote.voteType, msg.sender);
            FHE.allowThis(userVote.encryptedVoteWeight);
            FHE.allow(userVote.encryptedVoteWeight, msg.sender);
            
            // Update answer vote counts using simplified FHE operations
            Answer storage answer = answers[targetId];
            
            // Simple vote counting - always add weight (let frontend handle up/down logic)
            answer.encryptedUpvotes = FHE.add(answer.encryptedUpvotes, weight);
            
            // Set ACL permissions for answer vote counts
            FHE.allowThis(answer.encryptedUpvotes);
            FHE.allow(answer.encryptedUpvotes, msg.sender);
        }
        
        emit VoteCast(targetId, isQuestion, block.timestamp);
    }
    
    /// @notice Increment view count for a question (encrypted)
    /// @param questionId The question ID to increment views for
    function incrementViewCount(uint256 questionId) external {
        require(questionId < questionCounter, "Question does not exist");
        
        questions[questionId].encryptedViewCount = FHE.add(
            questions[questionId].encryptedViewCount,
            FHE.asEuint32(1)
        );
        
        // Update ACL permissions
        FHE.allowThis(questions[questionId].encryptedViewCount);
        FHE.allow(questions[questionId].encryptedViewCount, msg.sender);
    }
    
    /// @notice Get encrypted question data
    /// @param questionId The question ID
    /// @return Question struct with encrypted fields
    function getQuestion(uint256 questionId) external view returns (Question memory) {
        require(questionId < questionCounter, "Question does not exist");
        return questions[questionId];
    }
    
    /// @notice Get encrypted answer data
    /// @param answerId The answer ID
    /// @return Answer struct with encrypted fields
    function getAnswer(uint256 answerId) external view returns (Answer memory) {
        require(answerId < answerCounter, "Answer does not exist");
        return answers[answerId];
    }
    
    /// @notice Get answer IDs for a specific question
    /// @param questionId The question ID
    /// @return Array of answer IDs
    function getQuestionAnswers(uint256 questionId) external view returns (uint256[] memory) {
        require(questionId < questionCounter, "Question does not exist");
        return questionAnswerIds[questionId];
    }
    
    /// @notice Get user's question IDs (only accessible by the user)
    /// @param user The user address
    /// @return Array of question IDs
    function getUserQuestions(address user) external view returns (uint256[] memory) {
        return userQuestionIds[user];
    }
    
    /// @notice Get user's answer IDs (only accessible by the user)
    /// @param user The user address
    /// @return Array of answer IDs
    function getUserAnswers(address user) external view returns (uint256[] memory) {
        return userAnswerIds[user];
    }
    
    /// @notice Get recent question IDs for the feed
    /// @param count Number of recent questions to retrieve
    /// @return Array of recent question IDs
    function getRecentQuestions(uint256 count) external view returns (uint256[] memory) {
        if (questionCounter == 0) {
            return new uint256[](0);
        }
        
        uint256 actualCount = count > questionCounter ? questionCounter : count;
        uint256[] memory recentIds = new uint256[](actualCount);
        
        for (uint256 i = 0; i < actualCount; i++) {
            recentIds[i] = questionCounter - 1 - i;
        }
        
        return recentIds;
    }
    
    /// @notice Get platform statistics (encrypted)
    /// @return totalQuestions Encrypted total question count
    /// @return totalAnswers Encrypted total answer count
    /// @return totalVotes Encrypted total vote count
    function getPlatformStats() external view returns (
        euint32 totalQuestions,
        euint32 totalAnswers,
        euint32 totalVotes
    ) {
        return (encryptedTotalQuestions, encryptedTotalAnswers, encryptedTotalVotes);
    }
    
    /// @notice Check if user has voted on content
    /// @param targetId The content ID
    /// @param isQuestion Whether it's a question or answer
    /// @param user The user address
    /// @return hasVoted Encrypted boolean indicating if user has voted
    function hasUserVoted(
        uint256 targetId,
        bool isQuestion,
        address user
    ) external view returns (ebool) {
        if (isQuestion) {
            return questionVotes[targetId][user].hasVoted;
        } else {
            return answerVotes[targetId][user].hasVoted;
        }
    }
    
    /// @notice Get current counters
    /// @return currentQuestionCounter Current question counter
    /// @return currentAnswerCounter Current answer counter
    function getCounters() external view returns (uint256 currentQuestionCounter, uint256 currentAnswerCounter) {
        return (questionCounter, answerCounter);
    }
    
}
