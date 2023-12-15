let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let template_id = "youridHere";
    let myYonqlUtil = new Object();
    //定义一些查询函数
    {
      myYonqlUtil.queryStoreInByCode = function (code) {
        let sql = " select * from st.storein.StoreIn where code = '" + code + "'";
        var res = ObjectStore.queryByYonQL(sql, "ustock");
        return res;
      };
      myYonqlUtil.queryChayidan = function (code) {
        let sql = " select * from GT13847AT1.GT13847AT1.zc_diaobochayi";
        var res = ObjectStore.queryByYonQL(sql);
        return res;
      };
    }
    let myObjSelectUtil = new Object();
    {
      myObjSelectUtil.qurryChayidan = function (code) {
        let table_url = "GT13847AT1.GT13847AT1.zc_diaobochayi";
        let object = { code: code };
        res = ObjectStore.selectByMap(table_url, object);
        return res;
      };
      myObjSelectUtil.delChayidan = function (id) {
        let table_url = "GT13847AT1.GT13847AT1.zc_diaobochayi";
        let object = { id: id };
        res = ObjectStore.deleteById(table_url, object, "424b25a4");
        return res;
      };
      myObjSelectUtil.updateChayidansub = function () {
        var res = {};
        var object = { id: "youridHere", zc_diaobochayi_subList: [{ id: "youridHere", num: 10, _status: "Update" }] };
        var res_tmp = ObjectStore.updateById("GT13847AT1.GT13847AT1.zc_diaobochayi", object, "424b25a4");
        return res;
      };
    }
    let myTestUtil = new Object();
    //定义一些测试
    {
      //测试获取openapi token
      myTestUtil.getopenapitoken = function () {
        let func1 = extrequire("GT13847AT1.rule.getopenapitoken");
        let tmp = func1.execute("");
        return tmp;
      };
      //测试查询差异单信息
      myTestUtil.qurryChayidan = function (id) {
        let func1 = extrequire("GT13847AT1.backOpenApiFunction.qurryChayidan");
        let tmp = func1.execute({ id: id });
        return tmp;
      };
      //测试填入调拨成本金额
      myTestUtil.calChayidan = function (id) {
        let func1 = extrequire("GT13847AT1.backOpenApiFunction.calChayidan");
        let tmp = func1.execute({ id: id });
        return tmp;
      };
      //测试调用api
      myTestUtil.testUseApi = function (parm) {
        let func1 = extrequire("GT13847AT1.myutil.UserApiUtil");
        let tmp = func1.execute(parm);
        return tmp;
      };
      //测试查询凭证
      myTestUtil.querryPZ = function (parm) {
        let func1 = extrequire("GT13847AT1.backOpenApiFunction.checkPZJizhang");
        let tmp = func1.execute(parm);
        return tmp;
      };
      //测试删除凭证
      myTestUtil.delPZ = function (parm) {
        let func1 = extrequire("GT13847AT1.backOpenApiFunction.delPZ");
        let tmp = func1.execute(parm);
        return tmp;
      };
    }
    var res = "";
    res = myTestUtil.delPZ({ id: 1556839556641718300 });
    let rs = res;
    {
    }
    return rs;
  }
}
exports({ entryPoint: MyAPIHandler });