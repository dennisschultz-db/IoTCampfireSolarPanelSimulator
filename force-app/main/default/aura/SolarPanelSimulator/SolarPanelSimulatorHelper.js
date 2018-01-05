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


    getEventFields: function (component, event, helper) {
        console.log("- Init loading IoT Event object fields");

        var action = component.get("c.getEventFields");
        action.setParams({
            eventName: component.get("v.eventName")
        });

        action.setCallback(this, function (a) {
            if (a.getState() === "SUCCESS") {
                console.log("Loaded Event Object Fields");
                //console.log(a.getReturnValue());
                var fieldsNames = a.getReturnValue();

                // Remove the deviceKey from the list of fields returned
                var deviceKey = component.get("v.deviceId");
                var index = fieldsNames.indexOf(deviceKey.substring(0, deviceKey.length - 3));
                //console.log(index);
                if (index > -1) {
                    fieldsNames.splice(index, 1);
                }

                component.set("v.objectFields", fieldsNames);

            } else if (a.getState() === "ERROR") {
                console.log("Loading Event Object Fields Failed! ");
                //  console.log(a.getError());
                $A.log("Errors", a.getError());
                helper.displayToast("error", "Error", "Loading Event Object Fields Failed! " + a.getError());
            }
        });

        $A.enqueueAction(action);


    },


    onSolarPanelAssetSelected: function (component, event) {
        var serial_number = event.getParam("SerialNumber");
        console.log("Serial Number is " + serial_number);

        component.set("v.serialNumber", serial_number);
    },

    sendEvent: function (component) {
        var helper = this;

        var serial_number = component.get("v.serialNumber");
        console.log("onButtonClick serial number = " + serial_number);
        if (serial_number == "") {
            helper.showToast("error", "Missing data", "Please select a serial number");
            return;
        }

        var action = component.get("c.sendEvent");
        action.setParams({
            serialNumber: serial_number,
            errorCode: component.find('errorCode').get("v.value"),
            model: component.find('model').get("v.value"),
            powerOutput: component.find('powerOutput').get("v.value"),
            rotationX: component.find('rotationX').get("v.value"),
            rotationZ: component.find('rotationZ').get("v.value"),
            series: component.find('series').get("v.value")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var responseVal = response.getReturnValue();
                console.log("onButton1 response is " + responseVal);
                if (responseVal.startsWith("Success")) {
                    helper.showToast(
                        "success",
                        "Event posted",
                        "Tracker Event " + responseVal);
                } else {
                    helper.showToast(
                        "error",
                        "Event not posted",
                        "Tracker Event " + responseVal);
                }
            } else {
                console.log("!!! Error onButton1");
            }
        });

        $A.enqueueAction(action);

    },


    showToast: function (type, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message": message
        });
        toastEvent.fire();
    }
})