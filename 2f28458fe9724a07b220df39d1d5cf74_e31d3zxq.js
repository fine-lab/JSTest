let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //购进入库验收
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2") {
      let str = "";
      for (let i = 0; i < param.data.length; i++) {
        //校验是否有下游质量复查
        let json = { id: param.data[0].id, uri: "	GT22176AT10.GT22176AT10.Sy01_quareview" };
        let validate_zlfc = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json);
        //校验是否有下游药品拒收
        let json1 = { id: param.data[0].id, uri: "	GT22176AT10.GT22176AT10.SY01_medcrefusev2" };
        let validate_ypjs = extrequire("GT22176AT10.publicFunction.checkChildOrderUnAud").execute(json1);
        if (typeof validate_zlfc.Info != "undefined") {
          str += "【质量复查单】" + validate_zlfc.Info;
        }
        if (typeof validate_ypjs.Info != "undefined") {
          str += "【药品拒收单】" + validate_ypjs.Info;
        }
        let yonql = "select * from 	GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id = '" + param.data[i].id + "'";
        let res = ObjectStore.queryByYonQL(yonql, "sy01");
        let selectArriveOrderEntryQl = "select * from 	pu.arrivalorder.ArrivalOrders where id in(";
        for (let i = 0; i < res.length; i++) {
          if (i == res.length - 1) {
            selectArriveOrderEntryQl += "'" + res[i].sourcechild_id + "')";
          } else {
            selectArriveOrderEntryQl += "'" + res[i].sourcechild_id + "',";
          }
        }
        let arriveOrderEntry = ObjectStore.queryByYonQL(selectArriveOrderEntryQl, "upu");
        for (let i = 0; i < arriveOrderEntry.length; i++) {
          if (arriveOrderEntry[i].totalInQuantity > 0) {
            throw new Error("上游到货单已有入库，不能弃审!");
          }
        }
        if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2" || context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
          let updateByIdObj = { id: param.data[0].id, auditor: null, auditTime: null };
          let updateByIdRes = ObjectStore.updateById(context.fullname, updateByIdObj, context.billnum);
        }
      }
      if (str.length > 0) {
        throw new Error(str);
      }
    }
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_supplierStatus") {
      throw new Error("供应商采购状态变更不允许弃审,如有变化,另作一张变更单即可");
    }
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_cusStatus") {
      throw new Error("客户销售状态变更不允许弃审,如有变化,另作一张变更单即可");
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
    //首营商品审批，弃审逻辑，如果GSP商品档案中有对应数据，则不允许弃审，否则允许
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_fccusauditv4") {
      let sql = "select id,org_id,customerbillno,is_sku from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where id = '" + param.data[0].id + "' and dr = 0";
      let materialId = ObjectStore.queryByYonQL(sql, "sy01")[0].customerbillno;
      let orgId = ObjectStore.queryByYonQL(sql, "sy01")[0].org_id;
      let type = ObjectStore.queryByYonQL(sql, "sy01")[0].is_sku;
      let isHaveGSPSql = "select id from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + orgId + "' and dr = 0 and material = '" + materialId + "' and isSku = " + type;
      let res = ObjectStore.queryByYonQL(isHaveGSPSql, "sy01");
      if (res.length > 0) {
        throw new Error("已生成GSP商品档案，不允许弃审");
      }
    }
    //首营单据
    if (
      context.fullname == "GT22176AT10.GT22176AT10.SY01_fcuscauditv2" ||
      context.fullname == "GT22176AT10.GT22176AT10.SY01_firstcampcusv3" ||
      context.fullname == "GT22176AT10.GT22176AT10.SY01_cuschangeatv2" ||
      context.fullname == "GT22176AT10.GT22176AT10.SY01_fccompauditv4" ||
      context.fullname == "GT22176AT10.GT22176AT10.SY01_supcauditv2" ||
      context.fullname == "GT22176AT10.GT22176AT10.syfactory" ||
      context.fullname == "GT22176AT10.GT22176AT10.sy_change_factory"
    ) {
      throw new Error("首营单据不允许弃审");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });