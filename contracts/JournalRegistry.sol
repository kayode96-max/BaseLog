// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title JournalRegistry
 * @dev A simple on-chain registry that links transaction hashes to IPFS content identifiers (CIDs).
 * This contract acts as a "filing cabinet" for BaseLog - storing references to journal entries.
 * No tokenomics, just pure utility for on-chain memory.
 */
contract JournalRegistry {
    /// @notice Struct representing a journal entry
    struct Entry {
        string ipfsCid;      // IPFS content identifier for the journal data
        uint256 timestamp;   // When the entry was created
        address owner;       // Who created the entry
    }

    /// @notice Mapping: user address => transaction hash => journal entry
    mapping(address => mapping(bytes32 => Entry)) public entries;

    /// @notice Emitted when a journal entry is created or updated
    event EntryUpdated(
        address indexed user,
        bytes32 indexed txHash,
        string cid,
        uint256 timestamp
    );

    /**
     * @notice Create or update a journal entry for a specific transaction
     * @param txHash The transaction hash being documented
     * @param _cid The IPFS CID containing the journal entry metadata
     */
    function logEntry(bytes32 txHash, string memory _cid) external {
        require(bytes(_cid).length > 0, "CID cannot be empty");
        
        entries[msg.sender][txHash] = Entry({
            ipfsCid: _cid,
            timestamp: block.timestamp,
            owner: msg.sender
        });

        emit EntryUpdated(msg.sender, txHash, _cid, block.timestamp);
    }

    /**
     * @notice Retrieve a journal entry for a specific user and transaction
     * @param user The address of the user
     * @param txHash The transaction hash
     * @return The Entry struct containing IPFS CID, timestamp, and owner
     */
    function getEntry(address user, bytes32 txHash) 
        external 
        view 
        returns (Entry memory) 
    {
        return entries[user][txHash];
    }

    /**
     * @notice Check if a journal entry exists for a transaction
     * @param user The address of the user
     * @param txHash The transaction hash
     * @return True if an entry exists (has a non-empty CID)
     */
    function hasEntry(address user, bytes32 txHash) 
        external 
        view 
        returns (bool) 
    {
        return bytes(entries[user][txHash].ipfsCid).length > 0;
    }
}
