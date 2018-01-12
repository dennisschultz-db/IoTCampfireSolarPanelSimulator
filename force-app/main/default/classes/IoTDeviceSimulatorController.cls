public class IoTDeviceSimulatorController {

    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
    @AuraEnabled
    public static List<FieldDefinition> getEventFields(String eventName) {
        System.debug('Event name ' + eventName);
        
        // Retrieve using QualifiedApiName since eventName will have the '__e' suffix.
        List<FieldDefinition> fieldList = [Select QualifiedApiName, DeveloperName, DataType, FieldDefinition.Publisher.isSalesforce From FieldDefinition where EntityDefinition.QualifiedApiName=: eventName ];
        System.debug(fieldList);
        
        List<FieldDefinition> eventFieldDefinitions = new List<FieldDefinition>();
        for(FieldDefinition item: fieldList) {
            
            // Only include custom, non-lookup fields
            if(!item.Publisher.IsSalesforce && !item.DataType.contains('Lookup')) {
                eventFieldDefinitions.add(item);
            }
        }
        
        return eventFieldDefinitions;
    }


    @AuraEnabled
    public static String publishEvent(sObject eventValue) {
     	System.debug('Publishing Event  ' + eventValue);
        List<sObject> eventList = new List<sObject>();
        eventList.add(eventValue);
        
       List<Database.SaveResult> results = EventBus.publish(eventList);
        
        // Inspect publishing results
        Boolean failure = false;
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                failure = true;
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' +  error.getStatusCode() +' - '+  error.getMessage());
                }
            }
        }

        if (failure) {
            return 'Failure';
        } else {
            return results[0].id;
        }
    }
}