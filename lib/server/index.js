"use strict";
exports.__esModule = true;
var WebSocket = require("ws");
var api = require("../shared/api");
var server = new WebSocket.Server({ port: 8800 });
server.on("connection", receiveConnection);
var sessions = [];
var recentMessages = new Array(2048);
var recentMessagesPointer = 0;
function receiveConnection(ws) {
    var username;
    var room;
    ws.on("message", message);
    ws.on("close", close);
    var session = { sendChatMessage: sendChatMessage };
    sessions.push(session);
    function message(data) {
        try {
            var object = JSON.parse(data);
            if (typeof object.kind !== "number")
                return;
            switch (object.kind) {
                case api.MessageKind.FindRooms:
                    findRooms(object);
                case api.MessageKind.OpenRoom:
                    openRoom(object);
                    break;
                case api.MessageKind.SendMessage:
                    chatMessage(object);
                    break;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    function close() {
        var index = sessions.indexOf(session);
        sessions.splice(index, 1);
    }
    function send(data) {
        ws.send(JSON.stringify(data));
    }
    function sendChatMessage(content) {
        if (content.room === room) {
            send({
                kind: api.MessageKind.ReceiveMessage,
                content: content
            });
        }
    }
    function chatMessage(message) {
        if (typeof message.content !== "string")
            return;
        var content = {
            room: room,
            username: username,
            content: message.content
        };
        recentMessages[recentMessagesPointer] = content;
        recentMessagesPointer++;
        if (recentMessagesPointer >= recentMessages.length) {
            recentMessagesPointer = 0;
        }
        for (var _i = 0, sessions_1 = sessions; _i < sessions_1.length; _i++) {
            var item = sessions_1[_i];
            if (session !== item)
                item.sendChatMessage(content);
        }
    }
    function openRoom(message) {
        if (typeof message.username !== "string" || typeof message.room !== "string")
            return;
        username = message.username;
        room = message.room;
        function check(item) {
            if (!item)
                return false;
            return item.room === room;
        }
        var messages = recentMessages.slice(recentMessagesPointer).filter(check).concat(recentMessages.slice(0, recentMessagesPointer).filter(check));
        send({
            kind: api.MessageKind.RoomContent,
            room: room,
            messages: messages
        });
    }
    function findRooms(message) {
        var query = message.query;
        if (typeof query !== "string")
            return;
        var rooms = recentMessages
            .map(function (msg) { return msg.room; })
            .filter(function (room) { return room.toLowerCase().indexOf(query.toLowerCase()) !== -1; })
            .sort();
        var completions = [];
        var previous = undefined;
        for (var _i = 0, rooms_1 = rooms; _i < rooms_1.length; _i++) {
            var room_1 = rooms_1[_i];
            if (previous !== room_1) {
                completions.push(room_1);
                previous = room_1;
            }
        }
        send({
            kind: api.MessageKind.RoomCompletions,
            completions: completions
        });
    }
}
