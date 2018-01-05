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
    },
    
    
    onSolarPanelAssetSelected : function(component, event, helper) {
        console.log('onSolarPanelAssetSelected');
        helper.onSolarPanelAssetSelected(component, event);
    },
    
    
    onSendButtonClicked : function(component, event, helper) {
        console.log('onButton1Click');
        helper.sendEvent(component);
    }
})