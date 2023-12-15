let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.bOutProp == "否") return {};
    let sqlMain = "select * from  GT4691AT1.GT4691AT1.MFrontSaleOrderMain where code = '" + request.mstCode + "'";
    let resMain = ObjectStore.queryByYonQL(sqlMain);
    let giftLimit = {};
    if (resMain.length > 0) {
      giftLimit.curDate = resMain[0]["fmBillingDate"];
      giftLimit.legalEntity = resMain[0]["fmLegalEntity"];
      giftLimit.customer = resMain[0]["fmCustomer"];
      giftLimit.mode = "submit";
      giftLimit.mstCode = request.mstCode;
    } else {
      throw new Error("该单据不存在，请刷新后重试！");
    }
    //判断当前日期是否大于10号
    let curDate = getDate(giftLimit.curDate, 0);
    let tenDate = getDate("yyyy-MM-10", 0);
    let lastTenDate = getDate("yyyy-MM-10", -1);
    let startDate, endDate;
    if (new Date(curDate).getTime() >= new Date(tenDate).getTime()) {
      //本月10号到当前日期
      startDate = tenDate;
      endDate = curDate;
    } else {
      //上月十号到本月
      startDate = lastTenDate;
      endDate = tenDate;
    }
    let sqlGift =
      "select sum(fdOldPrice*fdQuantity) as giftMoney  from GT4691AT1.GT4691AT1.MFrontSaleOrderDet where  MFrontSaleOrderDetFk.fmCustomer='" +
      giftLimit.customer +
      "' and MFrontSaleOrderDetFk.fmLegalEntity='" +
      giftLimit.legalEntity +
      "' and fdTaxMoney=0  and MFrontSaleOrderDetFk.createTime between  '" +
      startDate +
      "' and '" +
      endDate +
      " 23:59:59" +
      "' ";
    let resGift = ObjectStore.queryByYonQL(sqlGift);
    if (resGift.length > 0) {
      giftLimit.giftMoney = resGift[0]["giftMoney"];
    } else {
      giftLimit.giftMoney = 0;
    }
    let sqlTotal = "select sum(fdTaxMoney) as totalMoney  from GT4691AT1.GT4691AT1.MFrontSaleOrderDet where  MFrontSaleOrderDetFk.code='" + giftLimit.mstCode + "'";
    var resTotal = ObjectStore.queryByYonQL(sqlTotal);
    if (resTotal.length > 0) {
      giftLimit.totalMoney = resTotal[0]["totalMoney"];
    } else {
      giftLimit.totalMoney = 0;
    }
    function getDate(format, monthOp) {
      let newDate = new Date();
      let year = newDate.getFullYear();
      let month = newDate.getMonth();
      let day = newDate.getDate();
      format = replace(format, "yyyy", year);
      let m = month + 1 + monthOp;
      m = m > 0 ? m : 12;
      m = m > 10 ? m : "0" + m;
      format = replace(format, "MM", m);
      format = replace(format, "dd", day);
      return format;
    }
    let giftLimitMsg = "";
    let sumSql =
      "select  sum(fdTaxMoney) as fdTaxMoney from GT4691AT1.GT4691AT1.MFrontSaleOrderDet where MFrontSaleOrderDetFk.fmCustomer='" +
      giftLimit.customer +
      "' and MFrontSaleOrderDetFk.fmLegalEntity='" +
      giftLimit.legalEntity +
      "' and MFrontSaleOrderDetFk.fmBillingDate between  '" +
      startDate +
      "' and '" +
      endDate +
      " 23:59:59" +
      "' ";
    if (giftLimit.mstCode != undefined && giftLimit.mode != "add") {
      sumSql += " and MFrontSaleOrderDetFk.code<>'" + giftLimit.mstCode + "'";
    }
    let taxSum = ObjectStore.queryByYonQL(sumSql);
    if (taxSum.length > 0 && taxSum[0].fdTaxMoney != undefined) {
      if (giftLimit.giftMoney * 4 > taxSum[0].fdTaxMoney + giftLimit.totalMoney) {
        giftLimitMsg += "赠送合计金额：" + giftLimit.giftMoney + "，超出[" + startDate + "]至[" + endDate + "]之间订单总额：" + (taxSum[0].fdTaxMoney + giftLimit.totalMoney) + "的25%。 ";
      }
    } else {
      if (giftLimit.giftMoney * 4 > giftLimit.totalMoney) {
        giftLimitMsg += "赠送合计金额：" + giftLimit.giftMoney + "，超出[" + startDate + "]至[" + endDate + "]之间订单金额：" + giftLimit.totalMoney + "的25%。";
      }
    }
    //更新表
    return { giftLimit: giftLimitMsg };
  }
}
exports({ entryPoint: MyAPIHandler });