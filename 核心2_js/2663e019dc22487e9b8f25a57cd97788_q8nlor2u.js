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
        let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
        let res = func1.execute();
        return res;
      };
      //获取apitoken
      my_test.getapitoken = function (parm) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.getToken");
        let res = func1.execute();
        return res;
      };
      //查询差异单
      my_test.queryChayi = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcYewu.querychayidan");
        let res = func1.execute(param);
        return res;
      };
      //通过openapi查询凭证
      my_test.queryPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      //通过openapi删除凭证
      my_test.delPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      //通过openapi 测试创建凭证
      my_test.createPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      //回写凭证生成状态
      my_test.updatePzStatus = function (param) {
        let id = param.id;
        let pingzheng_status = param.pingzheng_status;
        let pingzheng_code = param.pingzheng_code;
        var object = { id: "youridHere", pingzheng_status: pingzheng_status, pingzheng_code: pingzheng_code };
        var res = ObjectStore.updateById("AT15CFB6F808300003.AT15CFB6F808300003.zc_daiobochayi", object, "eab1692d");
        return res;
      };
      //对差异单弃审前做检查
      my_test.checkchayiPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcYewu.bfUnauditChayi");
        let res = func1.execute(param);
        return res;
      };
    }
    let yonql_test = new Object();
    {
      //查询会计期间
      yonql_test.query_kuaijiqijian = function (vdate) {
        let sql = "select * from bd.period.Period where begindate <= '" + vdate + "' and enddate>='" + vdate + "'";
        let res = ObjectStore.queryByYonQL(sql, "finbd");
        return res;
      };
      //查询账簿
      yonql_test.query_zhangbu = function (vdate) {
        let sql = "select * from bd.accbooktype.AccBookType ";
        let res = ObjectStore.queryByYonQL(sql, "finbd");
        return res;
      };
      //查询会计主体
      yonql_test.query_VirtualAccbody = function (parm) {
        let sql = "select * from 		aa.org.FinanceOrg";
        let res = ObjectStore.queryByYonQL(sql, "productcenter");
        return res;
      };
      //查询仓库所属组织
      yonql_test.query_Warehouse = function (parm) {
        let sql = "select * from 		aa.warehouse.Warehouse";
        let res = ObjectStore.queryByYonQL(sql, "productcenter");
        return res;
      };
      //查询存货
      yonql_test.query_inv = function (parm) {
        let sql = "select * from 		pc.product.Product where code= '1030900200022'";
        let res = ObjectStore.queryByYonQL(sql, "productcenter");
        return res;
      };
      //查询存货分类
      yonql_test.query_invcls = function (parm) {
        let sql = "select * from 		aa.product.ManageClass where id= 'youridHere'";
        let res = ObjectStore.queryByYonQL(sql, "productcenter");
        return res;
      };
    }
    result.query_VirtualAccbody = yonql_test.query_VirtualAccbody();
    result.query_Warehouse = yonql_test.query_Warehouse();
    //测试查询凭证
    {
    }
    //测试删除凭证
    //测试生成凭证
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });