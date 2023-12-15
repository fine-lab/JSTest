let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.resId;
    var id = data[0].id;
    var code = data[0].code;
    //组装销售开票查询接口body请求参数
    var tables = {};
    var S_VGBEL1 = [];
    var S_VKBUR1 = [];
    var LT_EXNUM1 = [];
    let body = {
      funName: "ZIF_QRSD_SEARCHINV" //广州启润YS开票查询接口函数
    };
    var s1 = {
      //销售订单号
      LOW: "10004247" //data[0]["headFreeItem!define1"]     10004247
    };
    S_VGBEL1.push(s1);
    var s2 = {
      //部门
      LOW: ""
    };
    S_VKBUR1.push(s2);
    var s3 = {
      //外部单据号
      LOW: ""
    };
    LT_EXNUM1.push(s3);
    tables.S_VGBEL = S_VGBEL1;
    tables.S_VKBUR = S_VKBUR1;
    body.tables = tables;
    //调用接口,传url和参数
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let QRresponse = func1.execute(null, body);
    //解析成对象
    let r2 = JSON.parse(QRresponse.strResponse);
    if (r2.ZIF_QRSD_SEARCHINV.OUTPUT.TRAN_FLAG == 0) {
      var kpzt = r2.ZIF_QRSD_SEARCHINV.TABLES.ZIFS_QR021_RTNH[0].ZBILSTATUS;
      //调用自定义项更新接口
      let url2 = "https://www.example.com/";
      var bodyZi = {
        billnum: "voucher_order",
        datas: [
          {
            id: id,
            code: code,
            definesInfo: [
              {
                define3: kpzt,
                isHead: true,
                isFree: true
              }
            ]
          }
        ]
      };
      //调用openlinker
      var zidingyi = openLinker("POST", url2, "SCMSA", JSON.stringify(bodyZi));
      //自定义项
      var zidingyiAll = JSON.parse(kehudangan1);
    } else {
      throw new Error("-- 查询SAP接口失败：" + JSON.stringify(r2.ZIF_QRSD_SEARCHINV.OUTPUT.GS_MES) + " --");
    }
  }
}
exports({ entryPoint: MyAPIHandler });