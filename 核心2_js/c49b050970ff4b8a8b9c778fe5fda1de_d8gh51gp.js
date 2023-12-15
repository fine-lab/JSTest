let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sampleId = request.id;
    //查询收样单
    var sampleSql = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where id='" + sampleId + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "developplatform");
    //获取收样单的检测单状态
    var jcType = sampleRes[0].checkStatus;
    if (jcType != "00") {
      throw new Error("收样单【" + sampleRes[0].yangbenbianhao + "】的检测单状态不是【待检测】,不能进行【启动检测】");
    }
    //获取收样单的收样状态
    var syType = sampleRes[0].zhuangtai;
    if (syType != "20" && syType != "30") {
      throw new Error("收样单【" + sampleRes[0].yangbenbianhao + "】的收样状态不是【待收样/已收样】,不能进行【启动检测】");
    }
    //回写收样单的状态
    var updateIsce = { id: sampleId, checkStatus: "05" }; //更改状态为【启动检测】
    var updateIsceResz = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateIsce, "63fb1ae5");
    return { updateIsceResz };
  }
}
exports({ entryPoint: MyAPIHandler });