let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id;
    let sql =
      " select productionWorkNumber,amountOfAdvanceThisTime,advanceInformationSheet_id.advanceType from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id ='" +
      id +
      "'";
    var resSel = ObjectStore.queryByYonQL(sql);
    //获取预支类型
    var advanceType = resSel[0].advanceInformationSheet_id_advanceType;
    if (resSel.length > 0) {
      for (var i = 0; i < resSel.length; i++) {
        let item = resSel[i];
        let productionWorkNumber = item.productionWorkNumber;
        //获取本次预支金额
        let amountOfAdvanceThisTime = item.amountOfAdvanceThisTime;
        let sql =
          " select amountOfAdvanceThisTime,advanceInformationSheet_id.advanceType from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber ='" +
          productionWorkNumber +
          "'";
        var res = ObjectStore.queryByYonQL(sql);
        let sumAmount = 0;
        let sumAmount1 = 0;
        let sumAmount2 = 0;
        let sumAmount3 = 0;
        if (res.length > 0) {
          for (let j = 0; j < res.length; j++) {
            if (res[j].advanceInformationSheet_id_advanceType == "1") {
              sumAmount = sumAmount + res[j].amountOfAdvanceThisTime;
            }
            if (res[j].advanceInformationSheet_id_advanceType == "2") {
              sumAmount1 = sumAmount1 + res[j].amountOfAdvanceThisTime;
            }
            if (res[j].advanceInformationSheet_id_advanceType == "3") {
              sumAmount2 = sumAmount2 + res[j].amountOfAdvanceThisTime;
            }
            if (res[j].advanceInformationSheet_id_advanceType == "4") {
              sumAmount3 = sumAmount3 + res[j].amountOfAdvanceThisTime;
            }
          }
        }
        if (advanceType == "1") {
          sumAmount = sumAmount - amountOfAdvanceThisTime;
        }
        if (advanceType == "2") {
          sumAmount1 = sumAmount1 - amountOfAdvanceThisTime;
        }
        if (advanceType == "3") {
          sumAmount2 = sumAmount2 - amountOfAdvanceThisTime;
        }
        if (advanceType == "4") {
          sumAmount3 = sumAmount3 - amountOfAdvanceThisTime;
        }
        var object = { id: productionWorkNumber, anzhuangyuzhi: sumAmount, diaozhuangyuzhi: sumAmount1, dapengyuzhi: sumAmount2, fujiayuzhi: sumAmount3 };
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", object, "82884516");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });