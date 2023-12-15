let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //客户,已通过首营审批，不允许删除
    if (context.fullname == "aa.merchant.Merchant") {
      let errorMsg = "";
      let querySql = "select id,customer.name name from GT22176AT10.GT22176AT10.SY01_firstcampcusv3 where customer in (";
      for (let i = 0; i < param.data.length; i++) {
        if (i != param.data.length - 1) {
          querySql += "'" + param.data[i].id + "',";
        } else if (i == param.data.length - 1) {
          querySql += "'" + param.data[i].id + "'";
        }
      }
      let strLength = querySql.length;
      querySql = querySql.substring(0, querySql.length) + ")";
      let res = ObjectStore.queryByYonQL(querySql, "productcenter");
      for (let i = 0; i < res.length; i++) {
        if (res[i].extend_syzt == 1) {
          errorMsg += "名称为【" + res[i].name + "】的客户已通过首营审批,不允许删除！\n";
        }
      }
      if (errorMsg.length > 0) {
        throw new Error(errorMsg);
      }
    }
    //物料,已通过首营审批，不允许删除
    if (context.fullname == "pc.product.Product") {
      let errorMsg = "";
      let querySql = "select id,customerbillno.name name from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where customerbillno in (";
      for (let i = 0; i < param.data.length; i++) {
        if (i != param.data.length - 1) {
          querySql += "'" + param.data[i].id + "',";
        } else if (i == param.data.length - 1) {
          querySql += "'" + param.data[i].id + "'";
        }
      }
      let strLength = querySql.length;
      querySql = querySql.substring(0, querySql.length) + ")";
      let res = ObjectStore.queryByYonQL(querySql, "sy01");
      for (let i = 0; i < res.length; i++) {
        errorMsg += "名称为：【" + res[i].name + "】的物料已通过首营审批,不允许删除！\n";
      }
      if (errorMsg.length > 0) {
        throw new Error(errorMsg);
      }
    }
    //供应商,已通过首营审批，不允许删除
    if (context.fullname == "aa.vendor.Vendor") {
      let errorMsg = "";
      let querySql = "select id,supplier.name name from GT22176AT10.GT22176AT10.SY01_fccompauditv4 where supplier in (";
      for (let i = 0; i < param.data.length; i++) {
        if (i != param.data.length - 1) {
          querySql += "'" + param.data[i].id + "',";
        } else if (i == param.data.length - 1) {
          querySql += "'" + param.data[i].id + "'";
        }
      }
      let strLength = querySql.length;
      querySql = querySql.substring(0, querySql.length) + ")";
      let res = ObjectStore.queryByYonQL(querySql, "sy01");
      for (let i = 0; i < res.length; i++) {
        errorMsg += "编码为：【" + res[i].name + "】的供应商已通过首营审批,不允许删除！\n";
      }
      if (errorMsg.length > 0) {
        throw new Error(errorMsg);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });