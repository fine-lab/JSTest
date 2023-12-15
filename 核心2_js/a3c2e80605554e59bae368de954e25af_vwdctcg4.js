let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询当前物料是否含有金额折扣
    let curDate = request.curDate;
    //金额折扣信息
    let discountMsg = null;
    let promotionMsg = null;
    let sqlList = "";
    if (request.fdInvClass == undefined) {
      throw new Error("物料大类不能为空！");
    }
    if (request.fdDept == undefined) {
      throw new Error("部门不能为空！");
    }
    if (request.fdInv == undefined) {
      throw new Error("物料不能为空！");
    }
    if (request.fmCustCategory == undefined) {
      request.fmCustCategory = "";
    }
    if (request.customer == undefined) {
      throw new Error("客户不能为空！");
    }
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        let invSql =
          "select  distinct MDiscountRuleDetFk from GT4691AT1.GT4691AT1.MDiscountRuleDet where  MDiscountRuleDetFk .enabled = 1 " +
          " and (MDiscountRuleDetFk .dmEffTime1<='" +
          curDate +
          "' or MDiscountRuleDetFk .dmEffTime1 is null) " +
          "and ( MDiscountRuleDetFk .dmdvTime1 >='" +
          curDate +
          "' or MDiscountRuleDetFk .dmdvTime1 is null)" +
          " and (ddInv='" +
          request.fdInv +
          "'  or  ddInvc='" +
          request.fdInvClass +
          "')" +
          " and (ddDept='" +
          request.fdDept +
          "' or ddDept is null) and (ddFullMoney <= " +
          request.quantity +
          " or  ddFullMoney is null) ";
        let invRes = ObjectStore.queryByYonQL(invSql);
        console.log("invSql:" + invSql);
        let invFKid = "";
        for (let prop in invRes) {
          invFKid += "'" + invRes[prop]["MDiscountRuleDetFk"] + "',";
        }
        if (invFKid.length > 0) {
          invFKid = invFKid.substr(0, invFKid.length - 1);
        } else {
          continue;
        }
        let inCustSql =
          "select   distinct MDiscountRuleInCustFk  from GT4691AT1.GT4691AT1.MDiscountRuleInCust  " + "where (dcCustClass='" + request.fmCustCategory + "' or dcCustomer='" + request.customer + "')";
        inCustSql += " and   MDiscountRuleInCustFk in (" + invFKid + ") ";
        let inCustRes = ObjectStore.queryByYonQL(inCustSql);
        let inCustId = "";
        for (let prop in inCustRes) {
          inCustId += "'" + inCustRes[prop]["MDiscountRuleInCustFk"] + "',";
        }
        if (inCustId.length > 0) {
          inCustId = inCustId.substr(0, inCustId.length - 1);
        } else {
          continue;
        }
        let ltCustSql =
          "select  distinct MDiscountRuleCustFk  from GT4691AT1.GT4691AT1.MDiscountRuleCust  " +
          "where (dcLimitCustClass='" +
          request.fmCustCategory +
          "' or dcLimitCustomer='" +
          request.customer +
          "')";
        if (inCustId.length > 0) {
          ltCustSql += " and   MDiscountRuleCustFk in (" + inCustId + ") ";
        }
        let ltCustRes = ObjectStore.queryByYonQL(ltCustSql);
        inCustId += ",";
        for (let prop in ltCustRes) {
          inCustId = replace(inCustId, "'" + ltCustRes[prop]["MDiscountRuleCustFk"] + "',", "");
        }
        if (inCustId.length > 0) {
          inCustId = inCustId.substr(0, inCustId.length - 1);
        } else {
          continue;
        }
        var discountSql =
          "select MDiscountRuleDetFk.*,* from GT4691AT1.GT4691AT1.MDiscountRuleDet where  " +
          "  (ddInv='" +
          request.fdInv +
          "'  or  ddInvc='" +
          request.fdInvClass +
          "')" +
          " and (ddDept='" +
          request.fdDept +
          "' or ddDept is null) and (ddFullMoney <= " +
          request.quantity +
          " or  ddFullMoney is null) " +
          " and MDiscountRuleDetFk in (" +
          inCustId +
          ")" +
          " order by ddiscount asc,ddFullMoney desc";
        let discountList = ObjectStore.queryByYonQL(discountSql);
        if (discountList.length > 0) {
          discountMsg = discountList[0];
        }
      }
      //查询当前物料是否含有赠品信息
      if (i == 1) {
        let zpinvSql =
          "select distinct MPromotionRuleDetFk from GT4691AT1.GT4691AT1.MPromotionRuleDet " +
          "where  MPromotionRuleDetFk.enabled =1 " +
          "and (MPromotionRuleDetFk.pmEffTime<='" +
          curDate +
          "' or MPromotionRuleDetFk.pmEffTime is null) " +
          "and (MPromotionRuleDetFk.pmDvTime>='" +
          curDate +
          "' or MPromotionRuleDetFk.pmDvTime is null)" +
          " and (pdInv='" +
          request.fdInv +
          "')  " +
          "and (pdDept='" +
          request.fdDept +
          "' or pdDept is null) and (pdFullQuantity<= " +
          request.quantity +
          "  or  pdFullMoney <=" +
          request.money +
          ") ";
        let zpinvRes = ObjectStore.queryByYonQL(zpinvSql);
        let zpinvFKid = "";
        for (let prop in zpinvRes) {
          zpinvFKid += "'" + zpinvRes[prop]["MPromotionRuleDetFk"] + "',";
        }
        if (zpinvFKid.length > 0) {
          zpinvFKid = zpinvFKid.substr(0, zpinvFKid.length - 1);
        } else {
          sqlList += "; sqlList:" + zpinvSql;
          continue;
        }
        let zpinCustSql =
          "select   distinct MPromotionRulInCustFk  from 	GT4691AT1.GT4691AT1.MPromotionRulInCust  " + "where (pcCustClass='" + request.fmCustCategory + "' or pcCustomer='" + request.customer + "')";
        zpinCustSql += " and   MPromotionRulInCustFk in (" + zpinvFKid + ") ";
        let zpinCustRes = ObjectStore.queryByYonQL(zpinCustSql);
        let zpinCustId = "";
        for (let prop in zpinCustRes) {
          zpinCustId += "'" + zpinCustRes[prop]["MPromotionRulInCustFk"] + "',";
        }
        if (zpinCustId.length > 0) {
          zpinCustId = zpinCustId.substr(0, zpinCustId.length - 1);
        } else {
          continue;
        }
        let zpltCustSql =
          "select  distinct MPromotionRuleCustFk  from GT4691AT1.GT4691AT1.MPromotionRuleCust	  " +
          "where (pcLimitCustClass='" +
          request.fmCustCategory +
          "' or pcLimitCustomer='" +
          request.customer +
          "')";
        if (zpinCustId.length > 0) {
          zpltCustSql += " and   MPromotionRuleCustFk in (" + zpinCustId + ") ";
        }
        let zpltCustRes = ObjectStore.queryByYonQL(zpltCustSql);
        zpinCustId += ",";
        for (let prop in zpltCustRes) {
          zpinCustId = replace(zpinCustId, "'" + zpltCustRes[prop]["MPromotionRuleCustFk"] + "',", "");
        }
        if (zpinCustId.length > 0) {
          zpinCustId = zpinCustId.substr(0, zpinCustId.length - 1);
        } else {
          continue;
        }
        let promSql =
          "select MPromotionRuleDetFk.*,* from GT4691AT1.GT4691AT1.MPromotionRuleDet " +
          "where MPromotionRuleDetFk in (" +
          zpinCustId +
          ")" +
          " and (pdInv='" +
          request.fdInv +
          "' )  " +
          "and (pdDept='" +
          request.fdDept +
          "' or pdDept is null) and (pdFullQuantity<= " +
          request.quantity +
          "  or  pdFullMoney <=" +
          request.money +
          ")" +
          "order by pdDept desc,pdFullQuantity desc,pdFullMoney desc,MPromotionRuleDetFk.pmMode asc";
        let promRes = ObjectStore.queryByYonQL(promSql);
        if (promRes.length > 0) {
          promotionMsg = promRes[0];
        } else {
          continue;
        }
        if (promotionMsg !== undefined) {
          //查询子子表
          let giftSql =
            "select  MPromotionRuleGiftsFk.MPromotionRuleDetFk.*,MPromotionRuleGiftsFk.*,*  from  GT4691AT1.GT4691AT1.MPromotionRuleGifts where MPromotionRuleGiftsFk  = '" + promotionMsg.id + "'";
          let giftList = ObjectStore.queryByYonQL(giftSql);
          promotionMsg.giftList = giftList;
        }
      }
    }
    return { sql: discountSql, discountMsg: discountMsg, promotionMsg: promotionMsg, sqlList: sqlList };
  }
}
exports({ entryPoint: MyAPIHandler });