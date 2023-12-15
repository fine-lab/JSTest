let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = "";
    try {
      let code = param.data[0].OrderON;
      let org_id = param.data[0].org_id;
      let url = "https://www.example.com/" + org_id + ""; //传参要写到这里
      let orgrsp = openLinker("GET", url, "AT1767B4C61D580001", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
      var orginfo = JSON.parse(orgrsp);
      let oc = "";
      if (orginfo.code == "200") {
        oc = orginfo.data.address;
      }
      let req = {
        code: code
      };
      let header = {
        orgcode: oc
      }; //账套号
      apiResponse = postman("post", "http://47.114.7.189:3690/LS/PO_Pomain/Del", JSON.stringify(header), JSON.stringify(req));
      throw new Error(JSON.stringify(apiResponse));
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
    throw new Error(JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyTrigger });