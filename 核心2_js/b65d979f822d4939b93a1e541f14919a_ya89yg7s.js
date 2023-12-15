let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.ids;
    let len = ids.length;
    var msgs = [];
    for (let i = 0; i < len; i++) {
      var id = ids[i];
      //根据凭证集成的id查询
      var Sql = "select flag,yspzid from AT19D33B7809D80002.AT19D33B7809D80002.cxpzjc01 where id =" + "'" + id + "'";
      var res = ObjectStore.queryByYonQL(Sql);
      var yspzid = res[0]["yspzid"];
      var flag = res[0]["flag"];
      if (flag === "是") {
        msgs.push(yspzid + "已同步。");
        continue;
      } else {
        var sql = "select billCode,makeTime,accBook.name from egl.voucher.VoucherBO where id =" + yspzid;
        var Voucher_res = ObjectStore.queryByYonQL(sql, "fiegl");
        var Axml =
          "<soapenv:Envelope xmlns:soapenv='https://www.example.com/' xmlns:urn='urn:sap-com:document:sap:rfc:functions'><soapenv:Header/><soapenv:Body><urn:ZFI_CXYY_INT_DOC_POST>";
        var Bxml = "<IS_TEST></IS_TEST><I_MOD></I_MOD>";
        //唯一ID、必填
        var ROW_ID = yspzid + "_" + Math.round(new Date() / 1000);
        //凭证标题的内部参考码
        var XREF1_HD = Voucher_res[0]["billCode"];
        //公司代码、必填
        var accBook_name = Voucher_res[0]["accBook_name"];
        var BUKRS = "";
        if (accBook_name == "杭州赤霄科技有限公司") {
          BUKRS = "1SR0";
        } else if (accBook_name == "浙江赤霄智能检测技术有限公司") {
          BUKRS = "1U00";
        } else if (accBook_name == "浙江湖州赤霄科技有限公司") {
          BUKRS = "1U10";
        }
        var ddate = substring(Voucher_res[0]["makeTime"], 0, 10);
        //凭证中的凭证日期、必填
        var BLDAT = ddate;
        //凭证中的过账日期、必填
        var BUDAT = ddate;
        //凭证类型、必填
        var BLART = "SA";
        //货币码、必填
        var WAERS = "CNY";
        //用户名、必填
        var USNAM = "HSC";
        var Cxml =
          "<TAB_HEADER><item><ROW_ID>" +
          ROW_ID +
          "</ROW_ID><XREF1_HD>" +
          XREF1_HD +
          "</XREF1_HD><BUKRS>" +
          BUKRS +
          "</BUKRS><BLDAT>" +
          BLDAT +
          "</BLDAT><BUDAT>" +
          BUDAT +
          "</BUDAT><BLART>" +
          BLART +
          "</BLART><WAERS>" +
          WAERS +
          "</WAERS><USNAM>" +
          USNAM +
          "</USNAM></item></TAB_HEADER>";
        var bodyxml = "";
        var bodyxmls = "";
        var sql =
          "select id,accSubject,debitOriginal,creditOriginal,accSubject.code,Auxiliary.vr1,Auxiliary.vr2,Auxiliary.vr4,Auxiliary.vr5 from egl.voucher.VoucherBodyBO left join egl.voucher.AuxiliaryBO Auxiliary on Auxiliary.id = auxiliaryId where voucherId = " +
          yspzid;
        var VoucherBody_res = ObjectStore.queryByYonQL(sql, "fiegl");
        for (let i = 0; i < VoucherBody_res.length; i++) {
          var rowno = "";
          if (i >= 0 && i < 10) {
            rowno = "00" + (i + 1);
          } else if (i >= 10 && i < 100) {
            rowno = "0" + (i + 1);
          } else if (i >= 100 && i < 1000) {
            rowno = i + 1;
          }
          //分录行号
          var BUZEI = rowno;
          var accSubject = VoucherBody_res[i]["accSubject"] == undefined ? "" : VoucherBody_res[i]["accSubject"];
          var sql = "select character.*,id from epub.subjectversion.AccsubjectVersion where id =" + accSubject;
          var AccsubjectVersion_res = ObjectStore.queryByYonQL(sql, "fiepub");
          //科目类型
          var ACC_TYPE = AccsubjectVersion_res[0]["character_km01"] == undefined ? "" : AccsubjectVersion_res[0]["character_km01"];
          //借贷方标识
          var SHKZG = "";
          //借方金额
          var debitOriginal = VoucherBody_res[i]["debitOriginal"];
          //贷方金额
          var creditOriginal = VoucherBody_res[i]["creditOriginal"];
          //凭证货币金额
          var WRBTR = "";
          //按本位币计的金额
          var DMBTR = "";
          if (debitOriginal > 0) {
            SHKZG = "S";
            //凭证货币金额
            WRBTR = debitOriginal;
            //按本位币计的金额
            DMBTR = debitOriginal;
          } else {
            SHKZG = "H";
            //凭证货币金额
            WRBTR = creditOriginal;
            //按本位币计的金额
            DMBTR = creditOriginal;
          }
          //记账代码
          var BSCHL = AccsubjectVersion_res[0]["character_km02"] == undefined ? "" : AccsubjectVersion_res[0]["character_km02"];
          //总账分类帐账目 - 如辅助核算中有供应商或客户辅助核算的，传供应商编码或客户编码。如果没有客户、供应商辅助核算，则传科目编码；特征编码： km03    特征名称：SAP科目编码
          var HKONT = "";
          //成本中心
          var KOSTL = "";
          //利润中心
          var PRCTR = "";
          //付款原因代码
          var RSTGR = "";
          let body = {
            voucher: yspzid
          };
          let url = "https://www.example.com/";
          let apiResponse = openLinker("POST", url, "AT19D33B7809D80002", JSON.stringify(body));
          const obj = JSON.parse(apiResponse);
          for (let j = 0; j < obj["data"]["list"].length; j++) {
            if (obj["data"]["list"][j]["voucherrecord"] == VoucherBody_res[i]["id"]) {
              RSTGR = obj["data"]["list"][j]["cashflowitem"]["code"];
            }
          }
          //分配编号-辅助核算项目编码
          var ZUONR = "";
          //业务伙伴参考码-辅助核算客户、供应商编码
          var XREF2 = "";
          var sql = "select dimensionext.name from epub.subjectversion.AccSubjectMultiDimensionExtVersion where accsubject=" + accSubject;
          var AccSubjectMultiDimensionExtVersion_res = ObjectStore.queryByYonQL(sql, "fiepub");
          HKONT = AccsubjectVersion_res[0]["character_km03"] == undefined ? "" : AccsubjectVersion_res[0]["character_km03"];
          if (AccSubjectMultiDimensionExtVersion_res.length == 0) {
            HKONT = AccsubjectVersion_res[0]["character_km03"] == undefined ? "" : AccsubjectVersion_res[0]["character_km03"];
          } else {
            for (let k = 0; k < AccSubjectMultiDimensionExtVersion_res.length; k++) {
              if (AccSubjectMultiDimensionExtVersion_res[k]["dimensionext_name"] == "项目") {
                let body = {};
                let url = "https://www.example.com/" + VoucherBody_res[i]["Auxiliary_vr2"];
                let apiResponse = openLinker("Get", url, "AT19D33B7809D80002", JSON.stringify(body));
                if (apiResponse.length > 0) {
                  const obj = JSON.parse(apiResponse);
                  ZUONR = obj["data"]["code"];
                }
              } else if (AccSubjectMultiDimensionExtVersion_res[k]["dimensionext_name"] == "部门") {
                let body = {};
                let url = "https://www.example.com/" + VoucherBody_res[i]["Auxiliary_vr1"];
                let apiResponse = openLinker("Get", url, "AT19D33B7809D80002", JSON.stringify(body));
                if (apiResponse.length > 0) {
                  const obj = JSON.parse(apiResponse);
                  KOSTL = obj["data"]["deptdefinefeature"]["bm01"] == undefined ? "" : obj["data"]["deptdefinefeature"]["bm01"];
                  PRCTR = obj["data"]["deptdefinefeature"]["bm02"] == undefined ? "" : obj["data"]["deptdefinefeature"]["bm02"];
                }
              } else if (AccSubjectMultiDimensionExtVersion_res[k]["dimensionext_name"] == "客户") {
                let body = {};
                let url = "https://www.example.com/" + VoucherBody_res[i]["Auxiliary_vr5"];
                let apiResponse = openLinker("Get", url, "AT19D33B7809D80002", JSON.stringify(body));
                if (apiResponse.length > 0) {
                  const obj = JSON.parse(apiResponse);
                  HKONT = obj["data"]["code"];
                  XREF2 = obj["data"]["code"];
                }
              } else if (AccSubjectMultiDimensionExtVersion_res[k]["dimensionext_name"] == "供应商") {
                let body = {};
                let url = "https://www.example.com/" + VoucherBody_res[i]["Auxiliary_vr4"];
                let apiResponse = openLinker("Get", url, "AT19D33B7809D80002", JSON.stringify(body));
                if (apiResponse.length > 0) {
                  const obj = JSON.parse(apiResponse);
                  HKONT = obj["data"]["code"];
                  XREF2 = obj["data"]["code"];
                }
              }
            }
          }
          //特别总/分类帐指示符
          var UMSKZ = AccsubjectVersion_res[0]["character_km04"] == undefined ? "" : AccsubjectVersion_res[0]["character_km04"];
          //用于到期日计算的基准日期-凭证的制单日期
          var ZFBDT = ddate;
          //用于到期日计算的基准日期-凭证的制单日期
          var ZBASE_DATE = ddate;
          bodyxml =
            "<item><BUZEI>" +
            BUZEI +
            "</BUZEI><ACC_TYPE>" +
            ACC_TYPE +
            "</ACC_TYPE><SHKZG>" +
            SHKZG +
            "</SHKZG><BSCHL>" +
            BSCHL +
            "</BSCHL><HKONT>" +
            HKONT +
            "</HKONT><UMSKZ>" +
            UMSKZ +
            "</UMSKZ><KOSTL>" +
            KOSTL +
            "</KOSTL><PRCTR>" +
            PRCTR +
            "</PRCTR><RSTGR>" +
            RSTGR +
            "</RSTGR><WRBTR>" +
            WRBTR +
            "</WRBTR><DMBTR>" +
            DMBTR +
            "</DMBTR><ZFBDT>" +
            ZFBDT +
            "</ZFBDT><ZBASE_DATE>" +
            ZBASE_DATE +
            "</ZBASE_DATE><ZUONR>" +
            ZUONR +
            "</ZUONR><XREF2>" +
            XREF2 +
            "</XREF2></item>";
          bodyxmls += bodyxml;
        }
        var Dxml = "<TAB_ITEMS>" + bodyxmls + "</TAB_ITEMS>";
        var Exml = "<TAB_RETURN><item></item></TAB_RETURN>";
        var Fxml = "</urn:ZFI_CXYY_INT_DOC_POST></soapenv:Body></soapenv:Envelope>";
        var xmlString = Axml + Bxml + Cxml + Dxml + Exml + Fxml;
        let url = "https://www.example.com/";
        let header = {
          "Content-Type": "text/xml;charset=UTF-8"
        };
        let strResponse = postman("post", url, "xml", JSON.stringify(header), xmlString);
        var jsonString = xml2json(strResponse);
        const obj = JSON.parse(jsonString);
        let FLAG = obj["SOAP-ENV:Body"]["urn:ZFI_CXYY_INT_DOC_POST.Response"]["TAB_RETURN"]["item"]["FLAG"];
        let MESSAGE = obj["SOAP-ENV:Body"]["urn:ZFI_CXYY_INT_DOC_POST.Response"]["TAB_RETURN"]["item"]["MESSAGE"];
        if (FLAG == "E") {
          msgs.push("YS凭证id:" + yspzid + ",同步失败,错误信息:" + MESSAGE);
        } else {
          let sappzno = obj["SOAP-ENV:Body"]["urn:ZFI_CXYY_INT_DOC_POST.Response"]["TAB_RETURN"]["item"]["BELNR"];
          var object = { id: id, flag: "是", sappzno: sappzno, sendsapid: ROW_ID, _status: "Update" };
          var res = ObjectStore.updateById("AT19D33B7809D80002.AT19D33B7809D80002.cxpzjc01", object, "cxpzjc01");
          msgs.push("凭证id:" + yspzid + ",同步成功。");
        }
      }
    }
    return { rs: msgs };
  }
}
exports({ entryPoint: MyAPIHandler });