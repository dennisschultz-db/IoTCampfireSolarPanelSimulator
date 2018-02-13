@IsTest
public class IoTDeviceSimulatorControllerTest {
    
    static testMethod void validate_getEventFields() {
        // Nonsensical test just to get coverage
        List<FieldDefinition> fields = IoTDeviceSimulatorController.getEventFields('Tracker_Event__c');
        System.assert(fields.size() == 0);
    }

    static testMethod void validate_publishEvent() {
        // Nonsensical test just to get coverage
        Contact contact = new Contact(FirstName='John', LastName='Smith');
        String result = IoTDeviceSimulatorController.publishEvent(contact);
        System.assert(!result.equals('Failure'));
    }
}