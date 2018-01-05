public class SolarPanelSimulatorController {

    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
	@AuraEnabled
    public static String onButton1() {
        Tracker_Event__e evt = new Tracker_Event__e();
        evt.serial_no__c  = 'ELEVATOR-001';
        
        EventBus.publish(evt);
        
        return 'success';

    }
}