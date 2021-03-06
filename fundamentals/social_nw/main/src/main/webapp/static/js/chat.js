$(document).ready(function() {
    var webSocket;
    var msg = $("#msg");
    var list = $('dl');
    var nickname = "chatuser";
    $("#send").on("click", send);
    $("#connect").on("click", openSocket);
    $("#disconnect").on("click", closeSocket);
    function openSocket() {
        // Ensures only one connection is open at a time
        if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
            writeResponse("WebSocket is already opened.");
            return;
        }
        // Create a new instance of the websocket
        webSocket = new WebSocket("ws://andrw.ru:8080/main/echo");

        /**
         * Binds functions to the listeners for the websocket.
         */
        webSocket.onopen = function (event) {
            // For reasons I can't determine, onopen gets called twice
            // and the first time event.data is undefined.
            // Leave a comment if you know the answer.
            if (event.data === undefined)
                return;

            writeResponse(event.data);
        };

        webSocket.onmessage = function (event) {
            writeResponse(event.data);
        };

        webSocket.onclose = function (event) {
            writeResponse("Connection closed");
        };
    }

    /**
     * Sends the value of the text input to the server
     */
    function send() {
        var text = msg.val().trim();
        webSocket.send(text);
        msg.val("");
        msg.focus();
    }

    function closeSocket() {
        webSocket.close();
    }

    function writeResponse(text) {
        list.append('<dt>' + nickname + ': </dt>')
            .append('<dd>' + text + '</dd>');
    }
});