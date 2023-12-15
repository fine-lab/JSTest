let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //购进入库验收主表
    let ret = {};
    //查询购进入库子表
    let object = { SY01_purinstockysv2_id: id };
    let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_purinstockys_l", object);
    if (typeof res != "undefined") {
      for (let i = 0; i < res.length; i++) {
        let billMasterId = res[i].id;
        if (res[i].uncertain_qty - res[i].review_qty < 0) {
          err_info.push("主表id为" + id + "的子表中检验不确定数量-关联复查数量小于0");
          return { err_info };
        }
        //检验不确定数量
        let uncertainQty = parseFloat(res[i].uncertain_qty);
        //关联复查拒收数量
        let refuseQty = parseFloat(res[i].total_refuse_qty);
        //关联复查合格数量
        let reviewQualifieQty = parseFloat(res[i].review_qualifie_qty);
        let apiRes = extrequire("GT22176AT10.gspPUR.get_zlfc_count").execute(billMasterId);
        if (typeof apiRes != "undefined") {
          let ret = apiRes.ret;
          if (typeof ret != "undefined" && ret.length > 0) {
            if (typeof ret.fcbhgsl != "undefined" && typeof ret.fchgsl != "undefined") {
              if (ret.fcbhgsl + ret.fchgsl + refuseQty + reviewQualifieQty >= uncertainQty) {
                let errInfo = "ID为" + id + "质量复查的 复查合格数量+复查不合格数量>=购进入库验收的检验不确定数量-(关联复查合格数量+关联复查不合格数量),无法下推";
                err_info.push(errInfo);
                return { err_info };
              }
            }
          }
        }
        return {};
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });