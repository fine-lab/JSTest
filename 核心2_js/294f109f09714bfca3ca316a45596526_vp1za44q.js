let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bodyData = request.bodyData; //样本信息
    var nowday = request.nowday;
    //下推销售订单
    let sendFunc = extrequire("AT15F164F008080007.sampleRece.sendSingleData");
    let sendRes = sendFunc.execute(bodyData);
    var sendResCode = sendRes.responseOCode;
    if (sendResCode != "200") {
      throw new Error("下推销售订单异常！");
    }
    //更改样本的状态、样本接收日期
    let updateFunc = extrequire("AT15F164F008080007.sampleRece.updateRecDetil");
    var updateObj = { id: bodyData.id, zhuangtai: "30", yangbenjieshouriqi: nowday };
    let updateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateObj, "63fb1ae5");
    var checkStatusValue = bodyData.checkStatus; //检测单状态
    //更新检测订单
    if (checkStatusValue == "10" || checkStatusValue == "20" || checkStatusValue == "30") {
      //已收样/检测中、已完成、已终止
      //依据收样管理主键查询对应的检测订单
      var querySql = "select id from AT15F164F008080007.AT15F164F008080007.DetectOrder where Upstreamid='" + bodyData.id + "'";
      var qyeryRes = ObjectStore.queryByYonQL(querySql, "developplatform");
      if (qyeryRes.length > 0) {
        var updateList = new Array();
        for (var i = 0; i < qyeryRes.length; i++) {
          var updateObject = {
            id: qyeryRes[0].id, //检测订单主键
            sampleCode: bodyData.yangbenbianhao, //样本编码
            syData: bodyData.shouyangriqi, //收样时间
            SubmittingUnit: bodyData.songjiandanwei, //送检单位
            section: bodyData.songjiankeshi, //科室
            PatientName: bodyData.xingming, //患者姓名
            IDNumber: bodyData.idCard, //身份证号
            SampleReceiver: bodyData.staffNew, //收样员
            department: bodyData.adminOrgVO //部门
          };
          updateList.push(updateObject);
        }
        var res = ObjectStore.updateBatch("AT15F164F008080007.AT15F164F008080007.DetectOrder", updateList, "71a4dca4");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });