({
    connectCometd: function (component) {
        var helper = this;

        // Configure CometD
        var cometdUrl = window.location.protocol + '//' + window.location.hostname + '/cometd/40.0/';
        var cometd = component.get('v.cometd');
        cometd.configure({
            url: cometdUrl,
            requestHeaders: { Authorization: 'OAuth ' + component.get('v.sessionId') },
            appendMessageTypeToURL: false
        });
        cometd.websocketEnabled = false;

        // Establish CometD connection
        console.log('Connecting to CometD: ' + cometdUrl);
        cometd.handshake(function (handshakeReply) {
            if (handshakeReply.successful) {
                console.log('Connected to CometD.');

                // Get current subscription list
                var subscriptions = component.get('v.cometdSubscriptions');

                // Get event name
                var eventName = component.get("v.eventName");

                // Subscribe to ApproachingRider (raised by Pi when picture has been taken).
                subscriptions.push(
                    cometd.subscribe(
                        '/event/' + eventName,
                        function (platformEvent) {
                            console.log('Platform event received: ' + JSON.stringify(platformEvent));
                            helper.onReceivedEvent(component, platformEvent);
                        })
                );

                // Update subscription list
                component.set('v.cometdSubscriptions', subscriptions);
            }
            else
                console.error('Failed to connected to CometD. ' + JSON.stringify(handshakeReply));
        });
    },


    addCometdDisconnectListener: function (component) {
        var helper = this;

        // Disconnect CometD when leaving page
        window.addEventListener('unload', function (event) {
            helper.disconnectCometd(component);
        });
    },


    retrieveSessionId: function (component) {
        var helper = this;

        // Retrieve session id
        var action = component.get('c.getSessionId');
        action.setCallback(this, function (response) {
            if (component.isValid() && response.getState() === 'SUCCESS') {
                component.set('v.sessionId', response.getReturnValue());
                if (component.get('v.cometd') != null)
                    helper.connectCometd(component);
            }
            else
                console.error(response);
        });
        $A.enqueueAction(action);
    },



    // Platform Event action handlers
    onReceivedEvent: function (component, platformEvent) {
        console.log('Received Platform Event');
        var helper = this;

        var currentContent = component.get("v.richText");
        // Display message in cell
        component.set(
            'v.richText',
            JSON.stringify(platformEvent.data.payload, null, '\t') + '\n\n' + currentContent);
    }



})