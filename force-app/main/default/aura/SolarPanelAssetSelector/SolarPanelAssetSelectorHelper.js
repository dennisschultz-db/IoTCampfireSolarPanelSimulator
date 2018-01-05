({
    retrieveSolarPanels : function(component) {
        var action = component.get("c.fetchSolarPanels");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var solarPanels = response.getReturnValue();
                component.set("v.solarPanels", solarPanels);
            } else {
                console.log("!!! Error fetchSolarPanels");
            }
        });
        
        $A.enqueueAction(action);  
    },

    onSelect: function(component) {
        var helper = this;
        
        var serial_number = component.find('solarPanelSelect').get("v.value");
        console.log("onButtonClick serial number = " + serial_number);        
        if (serial_number == "") {
            helper.showToast("error", "Missing data", "Please select a serial number");
            return;
        }

        var appEvent = $A.get("e.c:SolarPanelAssetSelected");
        console.log("appEvent is " + appEvent);
        appEvent.setParams({ "SerialNumber" : serial_number });
        appEvent.fire();
    },
    
    
    showToast : function(type, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message": message
        });
        toastEvent.fire();
    }

})