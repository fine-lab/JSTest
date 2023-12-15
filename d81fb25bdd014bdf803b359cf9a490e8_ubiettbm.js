let AbstractAPIHandler = require("AbstractAPIHandler");
class DbMatchAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 赋值：返回一个key，assign 结果值
    let sources = request.sources; //条件数组
    let target = request.target; //结果项
    let assign = {};
    // 设置返回类型为脚本
    assign.returnType = "script";
    let accsource = null; // 会计主体id
    let toacctnosource = null; // 对方账号
    let toacctnamesource = null; // 对方户名
    let virtualnosource = null; // 银行对账单虚拟账号
    sources.filter((item) => {
      if ((item.code == "accentity") & (item.type == "cmp.bankreconciliation.BankReconciliation")) {
        accsource = item;
      }
      if ((item.code == "to_acct_no") & (item.type == "cmp.bankreconciliation.BankReconciliation")) {
        toacctnosource = item;
      }
      if ((item.code == "to_acct_name") & (item.type == "cmp.bankreconciliation.BankReconciliation")) {
        toacctnamesource = item;
      }
      if ((item.code == "characterDef.hk_yhxnzh") & (item.type == "cmp.bankreconciliation.BankReconciliation")) {
        virtualnosource = item;
      }
    });
    // 设置辨识执行状态
    assign.isrunidentify = true;
    // 设置单位辨识状态未辨识
    assign.oppositeidentifystatus = 0; //对方单位辨识状态
    let customerlist = null;
    let fields = null;
    let mdurl = null;
    let condition = null;
    let sql = null;
    if (accsource && accsource.value && toacctnamesource && toacctnamesource.value) {
      fields = " pk_RecCustomer,recCustomerName,payCustomerName "; // 查询pk_RecCustomer-三方协议客户代码 recCustomerName- 客户名称
      mdurl = " hik_fin_shared.hik_fin_shared.tri_agreement "; // 三方协议表
      condition = " where pk_RecCorp = '" + accsource.value + "' and  payCustomerName = '" + toacctnamesource.value + "'"; // 查询的条件
      sql = "select " + fields + " from " + mdurl + condition;
    }
    // 将返回的list数据进行处理
    if (customerlist !== null && customerlist.length > 0) {
      assign.oppositeidentifysource = "三方协议"; // 对方单位辨识来源
      let code = "";
      if (customerlist.length === 1) {
        assign.oppositetype = 1; //对方类型
        assign.oppositeidentifystatus = 1; //对方单位辨识状态
        assign.oppositeobjectname = customerlist[0].payCustomerName; // 对方单位名称
        assign.enteraccounttype = "客户"; // 入账方类型
        if (customerlist[0].pk_RecCustomer) {
          code = this.queryCustomerCodes(new Array(customerlist[0].pk_RecCustomer));
          assign.enteraccountcode = code; // 入账方编码
        }
        assign.enteraccountname = customerlist[0].recCustomerName; // 入账方名称
      } else {
        let pkCustArray = new Array();
        customerlist.forEach((item, index) => {
          pkCustArray.push(item.pk_RecCustomer);
        });
        if (pkCustArray.length > 0) {
          code = this.queryCustomerCodes(pkCustArray);
          assign.assistidentify = code; // 辅助辨识
        }
      }
      return { assign };
    }
    if (virtualnosource && virtualnosource.value) {
      fields = " pk_corp,pk_customer "; // 查询虚拟账户 pk_corp - 公司代码 pk_customer - 客户编码
      mdurl = " hik_fin_shared.hik_fin_shared.bd_virtualaccount "; // 虚拟账户表
      // 	银行对账单.对方账号 = 虚拟账户表.银行虚拟账号
      condition = " where virtualAccountNumber = '" + virtualnosource.value + "'"; // 查询的条件
      sql = "select " + fields + " from " + mdurl + condition;
    }
    // 将返回的list数据进行处理
    if (customerlist !== null && customerlist.length > 0) {
      assign.oppositeidentifysource = "虚拟账户"; //辨识来源
      let code = "";
      if (customerlist.length === 1) {
        assign.oppositetype = 1;
        assign.oppositeidentifystatus = 1; //对方单位辨识状态
        assign.enteraccounttype = "客户";
        // 对方编码和入账方编码 存字符串 根据pk_customer主键查询客户档案的编码
        if (customerlist[0].pk_customer) {
          code = this.queryCustomerCodes(new Array(customerlist[0].pk_customer));
          assign["characterDef.hk_dfbm"] = code; // 银行对账单.对方编码
          assign.enteraccountcode = code; // 入账方编码
        }
      } else {
        let pkCustArray = new Array();
        customerlist.forEach((item, index) => {
          pkCustArray.push(item.pk_customer);
        });
        if (pkCustArray.length > 0) {
          code = this.queryCustomerCodes(pkCustArray);
          assign.assistidentify = code;
        }
      }
      return { assign };
    }
    fields = " createOrg,merchantCharacter.hk_kfda_sfjxs,country,id,code,name,b.bankAccount,b.currency"; // 查询客户类型，编码，名称
    mdurl = " aa.merchant.Merchant left join aa.merchant.AgentFinancial b on id = b.merchantId  left join aa.merchant.MerchantApplyRange c on id = c.merchantId "; // 客户档案实体和银行信息做关联查询
    if (accsource && accsource.value && toacctnosource && toacctnosource.value) {
      condition = " where c.orgId = '" + accsource.value + "' and b.bankAccount= '" + toacctnosource.value + "'"; // 查询的条件
      sql = "select " + fields + " from " + mdurl + condition;
      customerlist = ObjectStore.queryByYonQL(sql);
    }
    if (accsource && accsource.value && toacctnamesource && toacctnamesource.value) {
      // 如果查询出来的客户档案为空，再根据对方户名查询客户档案信息
      if (customerlist == null || customerlist.length === 0) {
        condition = " where  c.orgId =  '" + accsource.value + "' and b.bankAccountName= '" + toacctnamesource.value + "'"; // 查询的条件
        sql = "select " + fields + " from " + mdurl + condition;
        customerlist = ObjectStore.queryByYonQL(sql);
      }
    }
    // 将返回的list数据进行处理
    assign.www = JSON.stringify(customerlist);
    if (customerlist !== null && customerlist.length > 0) {
      assign.oppositeidentifysource = "客户档案"; //辨识来源
      let code = "";
      if (customerlist.length === 1) {
        assign.oppositetype = 1;
        assign.oppositeidentifystatus = 1; //对方单位辨识状态
        assign.oppositeobjectid = customerlist[0].id;
        assign.oppositeobjectname = customerlist[0].name; // 对方单位名称
        assign["characterDef.hk_dfbm"] = customerlist[0].code; // 银行对账单.对方编码
        assign.enteraccounttype = "客户";
        assign.enteraccountcode = customerlist[0].code;
        assign.enteraccountname = customerlist[0].name;
        assign["characterDef.hk_sfjxs"] = customerlist[0].hk_kfda_sfjxs; // 是否经销商
        assign["characterDef.hk_gj"] = customerlist[0].country; // 国家
      } else {
        customerlist.forEach((item, index) => {
          code = code + "," + item.code;
        });
        if (code.length > 0) {
          code = code.substring(1);
          assign.assistidentify = code;
        }
      }
      return { assign };
    }
    fields = " org,id,code,name,b.account,b.currency"; // 查询客户类型，编码，名称
    mdurl = " aa.vendor.Vendor  left join aa.vendor.VendorBank b on id = b.vendor  left join aa.vendor.VendorOrg c on id = c.vendororg  "; // 客户档案实体和银行信息做关联查询
    if (accsource && accsource.value && toacctnosource && toacctnosource.value) {
      condition = " where c.org = '" + accsource.value + "' and b.account= '" + toacctnosource.value + "'"; // 查询的条件
      sql = "select " + fields + " from " + mdurl + condition;
      customerlist = ObjectStore.queryByYonQL(sql);
    }
    if (accsource && accsource.value && toacctnamesource && toacctnamesource.value) {
      // 如果查询出来的供货商信息为空，再根据对方户名查询供货商信息
      if (customerlist == null || customerlist.length === 0) {
        condition = " where c.org =  '" + accsource.value + "' and b.accountname= '" + toacctnamesource.value + "'"; // 查询的条件
        sql = "select " + fields + " from " + mdurl + condition;
        customerlist = ObjectStore.queryByYonQL(sql);
      }
    }
    // 将返回的list数据进行处理
    if (customerlist !== null && customerlist.length > 0) {
      assign.oppositeidentifysource = "供应商档案"; //辨识来源
      let code = "";
      if (customerlist.length === 1) {
        assign.oppositetype = 2;
        assign.oppositeidentifystatus = 1; //对方单位辨识状态
        assign.oppositeobjectid = customerlist[0].id;
        assign.oppositeobjectname = customerlist[0].name; // 对方单位名称
        assign["characterDef.hk_dfbm"] = customerlist[0].code; // 银行对账单.对方编码
        assign.enteraccounttype = "供应商";
        assign.enteraccountcode = customerlist[0].code;
        assign.enteraccountname = customerlist[0].name;
      } else {
        customerlist.forEach((item, index) => {
          code = code + "," + item.code;
        });
        if (code.length > 0) {
          code = code.substring(1);
          assign.assistidentify = code;
        }
      }
      return { assign };
    }
    return { assign };
  }
  // 根据主键查询客户档案的编码，多个值已“，”分开
  queryCustomerCodes(strArray) {
    let resultCodes = "";
    if (strArray == null || strArray.length == 0) {
      return null;
    }
    let insql = "";
    strArray.forEach((item, index) => {
      insql = insql + ",'" + item + "'";
    });
    if (insql.length > 0) {
      insql = insql.substring(1);
      let queryBsql = "select code,name from  aa.merchant.Merchant where id in ( " + insql + " ) ";
      let queryBlist = ObjectStore.queryByYonQL(queryBsql);
      if (queryBlist != null && queryBlist.length > 0) {
        strArray.forEach((item, index) => {
          if (index == 0) {
            resultCodes = item;
          } else {
            resultCodes = resultCodes + "," + item;
          }
        });
      }
    }
  }
}
exports({ entryPoint: DbMatchAPIHandler });