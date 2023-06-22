import { LightningElement, wire } from 'lwc';
import fetchSObjectRecord from '@salesforce/apex/DynamicTableController.fetchSObjectRecord';
import fetchSObjectFieldName from '@salesforce/apex/DynamicTableController.fetchSObjectFieldName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class DynamicTable extends LightningElement {

    errorMessage;
    recordId;
    columns=[]
    saveDraftValues = [];
    objName;
    fieldValues;
    data;

    @wire(fetchSObjectFieldName)
    wiredField({data, erorr}){
        if(data){
            data.forEach(element => {
                this.objName = element.Object_Type__c;
                this.fieldValues = element.Query__c;
                let fldName;
                fldName = this.fieldValues.split(',');
                fldName.forEach(element => {
                    if(element === "Name"){
                        let elementValue = {label: element, fieldName: 'recordNameUrl', type: 'url', typeAttributes: {label: {fieldName : 'Name'}, target: '_self'}};
                        this.columns = [...this.columns, elementValue];
                    }
                    else{
                        let elementValue1 = {label: element, fieldName: element, editable: true};
                        this.columns = [...this.columns, elementValue1];
                    }
                });

            });
        }
        else if(erorr){
        }
    }

    /**
     * 
     * @param {objectName} give the sobject name 
     * @param {fields} give the sobject related field name to display in table 
     */

    @wire(fetchSObjectRecord, {objectName: '$objName', fields: '$fieldValues'})
    wiredRecord(result) {
        if (result.data) {
            let orignalData = [];
            result.data.forEach((ele) => {
                let tempData = Object.assign({}, ele);
                tempData.recordNameUrl = '/' + tempData.Id;
                orignalData.push(tempData);
            })
            this.data = orignalData;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    /**
     * handleSave method for saving the particular record
     */

    handleSave(event){
        this.saveDraftValues = event.detail.draftValues;
        const inputsItems = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            return refreshApex(this.mainresult);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }
}