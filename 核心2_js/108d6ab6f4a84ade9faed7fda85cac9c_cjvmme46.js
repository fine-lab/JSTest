let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let returngoodsCode = param.data[0].returngoodsCode;
    let func = extrequire("AT164D981209380003.rule.gatewayUrl");
    let resGatewayUrl = func.execute(null);
    let gatewayUrl = resGatewayUrl.gatewayUrl;
    let url = gatewayUrl + "/yonbip/sd/api/updateSaleReturnDefineCharacter";
    let id = param.data[0].id;
    let SaleId = "";
    let updateSaleReturnDefines = new Array();
    // 查询回签单的数据
    let unauditDataSql =
      "select id,returngoodsCode,identifyCode,b.responsibilityQty,b.responsibilitiesQty,b.componentqty,b.id as sonid,b.signBack_id,b.receivedquantity,b.qualityproblemqty,b.overwarrantyquantity,b.notqualityproblemqty,b.material from AT164D981209380003.AT164D981209380003.signBack left join AT164D981209380003.AT164D981209380003.signBackSubtable as b on id=b.signBack_id where id='" +
      id +
      "' and b.isMateSaleReturn='1'";
    let unauditDataSqlRes = ObjectStore.queryByYonQL(unauditDataSql);
    if (unauditDataSqlRes.length > 0) {
      for (let i = 0; i < unauditDataSqlRes.length; i++) {
        // 根据回签的id查询销售退货自定义字段的数据
        let SaleRrturnDataDefineSql =
          "select id,a.productId,a.id,a.saleReturnDetailDefineCharacter.id,a.saleReturnDetailDefineCharacter.bodyDefine7,a.saleReturnDetailDefineCharacter.bodyDefine8,a.saleReturnDetailDefineCharacter.bodyDefine9,a.saleReturnDetailDefineCharacter.bodyDefine2 from voucher.salereturn.SaleReturn left join voucher.salereturn.SaleReturnDetail as a on id=a.saleReturnId WHERE code = '" +
          returngoodsCode +
          "'";
        let SaleRrturnDataDefineSqlRes = ObjectStore.queryByYonQL(SaleRrturnDataDefineSql, "udinghuo");
        for (let j = 0; j < SaleRrturnDataDefineSqlRes.length; j++) {
          let define7 = 0;
          let define8 = 0;
          let define9 = 0;
          if (SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine7 != undefined) {
            define7 = SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine7;
          }
          if (SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine8 != undefined) {
            define8 = SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine8;
          }
          if (SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine9 != undefined) {
            define9 = SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_bodyDefine9;
          }
          if (unauditDataSqlRes[i].b_material == SaleRrturnDataDefineSqlRes[j].a_productId) {
            SaleId = SaleRrturnDataDefineSqlRes[j].id;
            // 调用销售退货自定义项更新接口进行回写弃审的数据
            // 质量问题数量
            let b_componentqty = 0;
            let b_responsibilitiesQty = 0;
            let b_responsibilityQty = 0;
            let b_overwarrantyquantity = 0;
            if (unauditDataSqlRes[i].b_componentqty != undefined) {
              b_componentqty = unauditDataSqlRes[i].b_componentqty;
            }
            if (unauditDataSqlRes[i].b_responsibilitiesQty != undefined) {
              b_responsibilitiesQty = unauditDataSqlRes[i].b_responsibilitiesQty;
            }
            if (unauditDataSqlRes[i].b_responsibilityQty != undefined) {
              b_responsibilityQty = unauditDataSqlRes[i].b_responsibilityQty;
            }
            if (unauditDataSqlRes[i].b_overwarrantyquantity != undefined) {
              b_overwarrantyquantity = unauditDataSqlRes[i].b_overwarrantyquantity;
            }
            let zz = b_componentqty + b_responsibilitiesQty;
            let nzz = b_responsibilityQty + b_overwarrantyquantity;
            updateSaleReturnDefines.push({
              id: SaleRrturnDataDefineSqlRes[j].a_id,
              saleReturnDetailDefineCharacter: {
                // 回签单数量return {defineArray}
                bodyDefine7: define7 - unauditDataSqlRes[i].b_receivedquantity,
                // 质量问题
                bodyDefine8: define8 - zz,
                // 非质量问题
                bodyDefine9: define9 - nzz,
                id: SaleRrturnDataDefineSqlRes[j].a_saleReturnDetailDefineCharacter_id
              }
            });
          }
        }
      }
      let body = {
        datas: [
          {
            saleReturnDetails: updateSaleReturnDefines
          }
        ]
      };
      try {
        let apiResponse = openLinker("POST", url, "AT164D981209380003", JSON.stringify(body));
        throw new Error(apiResponse);
      } catch (e) {
        // 回写回签单的状态
      }
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });