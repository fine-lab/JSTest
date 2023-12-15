let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiResponse = "";
    try {
      let iPOsID = request.iPOsID;
      let org_id = request.org_id;
      let url = "https://www.example.com/" + org_id + ""; //传参要写到这里
      let orgrsp = openLinker("GET", url, "AT1767B4C61D580001", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
      var orginfo = JSON.parse(orgrsp);
      let oc = "";
      if (orginfo.code == "200") {
        oc = orginfo.data.address;
      }
      let req = {
        iPOsID: iPOsID
      };
      let header = {
        orgcode: oc
      }; //账套号
      apiResponse = postman("post", "http://47.114.7.189:3690/LS/Serial/Bear", JSON.stringify(header), JSON.stringify(req));
      return {
        rsp: JSON.parse(apiResponse)
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.message,
          data: null,
          apiResponse
        }
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });