public class InverterSimulatorController {
    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
    @AuraEnabled
    public static String onButton1(
        String serialNumber,
        String errorCode,
        String model,
        Integer gridOutput,
        String series) {

        Inverter_Event__e evt = new Inverter_Event__e();

        if (serialNumber == null)
            return ('Error - Serial Number is required');


        if (gridOutput < 0 || gridOutput > 3000) 
            return ('Error - Power Output out of range [0:3000]');

        evt.serial_no__c  = serialNumber;
        evt.error_code__c = errorCode;
        evt.model__c = model;
        evt.grid_output__c = gridOutput;
        evt.series__c = series;
        
        Database.SaveResult sr = EventBus.publish(evt);
        
        if (sr.isSuccess()) {
            return 'Success - ' + sr.id;
        } else {
            return 'Error - ' + sr.getErrors()[0].getStatusCode() + ' - ' + sr.getErrors()[0].getMessage();
        }
        return 'success';

    }

    @AuraEnabled
    public static List<Asset> fetchSolarPanels() {
        List<Asset> solarPanels = [SELECT Id, Name, External_ID__c  FROM Asset WHERE Product_Category__c = 'Solar Panel'];
        return solarPanels;
    }
}
