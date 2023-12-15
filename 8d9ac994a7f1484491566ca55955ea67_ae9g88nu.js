let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceEntryId_reviewQty = request.sourceEntryId_reviewQty; //上游单据子表ID
    let err_info = [];
    //查询购进入库验收单子表
    for (let i = 0; i < sourceEntryId_reviewQty.length; i++) {
      var object = { id: Object.keys(sourceEntryId_reviewQty) };
      if (request.reviewType == "1") {
        var res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_purinstockys_l", object);
        if (typeof res !== "undefined") {
          for (let i = 0; i < res.length; i++) {
            if (sourceEntryId_reviewQty[res[i].id] > res[i].uncertain_qty - res[i].review_qty) {
              err_info.push("质量复查的复查数量   不能大于  购进入库验收的检验不确定数量 - 购进入库验收的关联复查数量\n");
            }
          }
        }
        return { err_info };
      } else if (request.reviewType == "2") {
        //查询购进退出复核
        var res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_gjtcfh_l", object);
        if (typeof res !== "undefined") {
          for (let i = 0; i < res.length; i++) {
            if (sourceEntryId_reviewQty[res[i].id] > res[i].uncertain_qty - res[i].review_qty) {
              err_info.push("质量复查的复查数量   不能大于  购进退出复核的复核不确定数量 - 购进退出复核的关联复查数量\n");
            }
          }
        }
        return { err_info };
      } else if (request.reviewType == "5") {
        var res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_warehousedev2", object);
        if (typeof res !== "undefined") {
          for (let i = 0; i < res.length; i++) {
            if (sourceEntryId_reviewQty[res[i].id] > res[i].yhbqdsl - res[i].glfcsl) {
              err_info.push("质量复查的复查数量   不能大于  在库养护单的养护不确定数量 - 在库养护单的关联复查数量\n");
            }
          }
        }
        return { err_info };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });