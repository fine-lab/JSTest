let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //当前日期 年月日
    let updateTime = new Date();
    let ym = "";
    if (request.synDate != null && request.synDate != "" && request.synDate != undefined) {
      ym = request.synDate;
    } else {
      ym = updateTime.getFullYear() + "-" + getZero(updateTime.getMonth() + 1);
    }
    let successList = [];
    let jdyBody = {
      app_id: "youridHere",
      entry_id: "youridHere",
      filter: {
        rel: "and",
        cond: [
          {
            field: "flowState",
            type: "flowState",
            method: "eq",
            value: 1
          },
          {
            field: "_widget_1671177286863",
            type: "text",
            method: "eq",
            value: 0
          },
          {
            field: "updateTime",
            method: "eq",
            value: ym
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-12"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-11"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-10"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-09"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-08"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-07"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-06"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-05"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-04"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-03"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-02"
          },
          {
            field: "createTime", //日期
            method: "ne",
            type: "text",
            value: "2022-01"
          }
        ]
      }
    };
    let jdyHeader = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer SlOGnl1vjjdngNsqg0b9YmRt36yuIPfD"
    };
    let jdyObj = postman("post", "https://www.example.com/", JSON.stringify(jdyHeader), JSON.stringify(jdyBody));
    let dataList = JSON.parse(jdyObj).data;
    let ysBody = {};
    for (let i in dataList) {
      let jkdh = dataList[i]._widget_1666687251919; //个人借款单号
      let dataMap = {};
      let loanbillbvosMap = {};
      let loansettleinfovosMap = {};
      let loanbillbvos = [];
      let loansettleinfovos = [];
      dataMap.resubmitCheckKey = getSubKey(dataList[i]._widget_1666687251919); //幂等性
      dataMap.dcostdate = substring(dataList[i].createTime, 0, 10); //发生日期(格式：yyyy-MM-dd)
      dataMap.vouchdate = substring(dataList[i].createTime, 0, 10); //单据日期(格式：yyyy-MM-dd)
      if (dataList[i]._widget_1670379914678 == null || dataList[i]._widget_1670379914678 == "") {
        // 可以弹出具体的信息（类似前端函数的alert）
        throw jkdh + "费用承担组织为空！";
      }
      dataMap.cfinaceorg = dataList[i]._widget_1670379914678; //费用承担组织(支持id和code)
      if (dataList[i]._widget_1671412741430 == null || dataList[i]._widget_1671412741430 == "") {
        throw jkdh + "费用承担部门为空！";
      }
      dataMap.vfinacedeptid = dataList[i]._widget_1671412741430; //费用承担部门(支持id和code)
      if (dataList[i]._widget_1670379914678 == null || dataList[i]._widget_1670379914678 == "") {
        throw jkdh + "会计主体为空！";
      }
      dataMap.caccountorg = dataList[i]._widget_1670379914678; //会计主体(支持id和code)
      dataMap.bustype = "1613237957585010694"; //交易类型(支持id和code)
      if (dataList[i]._widget_1666686679664.name == null || dataList[i]._widget_1666686679664.name == "") {
        throw jkdh + "借款人为空！";
      }
      //获取借款人编码
      let jkrName = { name: dataList[i]._widget_1666686679664.name };
      let func = extrequire("AT1672920C08100005.backDesignerFunction.getPerson");
      let resJkr = func.execute(jkrName);
      dataMap.pk_handlepsn = resJkr.id; //借款人(支持id和code)
      if (dataMap.pk_handlepsn == null || dataMap.pk_handlepsn == "") {
        throw jkdh + "未查询到借款人信息！";
      }
      dataMap.code = dataList[i]._widget_1666687251919; //个人借款单号
      dataMap.creator = "黄畅";
      dataMap.creatorId = "yourIdHere"; //创建人固定财务黄畅
      dataMap.vcurrency = "CNY"; //借款币种(支持id和code)
      dataMap.vnatcurrency = "CNY"; //组织本币(支持id和code)
      dataMap.vnatexchratetype = "jax4ut3h"; //汇率类型(支持id和code)
      dataMap.dnatexchratedate = substring(dataList[i].createTime, 0, 10); //汇率日期(格式：yyyy-MM-dd)
      dataMap.nnatbaseexchrate = 1; //基准汇率
      dataMap.nnatexchrate = 1; //汇率
      dataMap.nnatloanmny = dataList[i]._widget_1666686679660; //借款金额-本币
      dataMap.vhandledeptid = resJkr.dept_id; //借款人部门(支持id和code)
      dataMap.chandleorg = resJkr.org_id; //借款人组织(支持id和code)
      dataMap.nloanmny = dataList[i]._widget_1666686679660; //借款金额
      dataMap.vreason = dataList[i]._widget_1666686679659; //借款原因
      dataMap._status = "Insert";
      loanbillbvosMap.pk_busimemo = "1618375958248554503"; //费用项目，固定JDY人借款单
      loanbillbvosMap.pk_handlepsn = resJkr.id; //借款人(支持id和code)
      loanbillbvosMap.vhandledeptid = resJkr.dept_id; //借款人部门(支持id和code)
      loanbillbvosMap.chandleorg = resJkr.org_id; //借款人组织(支持id和code)
      loanbillbvosMap.vnatcurrency = "CNY"; //组织本币(支持id和code)
      loanbillbvosMap.vnatexchratetype = "jax4ut3h"; //汇率类型(支持id和code)
      loanbillbvosMap.dnatexchratedate = substring(dataList[i].createTime, 0, 10); //汇率日期(格式：yyyy-MM-dd)
      loanbillbvosMap.vcurrency = "CNY"; //借款币种(支持id和code)
      loanbillbvosMap.caccountorg = dataList[i]._widget_1670379914678; //会计主体(支持id和code)
      loanbillbvosMap.cfinaceorg = dataList[i]._widget_1670379914678; //费用承担组织(支持id和code)
      loanbillbvosMap.vfinacedeptid = dataList[i]._widget_1671412741430; //费用承担部门(支持id和code)
      loanbillbvosMap.nnatbaseexchrate = 1; //基准汇率
      loanbillbvosMap.nnatexchrate = 1; //汇率
      loanbillbvosMap.nnatloanmny = dataList[i]._widget_1666686679660; //借款金额-本币
      loanbillbvosMap.nloanmny = dataList[i]._widget_1666686679660; //借款金额
      loanbillbvosMap._status = "Insert";
      loanbillbvos.push(loanbillbvosMap);
      loansettleinfovosMap.vbankaccount = "6214830123020546"; //收款方帐号
      loansettleinfovosMap.vbankaccname = dataList[i]._widget_1666686679664.name; //收款方户名(与收款方账号对应)
      loansettleinfovosMap.pk_bankdoc = "2581242459379036"; //收款方开户行
      loansettleinfovosMap.pk_banktype = "2572634551179777"; //收款方银行类别(支持id和code)
      loansettleinfovosMap.pk_handlepsnbank = "2581245261306112"; //借款人银行账户(支持id和编码)
      loansettleinfovosMap.pk_handlepsn = resJkr.id; //借款人(支持id和code)
      loansettleinfovosMap.centerpriseorg = dataList[i]._widget_1670379914678; //支付组织(支持id和code)
      loansettleinfovosMap.vcurrency = "CNY"; //借款币种(支持id和code)
      loansettleinfovosMap.vnatcurrency = "CNY"; //组织本币(支持id和code)
      loansettleinfovosMap.nnatexchrate = 1; //汇率
      loansettleinfovosMap.vsettlecurrency = "CNY"; //结算币种(支持id和code)
      loansettleinfovosMap.nsettleexchrate = 1; //汇率
      loansettleinfovosMap.nsummny = dataList[i]._widget_1666686679660; //借款金额
      loansettleinfovosMap.nsettlesummny = dataList[i]._widget_1666686679660; //期望收款金额
      loansettleinfovosMap.nnatsettlesummny = dataList[i]._widget_1666686679660; //结算金额-本币
      let bankCode = dataList[i]._widget_1676364234132; //获取简道云银行账户编码
      let bankName = dataList[i]._widget_1676364234130; //获取简道云银行账户名称
      //判断银行账户是否为空 为空设置为现金 否则设置银行转账
      if ((bankCode == "" || bankCode == null) && (bankName == "" || bankName == null)) {
        loansettleinfovosMap.pk_balatype = "2562748744751983"; //结算方式 2562748744751983：现金首付款
        loansettleinfovosMap.balatypesrvattr = "1"; //结算方式业务属性 1:现金业务
      } else {
        loansettleinfovosMap.pk_balatype = "2562748744751982"; //结算方式 2562748744751982：银行转账
        loansettleinfovosMap.balatypesrvattr = "0"; //结算方式业务属性 0:银行业务
        //根据银行账户名称和编码查询银行账户信息
        let bank = extrequire("AT1672920C08100005.publickApi.getBankInfo");
        request.code = bankCode;
        request.name = bankName;
        request.serialNumber = jkdh;
        let bankInfo = bank.execute(request);
        loansettleinfovosMap.pk_enterprisebankacct = bankInfo.id; //企业银行账户
        loansettleinfovosMap.vbankaccount_opp = bankInfo.account; //付款银行账号
        loansettleinfovosMap.pk_banktype_opp = bankInfo.bank; //付款银行类别
        loansettleinfovosMap.pk_bankdoc_opp = bankInfo.bankNumber; //付款开户行
      }
      loansettleinfovosMap._status = "Insert";
      loansettleinfovos.push(loansettleinfovosMap);
      dataMap.loanbillbvos = loanbillbvos;
      dataMap.loansettleinfovos = loansettleinfovos;
      ysBody.data = dataMap;
      let ysHeader = {};
      let tokenFun = extrequire("AT1672920C08100005.publickApi.getOpenApiToken");
      let tokenResult = tokenFun.execute();
      let access_token = tokenResult.access_token;
      let ysUrl = "https://www.example.com/" + access_token;
      let responseObj = postman("post", ysUrl, JSON.stringify(ysHeader), JSON.stringify(ysBody));
      let resJson = JSON.parse(responseObj);
      if (resJson.code == "200") {
        let resubmitCheckKey = getSubKey(dataList[i]._widget_1666687251919);
        let header = {};
        let body = { resubmitCheckKey: resubmitCheckKey, id: resJson.data.id };
        let auditUrl = "https://www.example.com/" + access_token;
        let auditObj = postman("post", auditUrl, JSON.stringify(header), JSON.stringify({ data: body }));
        let auditJson = JSON.parse(auditObj);
        if (auditJson.code == "200") {
          let postBody = {
            app_id: "youridHere",
            entry_id: "youridHere",
            data_id: dataList[i]._id,
            data: {
              _widget_1671177286863: {
                value: "1"
              }
            }
          };
          let resUp = postman("post", "https://www.example.com/", JSON.stringify(jdyHeader), JSON.stringify(postBody));
          let resJson = JSON.parse(resUp).data;
          successList.push(dataList[i]._widget_1666687251919);
        } else {
          throw jkdh + "YS单据审核失败！";
        }
      } else {
        throw jkdh + "YS单据保存失败！" + responseObj + ",入参如下：" + JSON.stringify(ysBody);
      }
    }
    return { successList };
    function getSubKey(param) {
      let paramCode = { code: param };
      let funcSubKey = extrequire("AT1672920C08100005.backDesignerFunction.getSubmitKey");
      let resSubKey = funcSubKey.execute(paramCode);
      let subKey = resSubKey.resMD5;
      return subKey;
    }
    function getUserInfo(param) {
      let userName = { name: param };
      let funcUser = extrequire("AT1672920C08100005.publickApi.getUserMessage");
      let userInfo = funcUser.execute(userName);
      return { userInfo };
    }
    //判断月和日是否是单数，单数前面加0 列如3得到的是03
    function getZero(num) {
      // 单数前面加0
      if (num < 10) {
        return "0" + num;
      }
      return num;
    }
  }
}
exports({ entryPoint: MyAPIHandler });