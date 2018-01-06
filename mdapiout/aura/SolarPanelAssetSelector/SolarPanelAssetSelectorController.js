({
    doInit : function(component, event, helper) {
        console.log('doInit');
        
        helper.retrieveSolarPanels(component);

    },

    onSelect : function(component, event, helper) {
        helper.onSelect(component);
    }
    
})