let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let limitResSql = "";
    let lowerLimit = request.lowerLimit;
    //查询当前客户是否是特例客户
    let custRes = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MinMoneyControl where mmExceptCustomer = '" + lowerLimit.customer + "' order by pubts desc ");
    if (custRes.length > 0) {
      let limitMoney = parseFloat(custRes[0].minOrderAmount);
      if (lowerLimit.totalMoney > limitMoney) {
        return { limitMoneyMsg: custRes[0], limit: true };
      } else {
        return { message: "当前客户最低金额控制：" + limitMoney, limit: false };
      }
    }
    //非特例客户，同时设置是、否地址判断收货地址时，以第一条数据为准
    let limit = true;
    let message = "";
    for (let prop in lowerLimit) {
      if (prop == "totalMoney" || prop == "customer") {
        continue;
      }
      if (lowerLimit[prop].fmCustCategory == undefined) {
        lowerLimit[prop].fmCustCategory = "";
      }
      //判断当前不区分地址
      let limitRes = ObjectStore.queryByYonQL(
        "select * from GT4691AT1.GT4691AT1.MinMoneyControl where  mmBreedingTeam ='" +
          lowerLimit[prop].fdBreedTeam +
          "' and mmTransWay='" +
          lowerLimit[prop].fdDispatchName +
          "' and mmCusClassification='" +
          lowerLimit[prop].fmCustCategory +
          "' order by pubts desc  "
      );
      limitResSql =
        "select * from GT4691AT1.GT4691AT1.MinMoneyControl where  mmBreedingTeam ='" +
        lowerLimit[prop].fdBreedTeam +
        "' and mmTransWay='" +
        lowerLimit[prop].fdDispatchName +
        "' and mmCusClassification='" +
        lowerLimit[prop].fmCustCategory +
        "' order by pubts desc  ";
      if (limitRes.length > 0) {
        let limitMoney = parseFloat(limitRes[0].minOrderAmount);
        if (limitRes.bJudgeLocationFit == "1" || limitRes.bJudgeLocationFit === "是") {
          if (lowerLimit[prop].totalMoney < limitMoney) {
            message += "【" + prop + "】不满足最低金额（" + limitMoney + "）控制<br/>";
            limit = false;
          }
        } else {
          for (let j in lowerLimit[prop]) {
            if (j == "totalMoney" || j == "fmLegalEntity" || j == "fdBreedTeam" || j == "fdDispatchName" || j == "fmCustCategory") {
              continue;
            }
            if (lowerLimit[prop][j] < limitMoney) {
              message += "【" + prop + "&" + j + "】不满足最低金额（" + limitMoney + "）控制<br/>";
              limit = false;
              break;
            }
          }
        }
      }
      //如何当前不符合条件直接
    }
    let giftLimit = request.giftLimit;
    let returnSumSql = "";
    if (giftLimit.customer != undefined) {
      function getDate(format, monthOp) {
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth();
        let day = newDate.getDate();
        format = replace(format, "yyyy", year);
        let m = month + 1 + monthOp;
        m = m == 0 ? 12 : m;
        format = replace(format, "MM", m > 9 ? m : "0" + m);
        format = replace(format, "dd", day);
        return format;
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
      sqlGift += " and MFrontSaleOrderDetFk.code<>'" + giftLimit.mstCode + "'";
      let resGift = ObjectStore.queryByYonQL(sqlGift);
      if (resGift.length > 0) {
        giftLimit.ygiftMoney = resGift[0]["giftMoney"];
      } else {
        giftLimit.ygiftMoney = 0;
      }
      var giftLimitMsg = "";
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
      returnSumSql = sumSql;
      if (taxSum.length > 0 && taxSum[0].fdTaxMoney != undefined) {
        if (giftLimit.giftMoney * 4 + giftLimit.ygiftMoney * 4 > taxSum[0].fdTaxMoney + giftLimit.totalMoney) {
          giftLimitMsg +=
            "本单金额:（" +
            giftLimit.giftMoney +
            "）+当期已赠送合计金额:(" +
            giftLimit.ygiftMoney +
            "）累计已超出[" +
            startDate +
            "]至[" +
            endDate +
            "]之间订单金额订单总额：（" +
            (taxSum[0].fdTaxMoney + giftLimit.totalMoney) +
            "）的25%。 ";
        }
      } else {
        if (giftLimit.giftMoney * 4 + giftLimit.ygiftMoney * 4 > giftLimit.totalMoney) {
          giftLimitMsg +=
            "本单金额:（" +
            giftLimit.giftMoney +
            "）+当期已赠送合计金额:（" +
            giftLimit.ygiftMoney +
            "）累计已超出[" +
            startDate +
            "]至[" +
            endDate +
            "]订单金额之间订单总额：（" +
            giftLimit.totalMoney +
            "） 的25%。";
        }
      }
    }
    return { limitMoneyMsg: request, limit: limit, message: message, giftLimit: giftLimitMsg, sumSql: returnSumSql, limitResSql: limitResSql };
  }
}
exports({ entryPoint: MyAPIHandler });