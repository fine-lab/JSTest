let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置文件
    var yhtToken = JSON.parse(AppContext()).token;
    var filePaths = "";
    if (request != undefined && request.id != undefined && request.id != "") {
      filePaths = getFileUrlById(request.id);
    }
    if (filePaths == "") {
      return { code: 201, data: "未查询到图片地址，请检查图片id是否正确" };
    } else {
      return { code: 200, data: filePaths };
    }
    function getFileUrlById(fileId) {
      //附件的fileid add by 2023/02/06 集团变更传参
      let url = "https://www.example.com/" + fileId + "/files?includeChild=false&pageSize=10";
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${yhtToken}` };
      let body = {};
      let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
      if (apiResponse == undefined) {
        return "0";
      } else {
        JSON.parse(apiResponse).data.forEach((self) => {
          filePaths = self.filePath;
        });
        return filePaths;
      }
      return filePaths;
    }
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error("获取所属平台 " + e + ";参数:" + JSON.stringify(req));
      }
      return result.data.fxscode;
    }
  }
}
exports({ entryPoint: MyAPIHandler });