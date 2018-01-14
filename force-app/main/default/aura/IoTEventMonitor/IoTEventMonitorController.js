({
    // Platform Event action handlers
    onReceivedEvent: function (component, event, helper) {
        console.log('Received Platform Event ' + JSON.stringify(event));
        var payload = event.getParam("payload");
        var currentContent = component.get("v.richText");
        // Display message in cell
        component.set(
            'v.richText',
            JSON.stringify(payload, null, '\t') + '\n\n' + currentContent);
    }
})