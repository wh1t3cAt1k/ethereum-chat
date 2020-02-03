pragma solidity ^0.6.2;

contract AnonymousChat {
    struct Message {
        uint256 dateTime;
        address senderAddress;
        string senderName;
        string text;
    }

    Message[] public messages;

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