let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      billnum: "cust_relatepersoncard",
      data: '[{"personType":"1","hasDefaultInit":true,"person_name":"高祥","person":"2400384087973120","dept_name":"集团数智化部","dept":"2254585992925440","org_name":"用友网络科技股份有限公司","org":"2254238652831744","person_mobile":"+86-15652647006","_id":"rowId_53","relateObjectId":"1555155104824819716","staffs":"高祥","_status":"Insert","relateObjectType":"sfa_cluecard","relateObjectName":"LADtest01"}]',
      externalData: {
        isAsync: true
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });