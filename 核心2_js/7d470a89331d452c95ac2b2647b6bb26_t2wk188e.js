let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = {};
    let my_test = new Object();
    //初始化相关测试
    {
      //测试1
      my_test.test1 = function (parm) {
        return { result: "test1 ok", test1parm: parm };
      };
      //后端脚本测试
      my_test.getconfig = function () {
        let func1 = extrequire("AT15B1FC5208300004.myluoyangconfig.myconfig");
        let res = func1.execute();
        return res;
      };
      //获取apitoken
      my_test.getapitoken = function (parm) {
        let func1 = extrequire("AT15B1FC5208300004.myutil.getToken");
        let res = func1.execute();
        return res;
      };
      //查询凭证
      my_test.queryPz = function (param) {
        let func1 = extrequire("AT15B1FC5208300004.myutil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      //删除凭证
      my_test.delPz = function (param) {
        let func1 = extrequire("AT15B1FC5208300004.myutil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
    }
    let yonql_test = new Object();
    {
      yonql_test.query_chayidan = function () {
        return {};
      };
    }
    result.test1_getconfig = my_test.getconfig();
    let access_token = my_test.getapitoken().access_token;
    result.access_token = access_token;
    //测试查询凭证
    {
    }
    //测试删除凭证
    {
      var parm = {
        url: "https://www.example.com/",
        param: {
          ids: [22]
        },
        access_token: access_token
      };
      result.queryPz = my_test.delPz(parm);
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });