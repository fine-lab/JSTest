let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 声明变量
    var id = request.id;
    var code = request.code;
    var billType = request.billType;
    var griddata = request.griddata;
    var errors = [];
    // 退回单校验检验合格数量、检验不合格数量、拒收数量 之和等于验收数量
    if (billType == "return") {
      for (var i = 0; i < griddata.length; i++) {
        var reviewQty = griddata[i].reviewQty;
        var qualifieQty = griddata[i].qualifieQty;
        var unqualifieQty = griddata[i].unqualifieQty;
        var rejectQty = griddata[i].rejectQty;
        if (reviewQty != qualifieQty + unqualifieQty + rejectQty) {
          errors.push("第" + (i + 1) + "行数据的【复查合格数量、复查不合格数量、复查拒收数量】之和不等于复查数量！");
        }
      }
      // 出库复核单校验检验合格数量、检验不合格数量之和等于验收数量
    } else {
      for (var i = 0; i < griddata.length; i++) {
        var reviewQty = griddata[i].reviewQty;
        var qualifieQty = griddata[i].qualifieQty;
        var unqualifieQty = griddata[i].unqualifieQty;
        var rejectQty = griddata[i].rejectQty;
        if (rejectQty != 0) {
          errors.push("第" + i + "行数据的复查拒收数量不为0，出库不允许填写复查拒收数量！");
        }
        if (reviewQty != qualifieQty + unqualifieQty) {
          errors.push("第" + (i + 1) + "行数据的【复查合格数量、复查不合格数量】之和不等于复查数量！");
        }
      }
    }
    // 判断是否存在无来源的行
    for (var i = 0; i < griddata.length; i++) {
      var sourcechild_id = griddata[i].sourcechild_id;
      if (sourcechild_id == undefined || sourcechild_id == null) {
        errors.push("第" + (i + 1) + "行数据无来源！");
      }
    }
    // 拼装错误提示并返回，页面的错误直接提示，不再调用后面的后台接口
    if (errors.length > 0) {
      var errStr = "";
      for (var i = 0; i < errors.length; i++) {
        errStr = errStr + (errStr.length == 0 ? "" : "\n");
        errStr = errStr + errors[i];
      }
      return { errInfo: errStr };
    }
    for (var i = 0; i < griddata.length; i++) {
      var reviewQty = griddata[i].reviewQty;
      var sourcechild_id = griddata[i].sourcechild_id;
      var detailid = griddata[i].id;
      var upDetailUri = "";
      var upQtyColum = "";
      // 退回验收单据校验数量是否溢出，并给出溢出的数量
      if (billType == "return") {
        upQtyColum = "fcheckbqdqty";
        upDetailUri = "GT22176AT10.GT22176AT10.sy01_gspsalereturns";
        // 出库复核单据校验数量是否溢出，并给出溢出的数量
      } else {
        upQtyColum = "checkUncertainNum";
        upDetailUri = "GT22176AT10.GT22176AT10.SY01_xsckfmx_v6";
      }
      // 拼装SQL复查单除本单据外总数。
      var currentsqlstr = "select sum(newReviewQty) as sumqty " + "from GT22176AT10.GT22176AT10.SY01_quareventryv1  where  sourcechild_id = " + sourcechild_id;
      // 拼接当前单据ID时判断是否是二次保存
      if (detailid != undefined && detailid != null) {
        currentsqlstr = currentsqlstr + " and id <>" + detailid;
      }
      var currentResult = ObjectStore.queryByYonQL(currentsqlstr);
      // 查询上游不确定总数
      var upsqlstr = "select " + upQtyColum + " as upQty from " + upDetailUri + "  where id = " + sourcechild_id;
      var upResult = ObjectStore.queryByYonQL(upsqlstr);
      // 校验上下游数据是否溢出
      if (currentResult.length == 1 && upResult.length == 1) {
        var upQty = upResult[0].upQty;
        var sumqty = currentResult[0].sumqty;
        if (upQty - sumqty < reviewQty) {
          errors.push("第" + (i + 1) + "行数据剩余最大复查数量" + (upQty - sumqty) + "，复查数量不能超出该数量！");
        }
      } else if (currentResult.length == 0) {
        var upQty = upResult[0].upQty;
        if (upQty < reviewQty) {
          errors.push("第" + (i + 1) + "行数据剩余最大复查数量" + upQty + "，复查数量不能超出该数量！");
        }
      } else {
        errors.push("第" + (i + 1) + "行数据匹配上游数据失败！");
      }
    }
    // 拼装错误返回提示
    if (errors.length > 0) {
      var errStr = "";
      for (var i = 0; i < errors.length; i++) {
        errStr = errStr + (errStr.length == 0 ? "" : "\n");
        errStr = errStr + errors[i];
      }
      return { errInfo: errStr };
    }
    return { flag: true };
  }
}
exports({ entryPoint: MyAPIHandler });