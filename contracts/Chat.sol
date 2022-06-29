pragma solidity >=0.7.0 <0.9.0;

contract Chat {

    struct Message {
        string from;
        string to;
        string message;
    }

    // the list of old messages in the chat
    Message[] public messagesList;

    function sendMessage(string memory _text, string memory _from, string memory _to) public {
        // loads the message into the list.
        messagesList.push(Message(
            _from,
            _to,
            _text
        ));
    }

    function getOneMessage(uint index) public view returns (Message memory){
        return messagesList[index];
    }

    function listMessages(string memory _user) public view returns (Message[] memory) {
        uint counter = 0;
        Message[] memory listedMessages = new Message[](messagesList.length);
        
        for (uint i = 0; i < messagesList.length; i++) {
            if(keccak256(abi.encodePacked(messagesList[i].to)) == keccak256(abi.encodePacked(_user))) {
                listedMessages[counter] = messagesList[i];
                counter++;
            }

            if(keccak256(abi.encodePacked(messagesList[i].from)) == keccak256(abi.encodePacked(_user))) {
                listedMessages[counter] = messagesList[i];
                counter++;
            }
        }
        return listedMessages;
    }
}
