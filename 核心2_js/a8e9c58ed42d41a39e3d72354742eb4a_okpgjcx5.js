let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.materialdemand_2230760591495424;
    var temp = new Array();
    orderDetails.forEach((dataod) => {
      if (dataod._selected == true) {
        if (dataod.shenqingren == "2221836202431232") {
          if (dataod.verifystate == "0") {
            throw new Error("需求已汇总但尚未审批通过，不允许上报。");
          }
          //插入实体 物资需求单
          var object = { wuzixuqiudan: dataod, subTable: [{ key: "yourkeyHere" }] };
          var res = ObjectStore.insert("GT21859AT11.GT21859AT11.notSumDemandPlan", object, dataod.id);
          temp.push(dataod.id);
          var isno = dataod.shangbaobiaoshi;
        }
      }
    });
    return {};
  }
}
exports({ entryPoint: MyTrigger });