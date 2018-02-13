@IsTest
public class SessionControllerTest {

    static testMethod void validate_getSessionId() {
        String sessionId = SessionController.getSessionId();
        System.assert(String.isNotBlank(sessionId));
    }

}
