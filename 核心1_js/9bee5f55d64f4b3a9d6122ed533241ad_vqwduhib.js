let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sqlWhere = "where 1=1 ";
    //销售组织
    if (request.salesOrgId != undefined) {
      sqlWhere = sqlWhere + "and orgId = '" + request.salesOrgId + "' ";
    }
    //单据日期
    //判断对象类型
    if (request.agentId != undefined || request.settlementOrgId != undefined) {
      //开始对象类型判断
      sqlWhere = sqlWhere + "and (";
      //对象域 sql
      var dxySql = "select group_concat(targetDomainId) from marketing.credit.CreditTargetDomainItem where 1=1 and (";
      //客户
      if (request.agentId != undefined) {
        sqlWhere = sqlWhere + "(targetType = 0 and targetObjId = '" + request.agentId + "') or ";
        dxySql = dxySql + "(agentId = '" + request.agentId + "' and settlementOrgId is null and saleOrgId is null and departmentId is null and stockOrgId is null) or ";
      }
      //开票组织
      if (request.settlementOrgId != undefined) {
        sqlWhere = sqlWhere + "(targetType = 2 and targetObjId = '" + request.settlementOrgId + "') or ";
        dxySql = dxySql + "(settlementOrgId = '" + request.settlementOrgId + "' and agentId is null and saleOrgId is null and departmentId is null and stockOrgId is null) or ";
      }
      if (request.settlementOrgId != undefined && request.agentId != undefined) {
        dxySql = dxySql + "(settlementOrgId = '" + request.settlementOrgId + "' and agentId = '" + request.agentId + "' and saleOrgId is null and departmentId is null and stockOrgId is null) or ";
      }
      //对象域sql 拼接结束
      dxySql = substring(dxySql, 0, dxySql.length - 3) + ")";
      var sql22 = "select * from marketing.credit.CreditTargetDomain limit 10";
      var res1 = ObjectStore.queryByYonQL(dxySql, "marketingbill");
      if (res1.length > 0) {
        sqlWhere = sqlWhere + "(targetType = 4 and targetObjId in (" + res1[0].targetDomainId + ")) or ";
      }
      //结束对象类型判断
      sqlWhere = substring(sqlWhere, 0, sqlWhere.length - 3) + ")";
    }
    var sql2 = "select * from marketing.credit.CreditReceivableHistory " + sqlWhere;
    var res2 = ObjectStore.queryByYonQL(sql2, "marketingbill");
    var arr = new Array();
    for (var i = 0; i < res2.length; i++) {
      var obj = {};
      obj.orgId = res2[i].orgId; //授信组织id
      obj.properties = res2[i].properties;
      if (res2[i].properties && (request.orderDefineCharacter__XSDD001 || request.orderDefineCharacter__XSDD002 || request.orderDefineCharacter__XSDD003 || request.orderDefineCharacter__XSDD003)) {
        //销售办公室
        if (request.orderDefineCharacter__XSDD001 && res2[i].properties.XSDD001 && request.orderDefineCharacter__XSDD001 != res2[i].properties.XSDD001) {
          continue;
        }
        //销售渠道
        if (request.orderDefineCharacter__XSDD002 && res2[i].properties.XSDD002 && request.orderDefineCharacter__XSDD002 != res2[i].properties.XSDD002) {
          continue;
        }
        //销售组
        if (request.orderDefineCharacter__XSDD003 && res2[i].properties.XSDD003 && request.orderDefineCharacter__XSDD003 != res2[i].properties.XSDD003) {
          continue;
        }
        //销售机构
        if (request.orderDefineCharacter__XXJG && res2[i].properties.XXJG && request.orderDefineCharacter__XXJG != res2[i].properties.XXJG) {
          continue;
        }
        //销售办公室
        if (request.orderDefineCharacter__XSDD001 && res2[i].properties.XSDD001 && request.orderDefineCharacter__XSDD001 == res2[i].properties.XSDD001) {
          obj.XSDD001 = res2[i].properties.XSDD001;
        }
        //销售渠道
        if (request.orderDefineCharacter__XSDD002 && res2[i].properties.XSDD002 && request.orderDefineCharacter__XSDD002 == res2[i].properties.XSDD002) {
          obj.XSDD002 = res2[i].properties.XSDD002;
        }
        //销售组
        if (request.orderDefineCharacter__XSDD003 && res2[i].properties.XSDD003 && request.orderDefineCharacter__XSDD003 == res2[i].properties.XSDD003) {
          obj.XSDD003 = res2[i].properties.XSDD003;
        }
        //销售机构
        if (request.orderDefineCharacter__XXJG && res2[i].properties.XXJG && request.orderDefineCharacter__XXJG == res2[i].properties.XXJG) {
          obj.XXJG = res2[i].properties.XXJG;
        }
      }
      //查询组织
      var sql3 = "select * from org.func.BaseOrg where orgid = '" + obj.orgId + "'";
      var res3 = ObjectStore.queryByYonQL(sql3, "orgcenter");
      if (res3.length > 0) {
        obj.orgName = res3[0].name; //授信组织名称
      }
      obj.targetType = res2[i].targetType; //授信类型
      if (obj.targetType == 0) {
        obj.targetTypeName = "客户";
        obj.targetObjId = res2[i].targetObjId; //信用对象id
        //查询客户
        var sql4 = "select * from aa.merchant.Merchant where id = '" + obj.targetObjId + "'";
        var res4 = ObjectStore.queryByYonQL(sql4, "productcenter");
        if (res4.length > 0) {
          obj.targetObjName = res4[0].name; //信用对象名称
        }
      } else if (obj.targetType == 2) {
        obj.targetTypeName = "会计主体";
      } else if (obj.targetType == 3) {
        obj.targetTypeName = "销售部门";
      } else if (obj.targetType == 4) {
        obj.targetTypeName = "对象域";
      }
      obj.currencyName = res2[i].currencyName; //币种名称
      obj.createDate = res2[i].createDate; //信用余额日期
      obj.creditBalance = res2[i].creditBalance; //信用余额
      obj.orderReceivable = res2[i].orderReceivable; //订单应收
      obj.businessReceivable = res2[i].businessReceivable; //业务应收
      obj.financeReceivable = res2[i].financeReceivable; //财务应收
      obj.unVerificationReceivable = res2[i].unVerificationReceivable; //未核销收款
      obj.creditLine = res2[i].creditLine; //信用额度
      if (obj.creditLine == 0) {
        obj.syzb = "NA"; //剩余占比
      } else {
        let creditBalance = new Big(obj.creditBalance);
        let creditLine = new Big(obj.creditLine);
        let syzb = creditBalance.div(creditLine);
        obj.syzb = MoneyFormatReturnBd(syzb, 2); //剩余占比
      }
      obj.controlScope = res2[i].controlScope; //控制范围
      obj.controlDomainId = res2[i].controlDomainId; //范围域id
      //查询组织
      var sql5 = "select * from org.func.BaseOrg where orgid = '" + obj.controlDomainId + "'";
      var res5 = ObjectStore.queryByYonQL(sql5, "orgcenter");
      if (res5.length > 0) {
        obj.controlDomainName = res5[0].name; //范围域名称
      }
      obj.currencyMatchType = res2[i].currencyMatchType; //币种汇率策略
      obj.excRateTypeId = res2[i].excRateTypeId; //汇率类型
      //查询汇率类型
      obj.startDate = res2[i].startDate; //起始日期
      obj.endDate = res2[i].endDate; //截止日期
      //计算逾期天数
      var endDate = new Date(obj.endDate);
      var nowDate = new Date();
      if (nowDate.getTime() > endDate.getTime()) {
        var dateInt = nowDate.getTime() - endDate.getTime();
        var dayInt = parseInt(dateInt / (24 * 60 * 60));
        obj.dayInt = dayInt; //逾期天数
      } else {
        obj.dayInt = 0; //逾期天数
      }
      obj.containSub = res2[i].containSub; //包含下级
      obj.creditExtDomainId = res2[i].creditExtDomainId; //扩展域
      obj.checkRuleId = res2[i].checkRuleId; //信用检查规则id
      //查询信用检查规则
      var sql7 = "select * from marketing.credit.CreditCheckRule where id = '" + obj.checkRuleId + "'";
      var res7 = ObjectStore.queryByYonQL(sql7, "marketingbill");
      if (res7.length > 0) {
        obj.checkRuleName = res7[0].name; //信用检查规则名称
      }
      obj.quotaRuleId = res2[i].quotaRuleId; //额度占用规则id
      //查询额度占用规则
      var sql8 = "select * from marketing.credit.CreditQuotaRule where id = '" + obj.quotaRuleId + "'";
      var res8 = ObjectStore.queryByYonQL(sql8, "marketingbill");
      if (res8.length > 0) {
        obj.quotaRuleName = res8[0].name; //额度占用规则名称
      }
      arr[arr.length] = obj;
    }
    return { dataArr: arr };
  }
}
exports({ entryPoint: MyAPIHandler });