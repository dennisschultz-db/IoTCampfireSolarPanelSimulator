({
    doInit: function (component, event, helper) {
        console.log('IoTEventMonitor:Controller: doInit');

        // Configure Cometd
        component.set('v.cometdSubscriptions', []);
        component.set('v.notifications', []);
        helper.addCometdDisconnectListener(component);
        helper.retrieveSessionId(component);

    },


    onCometdLoaded: function (component, event, helper) {
        console.log('onCometdLoaded');
        var cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null)
            helper.connectCometd(component);
    },


})