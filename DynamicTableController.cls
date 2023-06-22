/**
* Api Version 57.0
* Author Shivam Barya
* fetchSObjectRecord function to fetch the respective object record
* fetchSObjectFieldName function to fetch the custom metadata record
* Date 15 June 2023
*/

public with sharing class DynamicTableController {
    @AuraEnabled(cacheable=true)
    public static List<Object> fetchSObjectRecord(String objectName, String fields){
        String queryStr = 'SELECT '+ fields + ' FROM ' + objectName + ' LIMIT 10';
        List<Object> sobjList = Database.query(queryStr);
        return sobjList;
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<DynamicTable__mdt> fetchSObjectFieldName(){
        List<DynamicTable__mdt> queryValues = [SELECT Id,Object_Type__c,Query__c FROM DynamicTable__mdt];
        return queryValues;
    }
}