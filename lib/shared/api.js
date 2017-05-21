"use strict";
exports.__esModule = true;
var MessageKind;
(function (MessageKind) {
    MessageKind[MessageKind["FindRooms"] = 0] = "FindRooms";
    MessageKind[MessageKind["OpenRoom"] = 1] = "OpenRoom";
    MessageKind[MessageKind["SendMessage"] = 2] = "SendMessage";
    MessageKind[MessageKind["RoomCompletions"] = 3] = "RoomCompletions";
    MessageKind[MessageKind["ReceiveMessage"] = 4] = "ReceiveMessage";
    MessageKind[MessageKind["RoomContent"] = 5] = "RoomContent";
})(MessageKind = exports.MessageKind || (exports.MessageKind = {}));
