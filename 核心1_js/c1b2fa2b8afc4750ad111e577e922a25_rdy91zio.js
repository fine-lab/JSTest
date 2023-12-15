let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 解析数据获取销售订单详情
    let ids = request.order_ids;
    const appCode = "SCMSA";
    let salebillArray = new Array();
    //根据销售订单ID查询收款详情Url
    let salebillDetailUrl = "https://www.example.com/";
    for (let index = 0; index < ids.length; index++) {
      let saleId = {
        saleId: ids[index]
      };
      let tempsalebillDetailUrl = salebillDetailUrl + "?id=" + ids[index];
      let response = JSON.parse(openLinker("GET", tempsalebillDetailUrl, appCode, null)).data;
      salebillArray.push(response);
    }
    //定义销售发票存储数组
    var ys_salesSlip = new Array();
    //获取crm的token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    const objName = "kpls";
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
    var crm_token = crm_token_link_value.access_token;
    //获取销售发票的相关数据
    for (let salebill of salebillArray) {
      var other = salebill;
      var other_value = other.saleInvoiceDetails;
      //查询blueInvId
      let blue_id = other_value.blueInvDetailId;
      //获取开票日期
      var ys_date_value = other.vouchdate;
      var acceptDate = new Date(ys_date_value);
      var seperator1 = "-";
      var year = acceptDate.getFullYear();
      var month = acceptDate.getMonth() + 1;
      var strDate = acceptDate.getDate() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      //判断增值税类型
      var invoiceType = other.bdInvoiceTypeId;
      var invoice = "";
      if (invoiceType == 4) {
        invoice = 1;
      } else if (invoiceType == 3) {
        invoice = 2;
      } else if (invoiceType == 0) {
        invoice = 5;
      } else if (invoiceType == 3200) {
        invoice = 4;
      }
      //获取发票描述
      var remark = other.saleInvoiceDefineCharacter.ICE00302_name;
      //定义crm接口数据
      var crm_header = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + crm_token
      };
      let bill_status = 1;
      if (other.invDirection == 1) {
        bill_status = 2;
      }
      //遍历ys子表的数据
      for (let i = 0; i < other_value.length; i++) {
        let item = {
          invoiceType: invoice, //发票类型   （发票类型）
          code: other_value[i].blueInvDetailId,
          orderCode: other_value[i].orderNo, //crm订单id
          invoiceDate: currentdate, //开票日期         （单据日期）
          totalPrice: 0 - other_value[i].oriSum, //开票总金额        （主表-含税金额）
          number: 0 - other_value[i].qty, //数量                    （数量？计价数量?)   （qty）
          homeAmount: 0 - other_value[i].natSum, //本币含税金额		(含税金额）（oriSum）
          remark: remark, //发票描述	               //
          company: other.orgName, //乙方开票公司    （开票组织）（orgName）
          status: bill_status
        };
        var rows = new Array();
        rows.push(item);
        var crm_body = {
          objName: objName,
          rows: rows
        };
        console.log(JSON.stringify(crm_body));
        //将数据推送给crm接口
        var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
        console.log(crm_link);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });