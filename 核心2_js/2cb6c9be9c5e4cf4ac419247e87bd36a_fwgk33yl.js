let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/" + param.variablesMap.dept;
    let apiResponse = openLinker("GET", url, "CUST", null);
    const deptCode = JSON.parse(apiResponse).data.code;
    return deptCode;
  }
}
exports({ entryPoint: MyTrigger });