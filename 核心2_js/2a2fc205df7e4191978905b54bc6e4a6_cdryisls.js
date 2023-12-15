let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.resId;
    var id = data.id;
    var code = data.code;
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
      LOW: data.orderDefineCharacter.attrext4 // 10004247
    };
    let saleDepartmentId = data.saleDepartmentId;
    let url = "https://www.example.com/" + saleDepartmentId;
    let apiResponseBm = openLinker("GET", url, "SCMSA", null);
    var sapBmCode = "";
    apiResponseBm = JSON.parse(apiResponseBm);
    if (apiResponseBm.code == "200") {
      sapBmCode = apiResponseBm.data.code;
    } else {
      throw new Error("查询销售部门信息失败，请重试");
    }
    S_VGBEL1.push(s1);
    var s2 = {
      //部门
      LOW: sapBmCode
    };
    S_VKBUR1.push(s2);
    var s3 = {
      //外部单据号
      LOW: data.code
    };
    LT_EXNUM1.push(s3);
    tables.S_VGBEL = S_VGBEL1;
    // 按部门查询：
    // 按部组查询：
    tables.S_VKGRP = S_VKBUR1;
    tables.LT_EXNUM = LT_EXNUM1;
    body.tables = tables;
    //调用接口,传url和参数
    let func1 = extrequire("AT15C9C13409B00004.A3.sendSap");
    let QRresponse = func1.execute(null, body);
    //解析成对象
    let r2 = JSON.parse(QRresponse.strResponse);
    if (r2.ZIF_QRSD_SEARCHINV == undefined) {
      throw new Error("开票情况查询失败");
    } else if (r2.ZIF_QRSD_SEARCHINV != undefined && r2.ZIF_QRSD_SEARCHINV.OUTPUT.TRAN_FLAG == 0) {
      let hang = r2.ZIF_QRSD_SEARCHINV.TABLES.ZIFS_QR021_RTNH != undefined ? r2.ZIF_QRSD_SEARCHINV.TABLES.ZIFS_QR021_RTNH : undefined;
      let kpztList = [];
      let wkpIndex = 0; // 未开票
      let bfkpIndex = 0; // 部分开票
      let ykpIndex = 0; // 已开票
      if (hang == undefined) {
        throw new Error("SAP查询开票状态返回信息为空");
      }
      for (var i = 0; i < hang.length; i++) {
        let kpzt = hang[i].ZBILSTATUS;
        if (kpzt == "A") {
          kpztList.push("A");
          wkpIndex++;
        } else if (kpzt == "B") {
          kpztList.push("B");
          bfkpIndex++;
        } else {
          kpztList.push("C");
          ykpIndex++;
        }
      }
      let kpztStr = "";
      if (wkpIndex > 0 && ykpIndex > 0 && bfkpIndex > 0) {
        // 部分开票
        kpztStr = "部分开票";
      } else if (wkpIndex > 0 && ykpIndex == 0 && bfkpIndex == 0) {
        // 未开票
        kpztStr = "未开票";
      } else if (wkpIndex == 0 && ykpIndex > 0 && bfkpIndex == 0) {
        // 已开票
        kpztStr = "已开票";
      } else if (wkpIndex > 0 && ykpIndex > 0) {
        // 部分开票
        kpztStr = "部分开票";
      } else if (bfkpIndex > 0) {
        // 部分开票
        kpztStr = "部分开票";
      }
      var bodyZi = {
        billnum: "voucher_order",
        datas: [
          {
            id: id,
            orderDefineCharacter: {
              attrext3: kpztStr
            }
          }
        ]
      };
      //调用自定义项更新接口
      let url2 = "https://www.example.com/";
      //调用openlinker
      var zidingyi = openLinker("POST", url2, "SCMSA", JSON.stringify(bodyZi));
      return { zidingyi };
    } else {
      throw new Error(r2.ZIF_QRSD_SEARCHINV.OUTPUT.GS_MES);
    }
  }
}
exports({ entryPoint: MyAPIHandler });