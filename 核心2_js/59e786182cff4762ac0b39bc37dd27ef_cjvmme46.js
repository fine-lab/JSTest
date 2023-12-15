let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DataObject = request.DateObject;
    // 质量问题数量
    let qualityproblemqtyNum = 0;
    // 非质量问题数量
    let notqualityproblemqtyNum = 0;
    // 工厂鉴定数量
    let factoryReceiptQtyNum = 0;
    // 需报废数量
    let scrappedQtyNum = 0;
    // 退货数量
    let SaleReturnQtyNum = 0;
    // 查询销售退货单据数据
    for (let i = 0; i < DataObject.signBackSubtableList.length; i++) {
      let signBackSubtableList = DataObject.signBackSubtableList[i];
      // 质量问题数量
      let qualityproblemqty = signBackSubtableList.responsibilitiesQty + signBackSubtableList.componentqty;
      // 非质量问题数量
      let notqualityproblemqty = signBackSubtableList.responsibilityQty + signBackSubtableList.overwarrantyquantity;
      qualityproblemqtyNum += qualityproblemqty;
      notqualityproblemqtyNum += notqualityproblemqty;
      factoryReceiptQtyNum += signBackSubtableList.receivedquantity;
      scrappedQtyNum += signBackSubtableList.scrappedQty;
      SaleReturnQtyNum += signBackSubtableList.SaleReturnQty;
      signBackSubtableList.qualityproblemqty = qualityproblemqty;
      signBackSubtableList.notqualityproblemqty = notqualityproblemqty;
      if (signBackSubtableList.responsibilityQty + signBackSubtableList.overwarrantyquantity - signBackSubtableList.scrappedQty < 0) {
        signBackSubtableList.isMateSaleReturn = "2";
      }
    }
    DataObject.qualityQty = qualityproblemqtyNum;
    DataObject.notQualityQty = notqualityproblemqtyNum;
    DataObject.factoryReceiptQty = factoryReceiptQtyNum;
    DataObject.scrappedQty = scrappedQtyNum;
    DataObject.SaleReturnQty = SaleReturnQtyNum;
    // 添加数据
    var res = ObjectStore.insert("AT164D981209380003.AT164D981209380003.signBack", DataObject, "yb37935725");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });