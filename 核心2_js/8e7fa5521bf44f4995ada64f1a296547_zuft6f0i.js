let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiResponse = "";
    try {
      let req = request.req;
      let org_id = request.org_id;
      console.log("请求参数= " + req);
      console.log("org_id= " + org_id);
      let url = "https://www.example.com/" + org_id + ""; //传参要写到这里
      let orgrsp = openLinker("GET", url, "AT1767B4C61D580001", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
      var orginfo = JSON.parse(orgrsp);
      let oc = "";
      if (orginfo.code == "200") {
        oc = orginfo.data.address;
      }
      let header = {
        orgcode: oc
      }; //账套号
      apiResponse = postman("post", "http://47.114.7.189:3690/LS/PO_Pomain/add", JSON.stringify(header), req);
      console.log("响应参数= " + apiResponse);
      return {
        rsp: JSON.parse(apiResponse)
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.toString() + "异常",
          data: null,
          apiResponse
        }
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});