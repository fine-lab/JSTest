let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 解析数据获取收款单详情
    let ids = request.order_ids;
    const appCode = "EAR";
    let receivebillArray = new Array();
    //根据收款ID查询收款详情Url
    let receivebillDetailUrl = "https://www.example.com/";
    for (let index = 0; index < ids.length; index++) {
      let receiveId = {
        receiveId: ids[index]
      };
      let tempreceivebillDetailUrl = receivebillDetailUrl + "?id=" + ids[index];
      let response = JSON.parse(openLinker("GET", tempreceivebillDetailUrl, appCode, null)).data;
      receivebillArray.push(response);
    }
    var ys_receiptDetails = new Array();
    var ys_orderCode = "0";
    //获取crm收款单token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    const objName = "skls";
    const token_body = {
      client_id: "youridHere",
      client_secret: "yoursecretHere",
      password: "yourpasswordHere",
      username: "https://www.example.com/",
      grant_type: "password",
      redirect_uri: "https://api.tencent.xiaoshouyi.com"
    };
    //调用crm接口获取token
    var crm_token_link = postman("post", crm_token_Url, null, JSON.stringify(token_body));
    var crm_token_link_value = JSON.parse(crm_token_link);
    var crm_receipt_token = crm_token_link_value.access_token;
    //定义crm接口数据
    var crm_header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + crm_receipt_token
    };
    var rows = new Array();
    for (let receivebill of receivebillArray) {
      //获取收款单数据
      var ys_receiptDetails_billDO = receivebill.bodyItem;
      if (ys_receiptDetails_billDO == null || ys_receiptDetails_billDO.length == 0) {
        if (receivebill.extendData != null) {
          //获取收款方式
          var receiptType = receivebill.extendData.bodyItemSettleMode;
          if (receiptType == 1593134135044997284) {
            receiptType = "银行转账";
          } else if (receiptType == 1593134135044997285) {
            receiptType = "现金收付款";
          } else if (receiptType == 1593134135044997286) {
            receiptType = "现金返利";
          } else if (receiptType == 1593134135044997287) {
            receiptType = "票据结算";
          } else if (receiptType == 1593134135044997288) {
            receiptType = "支票结算";
          } else if (receiptType == 1593134135044997289) {
            receiptType = "退款转预收";
          }
          //设置传入参数
          let item = {
            orderCode: receivebill.extendData.bodyItemOrderNo,
            code: receivebill.extendData.bodyItemId,
            receiptDate: receivebill.extendData.bodyItemPubts,
            totalprice: receivebill.extendData.bodyItemOriTaxIncludedAmount,
            homeAmount: receivebill.extendData.bodyItemLocalTaxIncludedAmount,
            receiptType: receiptType,
            status: 1
          };
          rows = new Array();
          rows.push(item);
          var crm_body = {
            objName: objName,
            rows: rows
          };
          //将数据推送给crm接口
          var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
        } else {
          throw new Error("接口取数错误！请检查接口参数");
        }
      } else {
        for (var i = 0; i < ys_receiptDetails_billDO.length; i++) {
          // 获取CRM订单id
          var orderCode = ys_receiptDetails_billDO[i].orderNo;
          //获取收款流水号->修改成明细的id
          var code = ys_receiptDetails_billDO[i].id;
          // 获取收款日期
          var receiptDate = receivebill.createTime;
          //获取收款金额
          var totalprice = ys_receiptDetails_billDO[i].oriTaxIncludedAmount;
          //获取本币金额
          var homeAmount = ys_receiptDetails_billDO[i].localTaxIncludedAmount;
          //获取收款方式
          var receiptType = receivebill.settleMode;
          if (receiptType == 1593134135044997284) {
            receiptType = "银行转账";
          } else if (receiptType == 1593134135044997285) {
            receiptType = "现金收付款";
          } else if (receiptType == 1593134135044997286) {
            receiptType = "现金返利";
          } else if (receiptType == 1593134135044997287) {
            receiptType = "票据结算";
          } else if (receiptType == 1593134135044997288) {
            receiptType = "支票结算";
          } else if (receiptType == 1593134135044997289) {
            receiptType = "退款转预收";
          }
          //设置传入参数
          let item = {
            orderCode: orderCode,
            code: code,
            receiptDate: receiptDate,
            totalprice: totalprice,
            homeAmount: homeAmount,
            receiptType: receiptType,
            status: 1
          };
          rows = new Array();
          rows.push(item);
          var crm_body = {
            objName: objName,
            rows: rows
          };
          //将数据推送给crm接口
          var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
        }
      }
      //将数据收款单数据推送到CRM
    }
    let result = "推送成功";
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });