# Remedyforce wipeCMDB

Small nodejs script for deleting all data in a Remedyforce CMDB.


## Dependencies
1. nodejs - [http://nodejs.org/](http://nodejs.org/)
2. node-salesforce - In a terminal window run `npm install node-salesforce`



## Running the script
Update the Setup Info in the top of the script for the desired SF Org.
```js
//// Setup info

var user = '<username@domain.com>';
var passToken = '<Password+Token>';
var url = 'https://login.salesforce.com';
```

Run script in terminal
`node wipeCMDB.js`


Note: SLM(Service Level Management) heavily relies on Business Services in the CMDB, as such this class has been excluded from the batch deletion process. Business Service CI's should be deleted manually in the CMDB to ensure no harm is done to the bound SLA's.