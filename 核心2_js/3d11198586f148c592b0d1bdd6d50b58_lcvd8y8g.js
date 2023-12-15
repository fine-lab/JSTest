let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var list = JSON.stringify(param.data);
    var data = param.data[0];
    var shuilv = "";
    if (data["merchantAppliedDetail!taxRate"] !== undefined) {
      var shuilvsql = "select * from bd.taxrate.TaxRateVO where id = '" + data["merchantAppliedDetail!taxRate"] + "'";
      var resshuilv = ObjectStore.queryByYonQL(shuilvsql, "ucfbasedoc");
      shuilv = resshuilv[0].code;
    }
    //银行信息
    var yinghang = data.merchantAgentFinancialInfos;
    var BANK;
    var yinh;
    var yh = [];
    for (var i in yinghang) {
      var value = yinghang[i];
      BANK = {
        CURRENCY: "CNY",
        BANK_STATUS: value.stopstatus,
        BANK_COUNTRY: value.country_name,
        BANK_NAME: value.bank_name,
        BRANCH_NAME: value.openBank_name,
        BANK_ACCOUNT_NAME: value.bankAccountName,
        BANK_ACCOUNT_NUM: value.bankAccount
      };
      yinh = JSON.stringify(BANK);
      yh.push(yinh);
    }
    //地址信息
    var address1 = data.merchantAddressInfos;
    var fapiaoxx = data.merchantAgentInvoiceInfos;
    var dizhi;
    var dz;
    var diz = [];
    var fapiao;
    var fp;
    var fap = [];
    let bb = fapiaoxx[0].id;
    let bb2 = bb.toString();
    if (address1[0].address === fapiaoxx[0].address.zh_CN) {
      for (var j = 0; j < address1.length; j++) {
        let value = address1[j];
        let dd = value.id;
        let dd2 = dd.toString();
        dizhi = {
          ORG_CODE: "HHS",
          COUNTRY: data.country_code,
          PROVINCE: substring(value.mergerName, 0, 3),
          CITY: substring(value.mergerName, 3, 6),
          STATE: substring(value.mergerName, 6, 9),
          STATUS: value.stopstatus,
          ADDRESS1: value.address,
          TAX_CODE: shuilv,
          SITE_USES: [
            {
              SITE_USES_CODE: "收货方",
              LOCATION: dd2,
              PRIMARY_FLAG: "Y",
              USER_STATUS: "A",
              PRIMARY_SALESREP: " ",
              PAYMENT_TERM_NAME: " "
            },
            {
              SITE_USES_CODE: "收单方",
              LOCATION: bb2,
              PRIMARY_FLAG: "Y",
              USER_STATUS: "A",
              PRIMARY_SALESREP: " ",
              PAYMENT_TERM_NAME: " "
            }
          ]
        };
        dz = JSON.stringify(dizhi);
        diz.push(dz);
      }
      throw new Error(diz);
    }
    if (address1 === null) {
      dizhi = {};
      dz = JSON.stringify(dizhi);
      diz.push(dz);
      throw new Error("地址信息必填");
    }
    if (address1 !== null) {
      for (var j = 0; j < address1.length; j++) {
        let value = address1[j];
        let dd = value.id;
        let dd2 = dd.toString();
        dizhi = {
          ORG_CODE: "HHS",
          COUNTRY: data.country_code,
          PROVINCE: substring(value.mergerName, 0, 3),
          CITY: substring(value.mergerName, 3, 6),
          STATE: substring(value.mergerName, 6, 9),
          STATUS: value.stopstatus,
          ADDRESS1: value.address,
          TAX_CODE: shuilv,
          SITE_USES: [
            {
              SITE_USES_CODE: "收货方",
              LOCATION: dd2,
              PRIMARY_FLAG: "Y",
              USER_STATUS: "A",
              PRIMARY_SALESREP: " ",
              PAYMENT_TERM_NAME: " "
            }
          ]
        };
        dz = JSON.stringify(dizhi);
        diz.push(dz);
      }
    }
    //发票信息
    if (fapiaoxx === undefined) {
      throw new Error("发票地址信息必填");
      fapiao = {};
      fp = JSON.stringify(fapiao);
      fap.push(fp);
    }
    if (fapiaoxx !== undefined) {
      for (var h = 0; h < fapiaoxx.length; h++) {
        let value = fapiaoxx[h];
        let dd = value.id;
        let dd2 = dd.toString();
        let sheng = substring(value.address.zh_CN, 0, 3);
        let shi = substring(value.address.zh_CN, 3, 6);
        let qu = substring(value.address.zh_CN, 6, 9);
        fapiao = {
          ORG_CODE: "HHS",
          COUNTRY: data.country_code,
          PROVINCE: sheng,
          CITY: shi,
          STATE: qu,
          STATUS: value.stopstatus,
          ADDRESS1: value.address.zh_CN,
          TAX_CODE: shuilv,
          SITE_USES: [
            {
              SITE_USES_CODE: "收单方",
              LOCATION: dd2,
              PRIMARY_FLAG: "Y",
              USER_STATUS: "A",
              PRIMARY_SALESREP: " ",
              PAYMENT_TERM_NAME: " "
            }
          ]
        };
        fp = JSON.stringify(fapiao);
        fap.push(fp);
      }
    }
    //联系人信息
    var persons = data.merchantContacterInfos;
    var lianxiren;
    var lxr;
    var lianxr = [];
    for (var g in persons) {
      var value3 = persons[g];
      lianxiren = {
        PERSON_FIRST_NAME: value3.fullName,
        PHONE_NUMBER: value3.mobile
      };
      lxr = JSON.stringify(lianxiren);
      lianxr.push(lxr);
    }
    //信息体
    let body =
      '<soap:Envelope xmlns:soap="https://www.example.com/">' +
      '<soap:Header xmlns:ns1="https://www.example.com/">' +
      '<wsse:Security soap:mustUnderstand="1" xmlns:wsse="https://www.example.com/" xmlns="https://www.example.com/" xmlns:env="https://www.example.com/">' +
      "<wsse:UsernameToken>" +
      "<wsse:Username>ASADMIN</wsse:Username>" +
      '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">welcome1</wsse:Password>' +
      "</wsse:UsernameToken>" +
      "</wsse:Security>" +
      "</soap:Header>" +
      '<soap:Body xmlns:ns2="https://www.example.com/">' +
      "<ns2:InputParameters>" +
      "<ns2:PV_CLOB>" +
      "<![CDATA[" +
      "<p_intf_name>CUST</p_intf_name>" +
      "<p_request_data>[" +
      "{" +
      '"ACCOUNT_NUMBER": "' +
      data.code +
      '",' +
      '"ORGANIZATION_NAME": "' +
      data.name.zh_CN +
      '",' +
      '"CUSTOMER_TYPE": "' +
      data.transType_Name +
      '",' +
      '"TAX_REFERENCE": "",' +
      '"CREDIT": "120",' +
      '"STATUS": "A",' +
      '"BANK":[' +
      yh +
      "]," +
      '"CUSTOMER_SITES": [';
    body = body + diz + "," + fap;
    body = body + "]," + '"PERSON":[' + lianxr + "]" + "}" + "]" + "</p_request_data>" + "  ]]>" + "</ns2:PV_CLOB>" + "</ns2:InputParameters>" + "</soap:Body>" + "</soap:Envelope>";
    //信息头
    let header = {
      "Content-Type": "text/xml;charset=UTF-8"
    };
    throw new Error(body);
    var parmaXML = {
      xmlData: body
    };
    var url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "test_XXX", JSON.stringify(parmaXML));
    var returndata = apiResponse.substring(apiResponse.indexOf("<XC_OUT_DATA>") + 1311, apiResponse.indexOf("</XC_OUT_DATA>"));
    if (apiResponse.indexOf("处理成功") == -1) {
      throw new Error(returndata);
    }
  }
}
exports({
  entryPoint: MyTrigger
});