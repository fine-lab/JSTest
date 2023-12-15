let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error(JSON.stringify(param));
    let data2 = [];
    let lostdata2 = [];
    param.data[0].HXSaCheckMaterialVO2List.map((item) => {
      if (item.isLeave == true) {
        lostdata2.push(item.id);
      } else {
        data2.push(item.id);
      }
    });
    throw new Error("对账生成：" + JSON.stringify(data2));
    throw new Error("遗留：" + JSON.stringify(lostdata2));
    // 查询内容
    if (data2.length !== 0) {
      let object = [];
      data2.map((item) => {
        let item2 = { id: item, extendBillStatus: "2" };
        object.push(item2);
      });
      let res = ObjectStore.updateBatch("st.salesout.SalesOuts", object, "yb5d450a1f");
      throw new Error("对账生成：" + JSON.stringify(res));
    }
    if (lostdata2.length !== 0) {
      let object2 = [];
      lostdata2.map((item) => {
        let item3 = { id: item, extendBillStatus: "2" };
        object2.push(item3);
      });
      let res2 = ObjectStore.updateBatch("st.salesout.SalesOuts", object2, "yb5d450a1f");
      throw new Error("遗留：" + JSON.stringify(res2));
    }
  }
}
exports({ entryPoint: MyTrigger });