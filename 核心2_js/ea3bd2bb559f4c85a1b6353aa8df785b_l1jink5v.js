let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let mpcLegalEntity = request.mpcLegalEntity;
    let mpcMerchant = request.mpcMerchant;
    let queYonQl = "select distinct mpcProduct from  GT4691AT1.GT4691AT1.MerchantProductControl where dr=0 and mpcLegalEntity='" + mpcLegalEntity + "'"; // and mpcMerchant="+mpcMerchant
    let products = ObjectStore.queryByYonQL(queYonQl, "developplatform");
    let pids = [];
    for (let i = products.length - 1; i >= 0; i--) {
      pids.push(products[i].mpcProduct);
    }
    return { payload: queYonQl, response: pids };
  }
}
exports({ entryPoint: MyAPIHandler });