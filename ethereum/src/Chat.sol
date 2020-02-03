pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

contract AnonymousChat {
    struct Message {
        uint256 dateTime;
        address senderAddress;
        string senderName;
        string text;
    }

    Message[] private messages;

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function sendMessage(string memory senderName, string memory text) public {
        Message memory message = Message({
            dateTime: block.timestamp,
            senderAddress: msg.sender,
            senderName: senderName,
            text: text
        });

        messages.push(message);
    }
}