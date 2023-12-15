let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let Depcode = request.Depcode; //部门编码
      let url = "https://www.example.com/";
      let body = {
        data: {
          code: [Depcode]
        }
      };
      let apiResponse = openLinker("POST", url, "AT1767B4C61D580001", JSON.stringify(body)); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
      let repdata = JSON.parse(apiResponse);
      let parentCode = "";
      if (repdata.code == "200") {
        if (repdata.data.length > 0) {
          parentCode = repdata.data[0].parentorgid; //所属组织
        }
      }
      return {
        url,
        code: 0,
        msg: "",
        data: {
          parentCode: parentCode
        }
      };
    } catch (e) {
      return {
        code: 500,
        msg: e.message,
        data: null
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });