@isTest
public class DynamicTableControllerTest {

    
    @isTest
    public static void testfetchSObjectRecord(){
        String objName = 'Contact';
        String fieldsName = 'Name,LastName,FirstName,Phone';
        Test.startTest();
        List<Object> objRecord = DynamicTableController.fetchSObjectRecord(objName,fieldsName);  
        Test.stopTest();
    }
    
    @isTest
    public static void testfetchSObjectFieldName(){
        Test.startTest();
        List<DynamicTable__mdt> metaDataRecord = DynamicTableController.fetchSObjectFieldName();
        Test.stopTest();
    }
}