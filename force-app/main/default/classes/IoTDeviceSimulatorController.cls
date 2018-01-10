public class IoTDeviceSimulatorController {

    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
    @AuraEnabled
    public static List<String> getEventFields(String eventName) {
        System.debug('Event name ' + eventName);
        eventName = eventName.left(eventName.length()-3);
     
        
        List<FieldDefinition> fieldList = [Select DeveloperName, DataType, FieldDefinition.Publisher.isSalesforce From FieldDefinition where EntityDefinition.DeveloperName=: eventName ];
        System.debug(fieldList);
        
        List<String> fieldNames = new List<String>();
        for(FieldDefinition item: fieldList) {
            String name = item.DeveloperName ;
            Boolean isSalesforce =  item.Publisher.IsSalesforce;
            
            if(!isSalesforce && !item.DataType.contains('Lookup')) {
                fieldNames.add(name);
            }
        }
        
        return fieldNames;
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