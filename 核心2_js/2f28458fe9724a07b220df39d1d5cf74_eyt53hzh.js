let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //购进入库验收
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
      //校验是否有下游质量复查
      let json = { id: param.data[0].id, uri: "	GT22176AT10.GT22176AT10.Sy01_quareview" };
      let validate_zlfc = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json);
      //校验是否有下游药品拒收
      let json1 = { id: param.data[0].id, uri: "	GT22176AT10.GT22176AT10.SY01_medcrefusev2" };
      let validate_ypjs = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json1);
      let str = "";
      if (typeof validate_zlfc.Info != "undefined") {
        str += "【质量复查单】" + validate_zlfc.Info;
      }
      if (typeof validate_ypjs.Info != "undefined") {
        str += "【药品拒收单】" + validate_ypjs.Info;
      }
      if (str.length > 0) {
        throw new Error(str);
      }
    }
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_supplierStatus") {
      throw new Error("供应商采购状态变更不允许弃审,如有变化,另作一张变更单即可");
    }
    //重点药品养护确认单
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_mainprocofmv3") {
      //校验是否有下游养护计划
      let json = { id: param.data[0].id, uri: "GT22176AT10.GT22176AT10.SY01_commodity_plan" };
      let validate_yhjh = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json);
      let str = "";
      if (typeof validate_yhjh.Info != "undefined") {
        str += "【商品养护计划单】" + validate_yhjh.Info;
      }
      if (str.length > 0) {
        throw new Error(str);
      }
    }
    //商品养护计划单
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_commodity_plan") {
      //校验是否有下游在库养护
      let json = { id: param.data[0].id, uri: "GT22176AT10.GT22176AT10.SY01_Warehousev2" };
      let validate_zkyh = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json);
      let str = "";
      if (typeof validate_zkyh.Info != "undefined") {
        str += "【商品在库养护单】" + validate_zkyh.Info;
      }
      if (str.length > 0) {
        throw new Error(str);
      }
    }
    //药品在库养护单
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_Warehousev2") {
      //校验是否有下游质量复查
      let json = { id: param.data[0].id, uri: "GT22176AT10.GT22176AT10.Sy01_quareview" };
      let validate_zlfc = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json);
      //校验是否有下游不合格药品登记单
      let json1 = { id: param.data[0].id, uri: "GT22176AT10.GT22176AT10.SY01_bad_drugv7" };
      let validate_bhgypdj = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json1);
      let str = "";
      if (typeof validate_zlfc.Info != "undefined") {
        str += "【质量复查单】" + validate_zlfc.Info;
      }
      if (typeof validate_bhgypdj.Info != "undefined") {
        str += "【药品拒收单】" + validate_bhgypdj.Info;
      }
      if (str.length > 0) {
        throw new Error(str);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });