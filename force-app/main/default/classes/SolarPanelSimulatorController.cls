public class SolarPanelSimulatorController {

    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
    @AuraEnabled
    public static String sendEvent(
        String serialNumber,
        String errorCode,
        String model,
        Integer powerOutput,
        Integer rotationX,
        Integer rotationZ,
        String series) {

        Tracker_Event__e evt = new Tracker_Event__e();

        if (serialNumber == null)
            return ('Error - Serial Number is required');


        if (powerOutput < 0 || powerOutput > 3000) 
            return ('Error - Power Output out of range [0:3000]');
        if (rotationX < 0 || rotationX > 360)
            return ('Error - Rotation X out of range [0:360]');
        if (rotationZ < 0 || rotationZ > 90)
            return ('Error - Rotation Z out of range [0:90]');

        evt.serial_no__c  = serialNumber;
        evt.error_code__c = errorCode;
        evt.model__c = model;
        evt.power_output__c = powerOutput;
        evt.rotation_x__c = rotationX;
        evt.rotation_z__c = rotationZ;
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