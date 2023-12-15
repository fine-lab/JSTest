let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
    for (let i = 0; i < param.data.length; i++) {
      let billObj = {
        id: param.data[i].id,
        compositions: [
          {
            name: "SY01_purinstockys_lList"
          }
        ]
      };
      //查询购进入库验收的详情
      let res = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_purinstockysv2", billObj);
      let updateObject = { id: res.source_id, extend_is_gsp: "0" };
      ObjectStore.updateById("pu.arrivalorder.ArrivalOrder", updateObject, "pu_arrivalorder", "upu");
    }
  }
}
exports({ entryPoint: MyTrigger });