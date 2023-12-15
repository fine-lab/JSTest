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
        var product_lisList = [];
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          product_lisList.push({ id: sunId, Confirm_status: "1", storageState: "2", _status: "Update" });
        }
        var sunnotarizeobject = { id: mainId, Confirmthestatus: "1", storageState: "2", enable: "1", product_lisList: product_lisList };
        var sunnotarizeresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", sunnotarizeobject, "e84ee900");
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    } else if (state == 1) {
      // 更新主表实体
      if (res.length > 0) {
        var product_lisList = [];
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          product_lisList.push({ id: sunId, Confirm_status: "0", storageState: "1", _status: "Update" });
        }
        var sunnotarizeobject = {
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
          Acceptancetime: "",
          product_lisList: product_lisList
        };
        var sunnotarizeresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", sunnotarizeobject, "e84ee900");
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    } else if (state == 2) {
      // 更新主表实体
      var cancelobject = {
        id: mainId,
        Cancelone: cancelName,
        Cancelthetime: cancelDate,
        Acceptanceofthepeople: "",
        notarize_Reviewing: "",
        Themodifier: cancelName,
        Modificationdate: cancelDate,
        Acceptancetime: ""
      };
      var cancelresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", cancelobject, "e84ee900");
      throw new Error(JSON.stringify(cancelresult));
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          var sunId = res[i].id;
          // 更新子表实体
          var suncancelobject = { id: mainId, product_lisList: [{ id: sunId, Confirm_status: "0", storageState: "1", _status: "Update" }] };
          var suncancelresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", suncancelobject, "e84ee900");
        }
      } else {
        throw new Error("没有查询到子表数据！！！");
      }
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });