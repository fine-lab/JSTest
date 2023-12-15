let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paRe = JSON.parse(param.requestData);
    //审核命令的param参数不带子表参数了，需要查询获取
    let prosql = "select * from GT5AT34.GT5AT34.PriceChangeDetail where PriceChange_id = '" + paRe.id + "' and dr = 0";
    let prores = ObjectStore.queryByYonQL(prosql);
    let productList = prores;
    let res = [];
    for (let i = 0; i < productList.length; i++) {
      let product = productList[i];
      let request = {};
      request.uri = "/yonbip/digitalModel/product/save";
      request.body = {
        data: {
          id: product.product,
          orgId: paRe.org_id,
          code: product.productCode,
          name: {
            zh_CN: product.productName
          },
          _status: "Update",
          detail: {
            id: product.product,
            purchaseUnit: product.qty,
            inspectionUnit: product.qty,
            purchasePriceUnit: product.qty,
            stockUnit: product.qty,
            produceUnit: product.qty,
            batchPriceUnit: product.qty,
            batchUnit: product.qty,
            onlineUnit: product.qty,
            offlineUnit: product.qty,
            requireUnit: product.qty,
            fMarkPrice: product.fMarkPrice,
            fSalePrice: product.fSalePrice,
            fMarketPrice: product.fMarketPrice,
            outTaxrate: product.outTaxrate,
            batchManage: false,
            deliverQuantityChange: 1,
            _status: "Update"
          },
          manageClass: "2520190735555072",
          manageClassCode: "000000",
          productClassCode: "000000",
          realProductAttribute: 1,
          realProductAttributeType: 1,
          unitUseType: 2,
          unit: product.qty,
          extendfMarkPricebatchUnit: product.complete,
          extendfMarkPricebatchPiece: product.extendfMarkPricebatchPiece //整件单瓶折算价
        }
      };
      let func = extrequire("GT34544AT7.common.baseOpenApi");
      let sysproduct = func.execute(request).res;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });