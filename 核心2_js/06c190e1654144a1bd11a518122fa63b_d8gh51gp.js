let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿子表作唯一校验
    var requestData = param.requestData;
    var lx = typeof requestData;
    var requestDatas = "";
    if (lx == "string") {
      requestDatas = JSON.parse(requestData);
    }
    var status = requestDatas._status;
    if (status == "Insert") {
      //拿到数据
      var lReturn = param.data;
      //拿到子表 有2数据
      var ZiB = lReturn[0].VerificationSubTableList; //VerificationSubTableList
      for (var i = 0; i < ZiB.length; i++) {
        //设备管理单的ID
        var GuanLiDanID = ZiB[i].shebeibianma;
        //更新上次效验日期
        var xiaozhunriqi = ZiB[i].xiaozhunriqi;
        //下次校验日期
        var xiacixiaozhunriqi = ZiB[i].xiacixiaozhunriqi;
        //检验结论
        var jianyanjielun = ZiB[i].jianyanjielun;
        //备注
        var beizhu1 = ZiB[i].beizhu;
        var object = { id: GuanLiDanID, shangcixiaozhunriqi: xiaozhunriqi, xiacixiaozhunriqi: xiacixiaozhunriqi, xiaozhunjielun: jianyanjielun, beizhu: beizhu1 };
        var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DeviceManagement", object, "f7ca41a7");
      }
    }
    if (status == "Update") {
      var resultData = param.data;
      var updId = resultData[0].id; //主表id
      var sqlUpdate = "select * from AT15F164F008080007.AT15F164F008080007.VerificationSubTable where EquipmentCalibration_id ='" + updId + "'";
      var resUpdate = ObjectStore.queryByYonQL(sqlUpdate); //子表
      for (var i = 0; i < resUpdate.length; i++) {
        //设备管理单的ID
        var GuanLiDanID = resUpdate[i].shebeibianma;
        //更新上次效验日期
        var xiaozhunriqi = resUpdate[i].xiaozhunriqi;
        //下次校验日期
        var xiacixiaozhunriqi = resUpdate[i].xiacixiaozhunriqi;
        //检验结论
        var jianyanjielun = resUpdate[i].jianyanjielun;
        //备注
        var beizhu1 = resUpdate[i].beizhu;
        var object = { id: GuanLiDanID, shangcixiaozhunriqi: xiaozhunriqi, xiacixiaozhunriqi: xiacixiaozhunriqi, xiaozhunjielun: jianyanjielun, beizhu: beizhu1 };
        var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DeviceManagement", object, "f7ca41a7");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });