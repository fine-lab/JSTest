let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let baseurl = "https://www.example.com/";
    let url = baseurl + request.uri;
    let body = request.body; //请求参数
    if (request.parm !== undefined) {
      let parms = request.parm;
      let n = 0;
      for (let key in parms) {
        let value = parms[key];
        if (n === 0) {
          url += "?" + key + "=" + value;
        } else {
          url += "&" + key + "=" + value;
        }
        n++;
      }
    }
    let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });