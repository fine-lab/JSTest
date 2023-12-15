let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let voucherJsonApiUrl = "https://www.example.com/"; //发布的保存凭证json的接口
    let logToDBUrl = "https://www.example.com/"; //发布的写日志接口
    let addVoucherUrl = "https://www.example.com/"; //添加凭证接口
    let delVoucherUrl = "https://www.example.com/"; //删除凭证接口
    let updateDefinesUrl = "https://www.example.com/"; //更新自定义项数据
    let LogToDB = true;
    let msg = "success";
    let rst = false;
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var usrName = obj.currentUser.name;
    const reqNewFlag = request.newFlag;
    const redVoucher = request.redVoucher;
    if (redVoucher == 0) {
      //销售订单红冲单据
      let reqId = request.id;
      let reqBillCode = request.billCode;
      let reqVoucherCode = request.voucherCode;
      let reqVoucherId = request.voucherId;
      let voucherToDbResp = openLinker(
        "POST",
        voucherJsonApiUrl,
        APPCODE,
        JSON.stringify({ OrderType: 0, saleOrderCode: reqBillCode, saleOrderId: reqId, voucherCode: reqVoucherCode, voucherId: reqVoucherId, usrName: usrName })
      ); //查询JSON
      let voucherJsonObj = JSON.parse(voucherToDbResp);
      let voucherSaveApiRes = openLinker("POST", addVoucherUrl, "SCMSA", JSON.stringify(voucherJsonObj.data)); //添加凭证
      let voucherSaveApiResObj = JSON.parse(voucherSaveApiRes);
      let logToDBResp = openLinker(
        "POST",
        logToDBUrl,
        APPCODE,
        JSON.stringify({ LogToDB: LogToDB, logModule: 6, description: "调用生成[红字]凭证接口" + addVoucherUrl, reqt: JSON.stringify(voucherJsonObj.data), resp: voucherSaveApiRes, usrName: usrName })
      ); //写日志
      let voucherCode = reqBillCode;
      let voucherId = "yourIdHere";
      if (voucherSaveApiResObj.code == 200) {
        msg = "生成红冲凭证成功";
        voucherCode = voucherSaveApiResObj.data.billCode;
        voucherId = voucherSaveApiResObj.data.voucherId;
        openLinker(
          "POST",
          voucherJsonApiUrl,
          APPCODE,
          JSON.stringify({ OrderType: 2, saleOrderCode: reqBillCode, saleOrderId: reqId, voucherJson: JSON.stringify(voucherJsonObj.data), usrName: usrName })
        );
      } else {
        return { rst: false, data: { voucherCode: voucherCode }, msg: voucherSaveApiResObj.message };
      }
      return { rst: true, data: { voucherCode: voucherCode, voucherId: voucherId }, msg: "", voucherSaveApiRes: voucherSaveApiRes, voucherToDbResp: voucherToDbResp };
    }
    if (reqNewFlag == null || reqNewFlag == undefined || reqNewFlag == "0") {
      //删除
      let reqId = request.id;
      let reqBillCode = request.billCode;
      let reqVoucherCode = request.voucherCode;
      let reqVoucherId = request.voucherId;
      let body = { ids: [reqVoucherId] };
      let apiRes = openLinker("POST", delVoucherUrl, "SCMSA", JSON.stringify(body));
      let apiResObj = JSON.parse(apiRes);
      let logToDBResp = openLinker(
        "POST",
        logToDBUrl,
        APPCODE,
        JSON.stringify({ LogToDB: LogToDB, logModule: 5, description: "调用删除凭证接口" + url, reqt: JSON.stringify(body), resp: apiRes, usrName: usrName })
      );
      if (apiRes != null && (apiResObj.code == 200 || apiResObj.code == 1 || (apiResObj.code == 0 && apiResObj.message.includes("未找到相应凭证")))) {
        if (apiResObj.code == 200 || apiResObj.code == 1) {
          msg = "执行删除成功!";
        } else {
          msg = apiResObj.message;
        }
        rst = true;
        let voucherToDbResp = openLinker("POST", voucherJsonApiUrl, APPCODE, JSON.stringify({ OrderType: -1, saleOrderCode: reqBillCode, saleOrderId: reqId, usrName: usrName }));
        let updbody = {
          billnum: "voucher_order",
          datas: [
            {
              id: reqId,
              code: reqBillCode,
              definesInfo: [
                {
                  define60: "",
                  isHead: true,
                  isFree: true
                },
                {
                  define59: "",
                  isHead: true,
                  isFree: true
                }
              ]
            }
          ]
        };
        let updapiRes = openLinker("POST", updateDefinesUrl, "SCMSA", JSON.stringify(updbody));
      } else {
        msg = apiResObj.message;
        rst = false;
      }
      return { rst: rst, data: { voucherCode: reqVoucherCode }, msg: msg, apiRes: apiRes };
    } else {
      //生成凭证
      let reqId = request.id;
      let reqBillCode = request.billCode;
      let voucherBody = {
        srcSystemCode: "figl",
        accbookCode: "GL08010001",
        voucherTypeCode: "1",
        makerMobile: "13783475936",
        bodies: [
          {
            description: "销售订单(借)-" + reqBillCode,
            accsubjectCode: "112202",
            debitOriginal: 11234.0,
            debitOrg: 11234.0,
            rateType: "01",
            clientAuxiliaryList: [
              {
                filedCode: "0003",
                valueCode: "90000006"
              },
              {
                filedCode: "0005",
                valueCode: "00000000000007"
              },
              {
                filedCode: "0008",
                valueCode: "00000006"
              }
            ]
          },
          {
            description: "销售订单(贷)-" + reqBillCode,
            accsubjectCode: "600102",
            creditOriginal: 11134.0,
            creditOrg: 11134.0,
            rateType: "01",
            settlementModeCode: "system_0001",
            billTime: "2021-08-23",
            billNo: "10001",
            bankVerifyCode: "20001",
            clientAuxiliaryList: [
              {
                filedCode: "0001",
                valueCode: "BTJX0101"
              },
              {
                filedCode: "0003",
                valueCode: "90000006"
              },
              {
                filedCode: "0005",
                valueCode: "00000000000007"
              },
              {
                filedCode: "0008",
                valueCode: "00000006"
              }
            ]
          },
          {
            description: "销售订单-税额(贷)" + reqBillCode,
            accsubjectCode: "22210106",
            creditOriginal: 100,
            creditOrg: 100,
            rateType: "01"
          }
        ]
      };
      let voucherSaveApiRes = openLinker("POST", addVoucherUrl, "SCMSA", JSON.stringify(voucherBody));
      let voucherSaveApiResObj = JSON.parse(voucherSaveApiRes);
      let logToDBResp = openLinker(
        "POST",
        logToDBUrl,
        APPCODE,
        JSON.stringify({ LogToDB: LogToDB, logModule: 4, description: "调用生成凭证接口" + voucherUrl, reqt: JSON.stringify(voucherBody), resp: voucherSaveApiRes, usrName: usrName })
      );
      let voucherCode = reqBillCode;
      let voucherId = "yourIdHere";
      if (voucherSaveApiResObj.code == 200) {
        msg = "生成凭证成功";
        voucherCode = voucherSaveApiResObj.data.billCode;
        voucherId = voucherSaveApiResObj.data.voucherId;
      } else {
        return { rst: false, data: { voucherCode: voucherCode }, msg: voucherSaveApiResObj.message };
      }
      //调用接口回写凭证记录
      let voucherToDbResp = openLinker(
        "POST",
        voucherJsonApiUrl,
        APPCODE,
        JSON.stringify({ OrderType: 1, saleOrderCode: reqBillCode, saleOrderId: reqId, voucherJson: JSON.stringify(voucherBody), usrName: usrName })
      );
      //回写凭证号
      let body = {
        billnum: "voucher_order",
        datas: [
          {
            id: reqId,
            code: reqBillCode,
            definesInfo: [
              {
                define60: voucherCode,
                isHead: true,
                isFree: true
              },
              {
                define59: voucherId,
                isHead: true,
                isFree: true
              }
            ]
          }
        ]
      };
      let apiRes = openLinker("POST", updateDefinesUrl, "SCMSA", JSON.stringify(body));
      return { rst: true, data: { voucherCode: voucherCode, voucherId: voucherId }, msg: apiRes, logToDBResp: logToDBResp };
    }
  }
}
exports({ entryPoint: MyAPIHandler });