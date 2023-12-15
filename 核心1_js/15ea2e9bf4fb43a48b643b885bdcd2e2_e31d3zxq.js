let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let start_date = request.start_date;
    let end_date = request.end_date;
    //查询购进入库验收单主表
    let masterSql = "select id from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where inspectDate>'" + start_date + "' and inspectDate< '" + end_date + "' AND verifystate =2";
    let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
    let ids = [];
    let result = [];
    if (masterRes != null && masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        ids.push(masterRes[i].id);
      }
      let str_ids = ids.join(",");
      let childSql =
        "select SY01_purinstockysv2_id,pzwh,material_name,manufacturer,material_unit,batch_no,manufact_date,valid_until,checkQty,material_unit.name,checkConclusion.name  from GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id in (" +
        str_ids +
        ")";
      let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
      if (childRes != null && childRes.length > 0) {
        for (let i = 0; i < childRes.length; i++) {
          let res = {
            REG: "",
            YPMC: "",
            FACTORY: "",
            GHDW: "",
            DW: "",
            SCPH: "",
            SCRQ: "",
            YXQ: "",
            SJSL: "",
            YSJL: "",
            YSRQ: "",
            YSY: "",
            DH: ""
          };
          let sql = "select inspectDate,code,inspecter,supplier,supplier.name from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where id ='" + childRes[i].SY01_purinstockysv2_id + "'";
          let zhu_res = ObjectStore.queryByYonQL(sql, "sy01");
          let staff_sql = "select name from hred.staff.Staff where id ='" + zhu_res[0].inspecter + "'";
          let staff = ObjectStore.queryByYonQL(staff_sql, "hrcloud-staff-mgr");
          res.REG = childRes[i].pzwh;
          res.YPMC = childRes[i].material_name;
          res.FACTORY = childRes[i].manufacturer;
          res.DW = childRes[i].material_unit_name;
          res.SCPH = childRes[i].batch_no;
          res.SCRQ = childRes[i].manufact_date;
          res.YXQ = childRes[i].valid_until;
          res.SJSL = childRes[i].checkQty;
          res.YSJL = childRes[i].checkConclusion_name;
          if (zhu_res != null && zhu_res.length > 0) {
            res.YSRQ = zhu_res[0].inspectDate;
            res.DH = zhu_res[0].code;
            res.GHDW = zhu_res[0].supplier_name;
          }
          if (staff != null && staff.length > 0) {
            res.YSY = staff[0].name;
          }
          result[i] = res;
        }
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });