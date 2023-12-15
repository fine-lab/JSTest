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
      //创建凭证
      my_test.createPz = function (param) {
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
      var parm = {
        url: "https://www.example.com/",
        param: {
          accbookCode: "222"
        },
        access_token: access_token
      };
      result.queryPz = my_test.queryPz(parm);
    }
    //测试删除凭证
    //测试生成凭证
    {
      let parm = {
        accbookCode: "ZZXLDSC0001",
        voucherTypeCode: "1",
        makerMobile: "18612560716",
        bodies: [
          {
            description: "测试借方凭证摘要",
            accsubjectCode: "1403",
            debitOriginal: "10",
            debitOrg: "10",
            clientAuxiliaryList: [
              {
                filedCode: "0006",
                valueCode: "LBYP000001"
              },
              {
                filedCode: "0008",
                valueCode: "YLBYP"
              }
            ]
          },
          {
            description: "测试贷方凭证摘要",
            accsubjectCode: "2202",
            creditOriginal: "10",
            creditOrg: "10",
            clientAuxiliaryList: [
              {
                filedCode: "0004",
                valueCode: "0001000001"
              }
            ]
          }
        ]
      };
      var myparm = {
        url: "https://www.example.com/",
        param: parm,
        access_token: access_token
      };
      result.createPz = myparm;
      result.createPz = my_test.createPz(myparm);
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });