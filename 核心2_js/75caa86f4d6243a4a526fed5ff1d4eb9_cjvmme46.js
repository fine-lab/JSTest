let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = request.res;
    let id = request.id;
    let saleReturDate = request.saleRetur;
    // 匹配不到退货单的回签单明细行
    let updateReturnGoods = new Array();
    // 更新退货单上的自定义项
    let datesArray = new Array();
    // 自定义项数组
    let defineArray = new Array();
    // 返回成功
    let successCode = 0;
    // 是否存在关联异常的信息
    let ErrorNumber = 0;
    let list = new Array();
    for (let i = 0; i < res.signBackSubtableList.length; i++) {
      for (let j = 0; j < saleReturDate[0].saleReturnDetails.length; j++) {
        if (res.signBackSubtableList[i].material === saleReturDate[0].saleReturnDetails[j].productId) {
          if (res.signBackSubtableList[i].isMateSaleReturn == "2") {
            ErrorNumber += 1;
          }
          // 组装自定义项数据
          // 查询销售退货自定义项
          let sonDefineSql =
            "select saleReturnDetailDefineCharacter.id,saleReturnDetailDefineCharacter.bodyDefine7, saleReturnDetailDefineCharacter.bodyDefine8, saleReturnDetailDefineCharacter.bodyDefine9 from  voucher.salereturn.SaleReturnDetail where id = '" +
            saleReturDate[0].saleReturnDetails[j].id +
            "'";
          let sonDefineSqlRes = ObjectStore.queryByYonQL(sonDefineSql, "udinghuo");
          let define7 = 0;
          let define8 = 0;
          let define9 = 0;
          let defineid = "";
          if (sonDefineSqlRes.length > 0) {
            if (sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine7 != undefined) {
              define7 = sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine7;
            }
            if (sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine8 != undefined) {
              define8 = sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine8;
            }
            if (sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine9 != undefined) {
              define9 = sonDefineSqlRes[0].saleReturnDetailDefineCharacter_bodyDefine9;
            }
            if (sonDefineSqlRes[0].saleReturnDetailDefineCharacter_id != undefined) {
              defineid = sonDefineSqlRes[0].saleReturnDetailDefineCharacter_id;
            }
          }
          let receivedquantity = 0;
          let responsibilitiesQty = 0;
          let componentqty = 0;
          let responsibilityQty = 0;
          let overwarrantyquantity = 0;
          if (res.signBackSubtableList[i].receivedquantity != undefined) {
            receivedquantity = res.signBackSubtableList[i].receivedquantity;
          }
          if (res.signBackSubtableList[i].responsibilitiesQty != undefined) {
            responsibilitiesQty = res.signBackSubtableList[i].responsibilitiesQty;
          }
          if (res.signBackSubtableList[i].componentqty != undefined) {
            componentqty = res.signBackSubtableList[i].componentqty;
          }
          if (res.signBackSubtableList[i].responsibilityQty != undefined) {
            responsibilityQty = res.signBackSubtableList[i].responsibilityQty;
          }
          if (res.signBackSubtableList[i].overwarrantyquantity != undefined) {
            overwarrantyquantity = res.signBackSubtableList[i].overwarrantyquantity;
          }
          defineArray.push({
            id: saleReturDate[0].saleReturnDetails[j].id,
            saleReturnDetailDefineCharacter: {
              // 回签单数量return {defineArray}
              bodyDefine7: receivedquantity + define7,
              // 质量问题
              bodyDefine8: define8 + responsibilitiesQty + componentqty,
              // 非质量问题
              bodyDefine9: define9 + (responsibilityQty + overwarrantyquantity),
              id: defineid
            }
          });
          let ttqty = 0;
          let aaqty = 0;
          if (saleReturDate[0].saleReturnDetails[j].qty != undefined) {
            ttqty = saleReturDate[0].saleReturnDetails[j].qty;
          }
          if (res.signBackSubtableList[i].receivedquantity != undefined) {
            aaqty = res.signBackSubtableList[i].receivedquantity + define7;
          }
          if (aaqty <= ttqty) {
          } else {
            // 关联异常
            res.signBackSubtableList[i].isMateSaleReturn = "2";
            res.signBackSubtableList[i]._status = "Update";
            updateReturnGoods.push(res.signBackSubtableList[i]);
            ErrorNumber += 1;
          }
        }
      }
    }
    if (ErrorNumber > 0) {
      // 更新没有匹配到的回签单明细行
      res.signBackSubtableList = updateReturnGoods;
      let UpdaRes = ObjectStore.updateById("AT164D981209380003.AT164D981209380003.signBack", res, "yb37935725");
    }
    // 获取动态域名
    let func = extrequire("AT164D981209380003.rule.gatewayUrl");
    let resGatewayUrl = func.execute(null);
    let gatewayUrl = resGatewayUrl.gatewayUrl;
    // 调用销售退货自定义项
    let body = {
      datas: [
        {
          saleReturnDetails: defineArray
        }
      ]
    };
    let url = gatewayUrl + "/yonbip/sd/api/updateSaleReturnDefineCharacter";
    let apiResponse = openLinker("POST", url, "AT164D981209380003", JSON.stringify(body));
    let apiDate = JSON.parse(apiResponse);
    if (apiDate.code != "200") {
      successCode = 1;
      return { successCode: successCode, ErrorNumber: ErrorNumber };
    }
    return { successCode: successCode, ErrorNumber: ErrorNumber };
  }
}
exports({ entryPoint: MyAPIHandler });