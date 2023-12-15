let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.code;
    var updateData = request.updateData;
    var modification = request.modification;
    var riqi = request.modificationData;
    var returnData = {};
    let toUpdate;
    // 更新条件
    for (var i = 0; i < id.length; i++) {
      var updateWrapper = new Wrapper();
      updateWrapper.eq("dr", 0).eq("id", id[i]);
      // 待更新字段内容
      if (modification === "fuzeren") {
        //负责人
        toUpdate = { fuzeren: updateData };
      } else if (modification === "fawenshijian") {
        //发布时间
        toUpdate = { fawenshijian: updateData };
      } else if (modification === "zuihoudakuanriqi") {
        //最后打款日期
        toUpdate = { zuihoudakuanriqi: updateData };
      } else if (modification === "hetongbianhao") {
        //合同号
        toUpdate = { hetongbianhao: updateData };
      } else if (modification === "pupiaozhuanpiao") {
        //发票类型
        toUpdate = { pupiaozhuanpiao: updateData };
      } else if (modification === "daopiaoshijian") {
        //到票日期
        toUpdate = { daopiaoshijian: updateData };
      } else if (modification === "insetnew34") {
        //发票号
        toUpdate = { insetnew34: updateData };
      } else if (modification === "meijiejipiaoriqi") {
        //媒介寄票日期
        toUpdate = { meijiejipiaoriqi: updateData };
      } else if (modification === "dakuanqudao") {
        //打款渠道
        toUpdate = { dakuanqudao: updateData };
      } else if (modification === "zhangqi") {
        toUpdate = { zhangqi: updateData };
      } else if (modification === "shifushangchuanhetong") {
        toUpdate = { shifushangchuanhetong: updateData };
      }
      // 执行更新
      ObjectStore.update("GT64724AT4.GT64724AT4.Playwithdetail", toUpdate, updateWrapper, "1cffde62");
    }
    returnData.code = 200;
    returnData.message = "更新成功" + id.length + "条数据！";
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });