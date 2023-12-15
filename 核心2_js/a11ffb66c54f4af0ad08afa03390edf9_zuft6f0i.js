let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let depcode = request.depcode; //用户Id
      let data = "";
      //通过用户ID查询员工信息
      let base_path = "https://www.example.com/";
      var body = {
        pageSize: 1000,
        pageIndex: 1
      };
      //请求数据
      let apiResponse = openLinker("POST", base_path, "AT1767B4C61D580001", JSON.stringify(body));
      var result = JSON.parse(apiResponse);
      if (result.code == "200") {
        for (var i = 0; i < result.data.recordList.length; i++) {
          if (result.data.recordList[i].codebianma == depcode) {
            data = result.data.recordList[i].code;
            break;
          }
        }
      }
      return {
        code: 0,
        msg: "",
        data
      };
    } catch (e) {
      return {
        code: 500,
        msg: e.message
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});