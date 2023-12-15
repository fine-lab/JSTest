let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取现在的页面状态
    if (param.requestData._status == null) {
      var ddd = JSON.parse(param.requestData);
    } else {
      var ddd = param.requestData;
    }
    // 获取现在的页面状态
    var vvv = ddd._status;
    // 获取页面上的合同号
    var oop = param.data[0].contractNumber_subcontractNo;
    var HTHNO = param.data[0].contractNumber;
    var SCNO = param.data[0].productionWorkNumber;
    // 查询分包合同主表
    var sql1 = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + oop + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    if (res1.length > 0) {
      // 判断状态是否是新增状态
      if (vvv == "Insert") {
        // 遍历分包合同主表
        for (var p = 0; p < res1.length; p++) {
          // 获取分包合同主表id
          var pid = res1[p].id;
          var fbzb = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + pid + "'";
          var fbzbRes = ObjectStore.queryByYonQL(fbzb);
          if (pid == HTHNO) {
            // 查询安装结算信息表主表
            var sql = "select id from GT102917AT3.GT102917AT3.installationStatement where contractNumber = '" + pid + "'";
            var res = ObjectStore.queryByYonQL(sql);
            // 遍历安装结算主表
            if (res.length > 0) {
              for (var i = 0; i < res.length; i++) {
                // 获取安装结算主表id
                let fid = res[i].id;
                // 查询分包合同子表
                var fbzib = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + pid + "'";
                var fbzibRes = ObjectStore.queryByYonQL(fbzib);
                // 遍历分包合同子表
                if (fbzibRes.length > 0) {
                  for (var pl = 0; pl < fbzibRes.length; pl++) {
                    // 获取分包合同子表id
                    var fbid = fbzibRes[pl].productionWorkNumber;
                    // 获取新增时子表的集合
                    let list = param.data[0].installBillingDetailsList;
                    // 遍历从页面上获取的子表集合
                    if (list != null) {
                      for (var j = 0; j < list.length; j++) {
                        // 获取新增时子表集合里的生产工号
                        let newProductionWorkNumber = list[j].productionWorkNumber;
                        // 根据主表id查询安装结算信息表子表
                        let Subtable = "select productionWorkNumber from GT102917AT3.GT102917AT3.installBillingDetails where installationStatement_id = " + fid + "";
                        let SubtableList = ObjectStore.queryByYonQL(Subtable);
                        // 遍历安装结算子表
                        for (var t = 0; t < SubtableList.length; t++) {
                          // 拿到数据库里的生产工号
                          let oldProductionWorkNumber = SubtableList[t].productionWorkNumber;
                          // 比较判断
                          if (newProductionWorkNumber == oldProductionWorkNumber) {
                            throw new Error("请注意！该合同号下有重复的生产工号");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // 判断当前状态是否是编辑态
        if (vvv == "Update") {
          // 遍历分包合同主表
          for (var pp = 0; pp < res1.length; pp++) {
            // 获取分包合同主表id
            var ppid = res1[pp].id;
            var fbzbsql = "select productionWorkNumber from GT102917AT3.GT102917AT3.subcontractDetails";
            var fbzbRes1 = ObjectStore.queryByYonQL(fbzbsql);
            if (ppid == HTHNO) {
              // 查询安装结算信息表主表
              var sqll = "select id from GT102917AT3.GT102917AT3.installationStatement where contractNumber = '" + ppid + "'";
              var ress = ObjectStore.queryByYonQL(sqll);
              // 遍历安装结算主表
              if (ress.length > 0) {
                for (var ii = 0; ii < ress.length; ii++) {
                  // 获取安装结算主表id
                  let ffid = ress[ii].id;
                  // 查询分包合同子表
                  var fbzibsql = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + ppid + "'";
                  var fbzibRes1 = ObjectStore.queryByYonQL(fbzibsql);
                  if (fbzibRes1.length > 0) {
                    // 遍历分包合同子表
                    for (var plp = 0; plp < fbzibRes1.length; plp++) {
                      // 获取分包合同子表id
                      var fbzibid = fbzibRes1[plp].productionWorkNumber;
                      // 获取新增时子表的集合
                      var List = param.data[0].installBillingDetailsList;
                      if (List != null) {
                        // 遍历从页面上获取的子表集合
                        for (var jg = 0; jg < List.length; jg++) {
                          // 获取新增时子表集合里的生产工号
                          let newproductionWorkNumber = List[jg].productionWorkNumber;
                          let state1 = List[jg]._status;
                          if (state1 != "Delete") {
                            // 根据主表id查询安装结算信息表子表
                            let Subtable1 = "select productionWorkNumber from GT102917AT3.GT102917AT3.installBillingDetails where installationStatement_id = " + ffid + "";
                            let SubtableList1 = ObjectStore.queryByYonQL(Subtable1);
                            // 遍历安装结算子表
                            for (var tt = 0; tt < SubtableList1.length; tt++) {
                              // 拿到数据库里的生产工号
                              let oldproductionWorkNumber = SubtableList1[tt].productionWorkNumber;
                              // 比较判断
                              if (newproductionWorkNumber == oldproductionWorkNumber) {
                                throw new Error("请注意！该合同号下有重复的生产工号");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });