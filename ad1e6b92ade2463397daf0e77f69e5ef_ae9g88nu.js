let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let verifystateArr = request.verifystateArr;
    let error_info = [];
    if (typeof id != "undefined" && id.length > 0) {
      for (let d = 0; d < id.length; d++) {
        for (let e = 0; e < verifystateArr.length; e++) {
          if (verifystateArr[e][id[d]] == 2) {
            var planCuringObj = {};
            //查寻本单据子表信息
            let childSql = "select * from GT22176AT10.GT22176AT10.SY01_warehousede where SY01_Warehouse_id=" + id[d];
            let childRes = ObjectStore.queryByYonQL(childSql);
            if (typeof childRes != "undefined") {
              for (let z = 0; z < childRes.length; z++) {
                let proCurChildId = childRes[z].id;
                //计划数量
                let planCuringNum = parseFloat(childRes[z].yhbhgsl);
                //关联在库养护数量
                let relateWarehouseCuringNum = parseFloat(childRes[z].glbhgdjsl);
                //剩余可生成在库养护的计划数量
                let surPlanCuringQty = parseFloat(planCuringNum - relateWarehouseCuringNum);
                planCuringObj[proCurChildId] = surPlanCuringQty;
              }
            }
            let sql = "select * from GT22176AT10.GT22176AT10.SY01_bad_drugv7 where source_id=" + id[d];
            let res = ObjectStore.queryByYonQL(sql);
            let childList = [];
            if (typeof res != "undefined") {
              for (let i = 0; i < res.length; i++) {
                let curingId = res[i].id;
                let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7 where SY01_bad_drugv2_id=" + curingId;
                let curingRes = ObjectStore.queryByYonQL(curingSql);
                //不合格登记单的不合格数量:unqualified_num
                if (typeof curingRes != "undefined") {
                  for (let j = 0; j < curingRes.length; j++) {
                    let upSourcechildId = curingRes[j].sourcechild_id;
                    if (planCuringObj[upSourcechildId] - curingRes[j].unqualified_num <= 0) {
                      error_info.push("第" + (d + 1) + "个商品剩余的可登记不合格单的数量不足,下推失败");
                    }
                  }
                }
              }
            }
          } else {
            error_info.push("第" + (d + 1) + "行单据未通过审批,下推失败");
          }
        }
      }
    }
    if (error_info.length > 0) {
      for (let err = 0; err < error_info.length; err++) {
        error_info[err] = error_info[err] + " \n ";
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });