let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mainId = request.id;
    var res = ObjectStore.queryByYonQL("select id from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id = '" + mainId + "'");
    var state = request.state;
    // 取消人
    var cancelName = request.cancelName;
    // 取消日期
    var cancelDate = request.cancelDate;
    if (state == 0) {
      // 更新主表实体
      if (res.length > 0) {
        var saveParam = { id: mainId, Confirmthestatus: "1", storageState: "2", enable: "1" };
        saveParam.product_lisList = [];
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          saveParam.product_lisList.push({ id: sunId, Confirm_status: "1", storageState: "2", _status: "Update" });
        }
        ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", saveParam, "e84ee900");
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    }
    if (state == 1) {
      if (res.length > 0) {
        var saveParam = {
          id: mainId,
          Confirmthestatus: "0",
          storageState: "1",
          enable: "0",
          Cancelone: cancelName,
          Cancelthetime: cancelDate,
          Acceptanceofthepeople: "",
          notarize_Reviewing: "",
          Themodifier: cancelName,
          Modificationdate: cancelDate,
          Acceptancetime: ""
        };
        saveParam.product_lisList = [];
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          saveParam.product_lisList.push({ id: sunId, Confirm_status: "0", storageState: "1", _status: "Update" });
        }
        ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", saveParam, "e84ee900");
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    }
    if (state == 2) {
      if (res.length > 0) {
        var saveParam = {
          id: mainId,
          Cancelone: cancelName,
          Cancelthetime: cancelDate,
          Acceptanceofthepeople: "",
          notarize_Reviewing: "",
          Themodifier: cancelName,
          Modificationdate: cancelDate,
          Acceptancetime: ""
        };
        saveParam.product_lisList = [];
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          saveParam.product_lisList.push({ id: sunId, Confirm_status: "0", storageState: "1", _status: "Update" });
        }
        ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", saveParam, "e84ee900");
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });