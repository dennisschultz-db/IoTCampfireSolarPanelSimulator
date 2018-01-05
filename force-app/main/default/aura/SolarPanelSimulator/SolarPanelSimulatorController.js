({
    onCometdLoaded : function(component, event, helper) {
        console.log('onCometdLoaded');
        var cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null)
            helper.connectCometd(component);
    },
    

    doInit : function(component, event, helper) {
        console.log('doInit');
        
        component.set('v.cometdSubscriptions', []);
        component.set('v.notifications', []);

        helper.addCometdDisconnectListener(component);
        
        helper.retrieveSessionId(component);

        helper.retrieveSolarPanels(component);

    },
    
    
    onButton1Click : function(component, event, helper) {
        console.log('onButton1Click');
        helper.onButton1Click(component);
    }
})