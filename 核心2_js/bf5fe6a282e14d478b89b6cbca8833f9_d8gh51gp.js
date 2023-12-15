let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnumber = request.idnumber;
    var querySySql = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where id='" + idnumber + "'";
    var qyerySyRes = ObjectStore.queryByYonQL(querySySql, "developplatform");
    var zhuangtaiValue = qyerySyRes[0].zhuangtai; //收样状态
    //更新检测订单
    if (zhuangtaiValue == "30") {
      //已收样
      //依据收样管理主键查询对应的检测订单
      var querySql = "select id from AT15F164F008080007.AT15F164F008080007.DetectOrder where Upstreamid='" + idnumber + "'";
      var qyeryRes = ObjectStore.queryByYonQL(querySql, "developplatform");
      if (qyeryRes.length > 0) {
        var updateList = new Array();
        for (var i = 0; i < qyeryRes.length; i++) {
          var updateObject = {
            id: qyeryRes[0].id, //检测订单主键
            sampleCode: qyerySyRes[0].yangbenbianhao, //样本编码
            syData: qyerySyRes[0].shouyangriqi, //收样时间
            SubmittingUnit: qyerySyRes[0].songjiandanwei, //送检单位
            section: qyerySyRes[0].songjiankeshi, //科室
            PatientName: qyerySyRes[0].xingming, //患者姓名
            IDNumber: qyerySyRes[0].idCard, //身份证号
            SampleReceiver: qyerySyRes[0].staffNew, //收样员
            department: qyerySyRes[0].adminOrgVO //部门
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