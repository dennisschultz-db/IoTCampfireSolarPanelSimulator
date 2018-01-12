({
    doInit: function (component, event, helper) {
        console.log('IoTDeviceSimulator:Controller: doInit');

        // Configure Cometd
        component.set('v.cometdSubscriptions', []);
        component.set('v.notifications', []);
        helper.addCometdDisconnectListener(component);
        helper.retrieveSessionId(component);

        // Derive the URL for the static resource image
        var imageName = component.get("v.imageName");
        component.set("v.imageSrc", $A.get('$Resource.' + imageName));

        // Allow the user to enter the event name without '__c', but
        // add it onto the end if it is missing
        var eventName = component.get("v.eventName");
        if (eventName == null || eventName.length == 0) { return; }
        if (!eventName.includes("__e")) {
            component.set("v.eventName", eventName + "__e");
        }

        helper.getEventFields(component, event, helper);
    },


    onCometdLoaded: function (component, event, helper) {
        console.log('onCometdLoaded');
        var cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null)
            helper.connectCometd(component);
    },


    onSendButtonClicked: function (component, event, helper) {
        console.log('onSendButtonClick');
        helper.sendEvent(component);
    }
})