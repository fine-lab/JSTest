let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mainids = [];
    param.data.map((item) => {
      mainids.push(item.id);
    });
    mainids = mainids.filter((x, index, self) => self.indexOf(x) === index);
    // 通过主表ID查询子表数据
    var sql = "select id,HXSaCheckBillVO2_id,isLeave from	AT16F3BEFC09B8000B.AT16F3BEFC09B8000B.HXSaCheckMaterialVO2 where HXSaCheckBillVO2_id in ('" + mainids.join("','") + "')";
    var res2 = ObjectStore.queryByYonQL(sql);
    let objects = [];
    param.data.map((item) => {
      var HXSaCheckMaterialVO2List = [];
      res2.map((item2) => {
        if (item2.HXSaCheckBillVO2_id === item.id) {
          var HXSaCheckMaterialVO2 = {
            id: item2.id,
            confirmStatus: "1",
            _status: "Update"
          };
          HXSaCheckMaterialVO2List.push(HXSaCheckMaterialVO2);
        }
      });
      var object = {
        id: item.id,
        approvalStatus: "4",
        checkbillStatus: "1",
        HXSaCheckMaterialVO2List
      };
      objects.push(object);
    });
    var res = ObjectStore.updateById("AT16F3BEFC09B8000B.AT16F3BEFC09B8000B.HXSaCheckBillVO2", objects, "yb5d450a1f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });