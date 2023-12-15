let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bodyData = request.bodyData; //样本信息
    //新增检测订单数据
    var insertObject = {
      Upstreamcoding: bodyData.code, //上游单据编码
      Upstreamid: bodyData.id, //上游主键id
      organizationId: bodyData.vorgId, //收样组织id
      sampleCode: bodyData.yangbenbianhao, //样本编码
      syData: bodyData.shouyangriqi, //收样日期
      testItemCode: bodyData.insItems, //检测项目
      chanpinxian: bodyData.chanpinxian, //产品线
      InspectionForm: bodyData.inspectionStyle, //送检形式
      jiesuandanwei: bodyData.merchant, //结算单位
      SubmittingUnit: bodyData.songjiandanwei, //送检单位
      section: bodyData.songjiankeshi, //科室
      PatientName: bodyData.xingming, //患者姓名
      SampleUnitType: bodyData.shouyangdanleixing, //收样单位类型
      IDNumber: bodyData.idCard, //身份证号
      SampleReceiver: bodyData.staffNew, //收样员
      department: bodyData.adminOrgVO, //部门
      Generate: "false", //是否生成报告
      gongyingshang: bodyData.vendorId, //供应商
      weiwaihanshuidanjia: bodyData.qjbmoney, //取价表含税单价
      weiwaiwushuidanjia: bodyData.qjbwushuijine, //取价表无税单价
      taxRate: bodyData.qjbtaxRate, //取价表税率
      importData: request.nowTime, //入账期间
      taxRateVO: bodyData.taxRate, //税率(系统)
      jcprojecthanshuidanjia: bodyData.qujiabiaohanshuijine, //检测项目含税单价
      jcprojectwushuidanjia: bodyData.qujiabiaowushuijine, //检测项目无税单价
      jcprojectshuie: bodyData.qujiabiaoshuie, //检测项目税额
      checkStatus: "10" //检测单状态
    };
    var insertRes = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.DetectOrder", insertObject, "71a4dca4");
    //更新收样管理中的【检测单状态】
    let bodyUpdate = { id: bodyData.id, checkStatus: "10" };
    let updateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", bodyUpdate, "63fb1ae5");
    return { insertRes };
  }
}
exports({ entryPoint: MyAPIHandler });