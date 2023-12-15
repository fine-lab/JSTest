let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //购进入库验收审核校验
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
      let errBillArray = [];
      for (let i = 0; i < param.data.length; i++) {
        let id = param.data[i].id;
        let sql = "select SY01_purinstockysv2_id.code code,id,isdouble_check,double_checker from GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id = '" + id + "'";
        let res = ObjectStore.queryByYonQL(sql, "sy01");
        let errIndexArray = [];
        for (let j = 0; j < res.length; j++) {
          if (res[j].isdouble_check == true && res[j].double_checker == undefined) {
            errIndexArray.push(j + 1);
          }
        }
        if (errIndexArray.length > 0) {
          errBillArray.push("单号：【" + res[0].code + "】中第" + errIndexArray.join("、") + "行为双人验收药品，二次验收人必填!");
        }
      }
      if (errBillArray.length > 0) {
        throw new Error(errBillArray.join(","));
      }
    }
    //销售出库复核审核校验
    if (context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
      let errBillArray = [];
      for (let i = 0; i < param.data.length; i++) {
        let id = param.data[i].id;
        let sql = "select sy01_saleoutstofhv5_id.code code,id,doubleCheck,doubleCheckMan from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6 where sy01_saleoutstofhv5_id = '" + id + "'";
        let res = ObjectStore.queryByYonQL(sql, "sy01");
        let errIndexArray = [];
        for (let j = 0; j < res.length; j++) {
          if (res[j].doubleCheck == true && res[j].doubleCheckMan == undefined) {
            errIndexArray.push(j + 1);
          }
        }
        if (errIndexArray.length > 0) {
          errBillArray.push("单号：【" + res[0].code + "】中第" + errIndexArray.join("、") + "行为双人复核药品，二次复核人必填!");
        }
      }
      if (errBillArray.length > 0) {
        throw new Error(errBillArray.join(","));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });