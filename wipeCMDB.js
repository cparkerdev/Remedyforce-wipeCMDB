////  wipeCMDB - Delete all CI's in a Remedyforce CMDB(except Business Services)
////  Collin Parker 
////  RightStar Systems



// Setup info

var user = '<username@domain.com>';
var passToken = '<Password+Token>';
var url = 'https://login.salesforce.com';
//var url = https://test.salesforce.com;

// Setup info







var sf = require('node-salesforce');

var conn = new sf.Connection({
  'loginUrl' : url
});


conn.login(user, passToken, function(err, userInfo) {
  if (err) { return console.error(err); }

console.log("UserName: " + user);
console.log("URL: "+ url);
console.log("Org ID: " + userInfo.organizationId);

process.stdout.write('Are you sure you want to delete all data in the CMDB?[Y]');

var stdin = process.openStdin();
stdin.on('data', function(userin) { 

  var uStr = userin.toString();
  console.log(uStr.trim());
  if (uStr.trim() !== 'Y') { console.log('User Cancelled!'); process.exit(0); }


var instIds = [];
conn.query("SELECT Id, BMCServiceDesk__InstanceID__c, BMCServiceDesk__ClassName__c FROM BMCServiceDesk__BMC_BaseElement__c where BMCServiceDesk__ClassName__c != 'BMC_BusinessService'")
  .on("record", function(record) {
    instIds.push(record.BMCServiceDesk__InstanceID__c);
  })
  .on("end", function(query) {
    console.log("CIs to delete "+query.totalFetched);
    
    if (instIds.length > 0) {
      deleteInstances(conn, instIds);
    } else {
      console.log('No data to delete');
      process.exit(0);
    }

  })
  .on("error", function(err) {
    console.error(err);
  })
  .run({ autoFetch : true });

  });


});



function deleteInstances(conn, instIds) {

var funcs = [];

conn.query("SELECT Id, BMCServiceDesk__ClassName__c FROM BMCServiceDesk__CMDB_Class__c where BMCServiceDesk__ClassName__c != 'BMC_BusinessService'")
  .on("record", function(record) {
    console.log('Executing Batch Delete.....');
    batchDelete(conn,'BMCServiceDesk__'+record.BMCServiceDesk__ClassName__c+'__c', instIds );
  })
  .on("end", function(query) {
    console.log("total in database : " + query.totalSize);
    console.log("total fetched : " + query.totalFetched); 
  })
  .on("error", function(err) {
    console.error(err);
  })
  .run({ autoFetch : true });

}


function batchDelete ( conn, objName, instIds ) {

var obj = conn.sobject(objName);
  obj.find({BMCServiceDesk__InstanceID__c: { $in: instIds} })
       .pipe(obj.deleteBulk())
       .on('response', function(rets){
          console.log(objName+':'+JSON.stringify(rets));
       })
       .on('error', function(err) {
             
          if (err.message != 'Unable to find any data to create batch') {
            console.log('ERROR:'+objName+':'+JSON.stringify(err));
          } else {
            console.log(objName+' has no records');
          }
  });
  
}