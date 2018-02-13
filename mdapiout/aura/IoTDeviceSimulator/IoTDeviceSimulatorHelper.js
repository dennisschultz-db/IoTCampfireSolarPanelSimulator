({
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
                var fieldDefinitions = a.getReturnValue();
                console.log('fieldDefinitions are ' + JSON.stringify(fieldDefinitions));

                // Reorder to put the deviceKey first
                var deviceKey = component.get("v.deviceId");
                var localFieldDefinitions = [];
                for (var i = 0; i < fieldDefinitions.length; i++) {
                    if (fieldDefinitions[i].QualifiedApiName == deviceKey) {
                        localFieldDefinitions.unshift(fieldDefinitions[i]);
                    } else {
                        localFieldDefinitions.push(fieldDefinitions[i]);
                    }
                }
                component.set("v.objectFields", localFieldDefinitions);

            } else if (a.getState() === "ERROR") {
                console.log("Loading Event Object Fields Failed! ");
                //  console.log(a.getError());
                $A.log("Errors", a.getError());
                helper.displayToast("error", "Error", "Loading Event Object Fields Failed! " + a.getError());
            }
        });

        $A.enqueueAction(action);


    },


    sendEvent: function (component) {
        console.log("sendEvent");

        var helper = this;

        var spinner = component.find("eventSpinner");
        $A.util.toggleClass(spinner, "slds-show");

        var globalId = component.getGlobalId();
        var eventName = component.get("v.eventName");
        var deviceId = component.get("v.deviceId");
        var deviceIdValue = document.getElementById(globalId + deviceId).value;
        var objectFields = component.get("v.objectFields");
        var fieldValue = null;

        // The deviceId is required.
        console.log("sendEvent serial number = " + deviceIdValue);
        if (deviceIdValue == "") {
            $A.util.toggleClass(spinner, "slds-show");
            helper.showToast("error", "Missing data", "Please enter " + deviceId);
            return;
        }

        /***** Generate Platform Event ********/
        // GlobalId is required to differentiate between similarly named fields on multiple
        // simulators on the same App Page
        var eventMsg = "{\"sobjectType\":\"" + eventName + "\",\"" + deviceId + "\":\"" + deviceIdValue + "\"";
        for (var i = 0; i < objectFields.length; i++) {
            fieldValue = document.getElementById(globalId + objectFields[i].QualifiedApiName).value;
            // Ignore fields that no value was entered into
            if (fieldValue) {
                if (objectFields[i].DataType.startsWith('Number') && isNaN(fieldValue)) {
                    $A.util.toggleClass(spinner, "slds-show");
                    helper.showToast("error", "Incorrect data type", objectFields[i].QualifiedApiName + " is a Number field, but '" + fieldValue + "' is not a number");
                    return;
                }
                eventMsg = eventMsg + ",\"" + objectFields[i].QualifiedApiName + "\": \"" + fieldValue + "\"";
            }
        }
        eventMsg = eventMsg + "}";

        console.log("Sending Event to IOT cloud");
        console.log(eventMsg);

        var action = component.get("c.publishEvent");
        action.setParams({
            eventValue: eventMsg
        });

        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                $A.util.toggleClass(spinner, "slds-show");
                console.log("Sending IOT Event Success! ");
                helper.showToast(
                    "success",
                    "Event published",
                    "Tracker Event " + response.getReturnValue());

            } else if (response.getState() === "ERROR") {
                console.log("Sending IOT Event Failed! ");
                console.log(response.getError());
                //$A.log("Errors", a.getError());
                $A.util.toggleClass(spinner, "slds-show");
                helper.showToast(
                    "error",
                    "Unable to send event",
                    "Sending IOT Event Failed! " + JSON.stringify(response.getError()));
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