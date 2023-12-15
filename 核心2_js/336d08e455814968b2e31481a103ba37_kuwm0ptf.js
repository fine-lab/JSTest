let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let strResponse = postman("get", "http://39.106.84.51/test?name=zjh", null, null);
    let arr = JSON.parse(strResponse);
    let objarr = [];
    for (let i = 0; i < arr.length; i++) {
      let user = arr[i];
      let mapping = {
        o2o_sku_id: "youridHere" + user.age,
        o2o_type: user.name,
        qty: 1,
        ys_skuList: [
          { ys_sku_Id: "yourIdHere", ys_sku_name: "YS物料1", qty: 0.01 },
          { ys_sku_Id: "yourIdHere", ys_sku_name: "YS物料2", qty: 0.02 }
        ]
      };
      objarr.push(mapping);
    }
    var res = ObjectStore.insertBatch("AT18B1B8FE0908000B.AT18B1B8FE0908000B.test_sku_mapping", objarr, "ybd45f5f45List");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });