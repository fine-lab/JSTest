let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sampleCode = request.BOM["样本编号*"];
    //查询收样单
    var sampleSql = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where yangbenbianhao='" + sampleCode + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "developplatform");
    //判断有没有数据
    if (sampleRes.length == 0) {
      throw new Error("收样单【" + sampleCode + "】没有这条数据");
    }
    var insStyle = sampleRes[0].inspectionStyle;
    if (insStyle == "02") {
      throw new Error("收样单【" + sampleCode + "】是委外,不能进行【启动检测】");
    }
    //获取收样单的检测状态
    var checkStatusType = sampleRes[0].checkStatus;
    if (checkStatusType == "05") {
      throw new Error("收样单【" + sampleCode + "】已经是【启动检测】");
    }
    //获取收样单的检测状态
    if (checkStatusType != "00") {
      throw new Error("收样单【" + sampleCode + "】的检测状态不是【待检测】,不能进行【启动检测】");
    }
    //获取收样单的收样状态
    var syType = sampleRes[0].zhuangtai;
    if (syType != "20" && syType != "30") {
      throw new Error("收样单【" + sampleCode + "】的收样状态不是【待收样/已收样】,不能进行【启动检测】");
    }
    //回写收样单的状态
    var sampleId = sampleRes[0].id;
    var updateIsce = { id: sampleId, checkStatus: "05" }; //更改状态为【启动检测】
    var updateIsceResz = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateIsce, "63fb1ae5");
    return { updateIsceResz };
  }
}
exports({ entryPoint: MyAPIHandler });