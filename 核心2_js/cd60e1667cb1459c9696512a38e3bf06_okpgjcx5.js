let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.materialdemandsec_2264400886583552;
    orderDetails.forEach((dataod) => {
      if (dataod._selected == true) {
        // 执行update 修改 重点物资状态
        var id = dataod.id;
        var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
        var object = {
          id: id,
          isKeymaterials: false,
          subTable: [
            { hasDefaultInit: true, id: id, _status: "Insert" },
            { id: id, _status: "Delete" }
          ]
        };
        var res = ObjectStore.updateById(url, object);
      }
    });
    return {};
  }
}
exports({ entryPoint: MyTrigger });