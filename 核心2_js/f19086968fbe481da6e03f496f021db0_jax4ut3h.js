let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer SlOGnl1vjjdngNsqg0b9YmRt36yuIPfD",
      apicode: "89076615-609f-45ef-85da-2fc0effd16bf",
      appkey: "yourkeyHere"
    };
    //当前日期 年月日
    let updateTime = new Date();
    let ym = "";
    if (request.synDate != null && request.synDate != "" && request.synDate != undefined) {
      ym = request.synDate;
    } else {
      ym = updateTime.getFullYear() + "-" + getZero(updateTime.getMonth() + 1);
    }
    // 参数
    let body = {
      app_id: "youridHere",
      entry_id: "youridHere",
      filter: {
        rel: "and",
        cond: [
          {
            field: "flowState", //当天流转完成的
            type: "flowstate",
            method: "eq",
            value: 1
          },
          {
            field: "_widget_1672045385865", //YS同步状态 未同步
            method: "eq",
            type: "text",
            value: 0
          },
          {
            field: "updateTime",
            method: "range",
            type: "text",
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
    //简道云地址
    let url = "https://www.example.com/";
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(body));
    let dataList = JSON.parse(apiResponse).data;
    //调用获取token方法  access_token
    let tokenFun = extrequire("AT1672920C08100005.publickApi.getOpenApiToken");
    let tokenResult = tokenFun.execute(request);
    let access_token = tokenResult.access_token;
    let Map = {};
    //成功条数
    let success = 0;
    //循环数据
    dataList.forEach((row) => {
      let map = {};
      Map.billnum = "znbzbx_expensebill"; //表单编码
      let res = "";
      //流水号
      let serialNumber = row._widget_1666941387501;
      //组织编码
      let orgCode = row._widget_1671180489396;
      //组织名称
      let orgName = row._widget_1668060959595;
      //费用承担组织 undertakeOrg
      let undertakeOrg = getOrg(serialNumber, orgCode, orgName);
      //费用承担部门编码
      let assumeDepartmentCode = row._widget_1672018055600;
      let vfinacedept = getDepartment(serialNumber, assumeDepartmentCode);
      //报销人  pk_handlepsn
      let pk_handlepsn = row._widget_1666864446874.name;
      let staffInfo = getStaff(pk_handlepsn, serialNumber);
      let staffId = staffInfo.id;
      let staffCode = staffInfo.code;
      let staffMobile = staffInfo.mobile;
      //获取员工信息方法
      let staffData = extrequire("AT1672920C08100005.publickApi.getStaff");
      request.code = staffCode;
      request.name = pk_handlepsn;
      request.mobile = staffMobile;
      request.serialNumber = serialNumber;
      let staffResult = staffData.execute(request);
      if (!staffResult) {
        throw new Error("流水号:" + serialNumber + "员工:" + pk_handlepsn + "   员工信息未找到");
      }
      //报销人部门    reimbursementDep
      let reimbursementDep = staffResult.dept_id;
      if (!reimbursementDep) {
        throw new Error("流水号:" + serialNumber + "员工:" + pk_handlepsn + "部门为空");
      }
      //报销人组织
      let reimbursementOrg = staffResult.org_id;
      if (!reimbursementOrg) {
        throw new Error("流水号:" + serialNumber + "员工:" + pk_handlepsn + "组织为空");
      }
      // 查询员工id
      pk_handlepsn = staffResult.id;
      //费用项目编码
      let xmCode = getXmCode(serialNumber, row._widget_1671180489398);
      //币种
      let vcurrency = "2562965013025024";
      let reimburseType = row._widget_1667273021112;
      let uid = uuid();
      let resubmitCheckKey = uid.substring(0, 30);
      //单据日期 发生日期
      let mt = row.createTime;
      let time = new Date(mt);
      let createTime = time.getFullYear() + "-" + getZero(time.getMonth() + 1) + "-" + getZero(time.getDate());
      map.vouchdate = createTime;
      map.dcostdate = createTime;
      //编码
      map.code = serialNumber;
      //费用承担组织 会计主体
      map.cfinaceorg = undertakeOrg;
      map.caccountorg = undertakeOrg;
      //报销人组织
      map.chandleorg = reimbursementOrg;
      //费用承担部门id
      map.vfinacedeptid = vfinacedept;
      //报销人部门
      map.vhandledeptid = reimbursementDep;
      //报销人
      map.pk_handlepsn = pk_handlepsn;
      //通用报销单交易类型
      map.bustype = "1613235414993731589";
      //币种
      map.vcurrency = vcurrency;
      map.vnatcurrency = vcurrency;
      //报销说明
      map.vreason = row._widget_1666936807420;
      //备注
      //费用类型
      let expenseType = row._widget_1671180489397;
      let expenseTypeId = getExpenseType(serialNumber, expenseType, access_token);
      let expensebillDcs = {};
      expensebillDcs.attrext3 = expenseTypeId;
      map.expensebillDcs = expensebillDcs;
      //价税总额
      map.nsummny = row._widget_1666936807444;
      //本币价税总额
      map.nnatsummny = row._widget_1666936807444;
      //核销总额
      map.ncavmny = row._widget_1667287099167;
      //本币核销总额
      map.nnatcavmny = row._widget_1667287099167;
      //应付总额
      map.nshouldpaymny = row._widget_1667444104865;
      //本币应付总额
      map.nnatshouldpaymny = row._widget_1667444104865;
      //付款总额
      map.npaymentmny = row._widget_1667444104865;
      //本币付款总额
      map.nnatpaymentmny = row._widget_1667444104865;
      //不含税总额
      map.nexpensemny = row._widget_1666936807444;
      //本币不含税总额
      map.nnatexpensemny = row._widget_1666936807444;
      //累计付款额
      map.naccpaymny = row._widget_1667444104865;
      //累计付款额-本币
      map.nnataccpaymny = row._widget_1667444104865;
      map.resubmitCheckKey = resubmitCheckKey;
      //创建人
      map.creatorId = 2581256809484544;
      //创建人名称
      map.creator = "黄畅";
      map._status = "Insert";
      map.pk_billtype = "znbzbx_expensebill";
      map.status = 0;
      map.verifystate = 0;
      //获取报销明细数据
      let reimburseDetail = row._widget_1666936807425;
      //定义报销明细数组
      let expensebillbs = [];
      //定义费用分摊数组
      let expapportions = [];
      //剩余报销金额
      let SurplusReimbursableAmount = row._widget_1667287099167 == null || row._widget_1667287099167 == "" ? 0 : row._widget_1667287099167;
      reimburseDetail.forEach((item) => {
        let bxmxArr = {};
        //项目 是否已签订合同 _widget_1666936807433 (是-合同编号,否-项目编码)
        let project = item._widget_1666936807433 == "是" ? item._widget_1666936807435 : item._widget_1671415932137;
        let htCode = getHtCode(serialNumber, project);
        let jdyStop = item._widget_1666936807432;
        let businessId = getExpenseType(serialNumber, jdyStop, access_token);
        let expensebillBDcs = {};
        expensebillBDcs.attrext2 = businessId; //jdy商机
        //费用承担组织 会计主体
        bxmxArr.cfinaceorg = undertakeOrg;
        bxmxArr.caccountorg = undertakeOrg;
        //报销人组织
        bxmxArr.chandleorg = reimbursementOrg;
        //报销人部门
        bxmxArr.vhandledeptid = reimbursementDep;
        //费用承担部门
        bxmxArr.vfinacedeptid = vfinacedept;
        let customerId;
        //客户
        if (reimburseType == "正常报销") {
          let customer = item._widget_1666936807429; //row._widget_1667209128483;
          customerId = getCustomer(serialNumber, customer);
        }
        expensebillBDcs.attrext16 = customerId; //jdy客户
        bxmxArr.expensebillBDcs = expensebillBDcs;
        //客户
        //币种
        bxmxArr.vnatcurrency = vcurrency;
        bxmxArr.vcurrency = vcurrency;
        //报销人
        bxmxArr.pk_handlepsn = pk_handlepsn;
        //项目
        bxmxArr.pk_project = htCode;
        //费用项目编码
        bxmxArr.pk_busimemo = xmCode;
        //报销前金额
        let BeforeReimbursement = item._widget_1666936807440;
        //报销金额
        let ReimbursableAmount;
        //报销后金额
        let AfterReimbursement;
        if (SurplusReimbursableAmount == 0) {
          ReimbursableAmount = 0;
          AfterReimbursement = item._widget_1666936807440;
        } else {
          if (BeforeReimbursement - SurplusReimbursableAmount >= 0) {
            ReimbursableAmount = SurplusReimbursableAmount;
            AfterReimbursement = BeforeReimbursement - SurplusReimbursableAmount;
            SurplusReimbursableAmount = 0;
          } else {
            ReimbursableAmount = BeforeReimbursement;
            AfterReimbursement = 0;
            SurplusReimbursableAmount = SurplusReimbursableAmount - BeforeReimbursement;
          }
        }
        //价税合计
        bxmxArr.nsummny = BeforeReimbursement;
        //价税合计
        bxmxArr.nnatsummny = BeforeReimbursement;
        //不含税金额
        bxmxArr.nexpensemny = BeforeReimbursement;
        //不含税金额-本币
        bxmxArr.nnatexpensemny = BeforeReimbursement;
        //核销额
        bxmxArr.ncavmny = ReimbursableAmount;
        //核销额-本币
        bxmxArr.nnatcavmny = ReimbursableAmount;
        //应付额
        bxmxArr.nshouldpaymny = AfterReimbursement;
        //应付额-本币
        bxmxArr.nnatshouldpaymny = AfterReimbursement;
        //付款额
        bxmxArr.npaymentmny = AfterReimbursement;
        //付款额-本币
        bxmxArr.nnatpaymentmny = AfterReimbursement;
        //累计付款额
        bxmxArr.naccpaymny = AfterReimbursement;
        //累计付款额
        bxmxArr.nnataccpaymny = AfterReimbursement;
        //可抵扣税额
        bxmxArr.ntaxmny = 0;
        //可抵扣税额-本币
        bxmxArr.nnattaxmny = 0;
        bxmxArr._status = "Insert";
        expensebillbs.push(bxmxArr);
        let fyftArr = {};
        //费用承担组织 会计主体
        fyftArr.cfinaceorg = undertakeOrg;
        fyftArr.caccountorg = undertakeOrg;
        //报销人组织
        fyftArr.chandleorg = reimbursementOrg;
        //币种
        fyftArr.vnatcurrency = vcurrency;
        fyftArr.vcurrency = vcurrency;
        //费用承担部门
        fyftArr.vfinacedeptid = vfinacedept;
        let expapportionDcs = {};
        expapportionDcs.attrext2 = businessId; //jdy商机
        expapportionDcs.attrext16 = customerId; //jdy客户
        fyftArr.expapportionDcs = expapportionDcs;
        //项目
        fyftArr.pk_project = htCode;
        //费用项目
        fyftArr.pk_busimemo = xmCode;
        fyftArr._status = "Insert";
        let taxAmount = row._widget_1666936807444;
        //不含税金额
        fyftArr.napportnotaxmny = BeforeReimbursement;
        //可抵扣税额
        fyftArr.napporttaxmny = 0;
        //价税合计
        fyftArr.napportmny = BeforeReimbursement;
        fyftArr.nnatapportmny = BeforeReimbursement;
        //不含税金额-本币
        fyftArr.nnatapportnotaxmny = BeforeReimbursement;
        //可抵扣税额-本币
        fyftArr.nnatapporttaxmny = 0;
        //报销币种金额精度
        fyftArr.vcurrency_moneyDigit = 2;
        //组织本币金额精度
        fyftArr.vnatcurrency_moneyDigit = "2";
        //组织本币汇率类型
        fyftArr.vnatexchratetype = "jax4ut3h";
        //组织本币汇率类型精度
        fyftArr.vnatexchratetype_digit = 6;
        //组织本币汇率日期
        fyftArr.dnatexchratedate = createTime;
        //组织本币企业汇率
        fyftArr.nnatbaseexchrate = 1;
        //组织本币汇率
        fyftArr.nnatexchrate = 1;
        //分摊比例
        let ratio = (BeforeReimbursement * 1 * 100) / (taxAmount * 1);
        fyftArr.napportrate = ratio.toFixed(6);
        expapportions.push(fyftArr);
      });
      map.expensebillbs = expensebillbs;
      map.expapportions = expapportions;
      //判断报销类型
      //定义借款核销对象
      if (reimburseType == "冲借款") {
        //定义借款核销数组
        let loancavs = [];
        let jkhxArr = {};
        //组织
        jkhxArr.cloanfinaceorg = reimbursementOrg;
        //借款/预付单号
        let prepayCode = row._widget_1670816024439;
        jkhxArr.loanno = prepayCode;
        jkhxArr.pk_loanbill = getPersonalLoan(prepayCode, serialNumber).id;
        //借款（经办）人
        jkhxArr.pk_loanpsn = pk_handlepsn;
        //借款（经办）人部门
        jkhxArr.vloandeptid = reimbursementDep;
        //单据类型
        jkhxArr.pk_loanbilltype = "znbzbx_loanbill"; //znbzbx_loanbill 个人借款单
        //借款/预提额
        jkhxArr.nloanmny = row._widget_1670815769210;
        //借款/预提额-本币
        jkhxArr.nnatloanmny = row._widget_1670815769210;
        //核销额（含未审核）
        jkhxArr.nacccavmny = row._widget_1670816024447;
        //核销额(含未审核)-本币
        jkhxArr.nnatacccavmny = row._widget_1670816024447;
        //还款额（含未审核）
        jkhxArr.naccreturnmny = 0;
        //还款额(含未审核)-本币
        jkhxArr.nnataccreturnmny = 0;
        //余额
        jkhxArr.ntotalcavmny = row._widget_1670816024449;
        //余额-本币
        jkhxArr.nnattotalcavmny = row._widget_1670816024449;
        //本次核销
        jkhxArr.ncavmny = row._widget_1667287099167;
        //本次核销-本币
        jkhxArr.nnatcavmny = row._widget_1667287099167;
        //剩余金额
        jkhxArr.nuncavmny = 0;
        //剩余金额-本币
        jkhxArr.nnatuncavmny = 0;
        //借款/预提原因
        jkhxArr.vreason = row._widget_1670816024440;
        //借款核销
        jkhxArr.pk_busimemo = xmCode;
        //币种
        jkhxArr.vloancurrency = vcurrency;
        //借款币种金额精度
        jkhxArr.vloancurrency_moneyDigit = "2";
        //组织本币
        jkhxArr.vnatcurrency = "2562965013025024"; //2562965013025024 人民币
        //组织本币金额精度
        jkhxArr.vnatcurrency_moneyDigit = "2";
        //汇率类型
        jkhxArr.vnatexchratetype = "jax4ut3h";
        //汇率精度
        jkhxArr.vnatexchratetype_digit = "6";
        //组织本币汇率日期
        jkhxArr.dnatexchratedate = createTime;
        //组织本币汇率
        jkhxArr.nnatexchrate = 1;
        //备注
        jkhxArr.vmemo = "";
        jkhxArr._status = "Insert";
        jkhxArr.bcav = true;
        loancavs.push(jkhxArr);
        map.loancavs = loancavs;
      }
      //定义借款核销数组
      let expsettleinfos = [];
      let jfxxArr = {};
      // 收款方帐号
      jfxxArr.vbankaccount = "6214830172400482";
      //收款方户名
      jfxxArr.vbankaccname = "刘媛午";
      //收款方开户行
      jfxxArr.vbankdocname = "招商银行";
      //银行类别
      jfxxArr.vbanktypename = "招商银行";
      //账户类型
      jfxxArr.accttype = "BAT00001";
      //收款方开户行
      jfxxArr.pk_bankdoc = "2581242369138432"; //2581242369138432 招商银行
      //付款金额
      jfxxArr.nsummny = row._widget_1667444104865;
      //期望收款金额
      jfxxArr.nsettlesummny = row._widget_1667444104865;
      //期望收款金额-本币
      jfxxArr.nnatsettlesummny = row._widget_1667444104865;
      //收款银行类别
      jfxxArr["pk_banktype"] = "2572634551179777";
      //收款类型
      jfxxArr["igathertype"] = 1;
      //支付组织
      jfxxArr["centerpriseorg"] = undertakeOrg;
      //报销币种
      jfxxArr["vcurrency"] = "2562965013025024"; //2562965013025024 人民币
      //组织本币
      jfxxArr["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
      //组织本币汇率
      jfxxArr["nnatexchrate"] = 1;
      //结算币种
      jfxxArr["vsettlecurrency"] = "2562965013025024"; //2562965013025024 人民币
      //获取简道云银行账户编码
      let bankCode = row._widget_1676359975163;
      //获取简道云银行账户名称
      let bankName = row._widget_1676359975160;
      //判断银行账户是否为空 为空设置为现金 否则设置银行转账
      if ((bankCode == "" || bankCode == null) && (bankName == "" || bankName == null)) {
        //结算方式
        jfxxArr["pk_balatype"] = "2562748744751983"; //2562748744751983：现金首付款
        //结算方式业务属性
        jfxxArr["balatypesrvattr"] = "1"; //1:现金业务
      } else {
        //结算方式
        jfxxArr["pk_balatype"] = "2562748744751982"; //2562748744751982：银行转账
        //结算方式业务属性
        jfxxArr["balatypesrvattr"] = "0"; //0:银行业务
        //根据银行账户名称和编码查询银行账户信息
        let bank = extrequire("AT1672920C08100005.publickApi.getBankInfo");
        request.code = bankCode;
        request.name = bankName;
        request.serialNumber = serialNumber;
        let bankInfo = bank.execute(request);
        //企业银行账户
        jfxxArr["pk_enterprisebankacct"] = bankInfo.id;
        //付款银行账号
        jfxxArr["vbankaccount_opp"] = bankInfo.account;
        //付款银行类别
        jfxxArr["pk_banktype_opp"] = bankInfo.bank;
        //付款开户行
        jfxxArr["pk_bankdoc_opp"] = bankInfo.bankNumber;
      }
      expsettleinfos.push(jfxxArr);
      map.expsettleinfos = expsettleinfos;
      Map.data = map;
      //保存到JDY通用报销单
      let saveBody = Map;
      let saveHeader = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let header2 = {
        "Content-Type": "application/json;charset=UTF-8",
        apicode: "89076615-609f-45ef-85da-2fc0effd16bf",
        appkey: "yourkeyHere"
      };
      let ysHeader = {};
      //保存路径
      let saveUrl = "https://www.example.com/" + access_token;
      let saveResponse = apiman("POST", saveUrl, JSON.stringify(header2), JSON.stringify(saveBody));
      saveResponse = JSON.parse(saveResponse);
      if (saveResponse.code == 200) {
        //回写jdy同步状态
        //参数
        let data_id = row._id; //获取表单id
        let jdyBody = {
          app_id: "youridHere",
          entry_id: "youridHere",
          data_id: data_id,
          data: {
            _widget_1672045385865: {
              value: 1
            }
          }
        };
        //简道云地址
        let url3 = "https://www.example.com/";
        let updateResponse = apiman("post", url3, JSON.stringify(header), JSON.stringify(jdyBody));
        updateResponse = JSON.parse(updateResponse);
        if (updateResponse.code == null) {
          success++;
          let auditUrl = "https://www.example.com/" + access_token;
          //保存后的ys单据id
          let ysId = substring(saveResponse.data.barCode, 19);
          let auditBody = {
            data: {
              resubmitCheckKey: resubmitCheckKey,
              id: ysId
            }
          };
          let auditApiResponse = postman("post", auditUrl, JSON.stringify(ysHeader), JSON.stringify(auditBody));
          let auditJson = JSON.parse(auditApiResponse);
          if (auditJson.code != "200") {
            throw new Error("ys单号:" + saveResponse.data.code + ",单据审核失败");
          }
        }
      } else {
        throw new Error("流水号:" + serialNumber + saveResponse.message);
      }
      Map.saveResponse = saveResponse;
    });
    let returnData = "一共有" + dataList.length + "条数据,成功" + success + "条";
    return { Map };
    //判断月和日是否是单数，单数前面加0 列如3得到的是03
    function getZero(num) {
      // 单数前面加0
      if (num < 10) {
        return "0" + num;
      }
      return num;
    }
    //获取组织
    function getOrg(serialNumber, code, name) {
      if (!(code || name)) {
        throw new Error("流水号:" + serialNumber + "费用承担组织为空");
      }
      let undertakeOrg;
      if (code != "" && code != null) {
        let sql = "select id from org.func.BaseOrg where code = '" + code + "' and dr = 0";
        let orgRes = ObjectStore.queryByYonQL(sql, "orgcenter");
        if (orgRes != null && orgRes != "") {
          undertakeOrg = orgRes[0].id;
        }
      }
      //编码未查到 用名称查
      if (undertakeOrg == "" || undertakeOrg == null) {
        if (name != "" && name != null) {
          let sql = "select id from org.func.BaseOrg where name = '" + name + "' and dr = 0";
          let orgRes = ObjectStore.queryByYonQL(sql, "u8c-auth");
          if (orgRes != null && orgRes != "") {
            undertakeOrg = orgRes[0].id;
          }
        }
      }
      if (undertakeOrg == "" || undertakeOrg == null) {
        throw new Error("流水号:" + serialNumber + "费用承担组织未找到");
      }
      return undertakeOrg;
    }
    //根据部门编码查询ys部门id
    function getDepartment(serialNumber, departmentCode) {
      if (departmentCode != "" && departmentCode != null) {
        let sql5 = "select id from bd.adminOrg.DeptOrgVO where code = '" + departmentCode + "' and dr = 0";
        let res5 = ObjectStore.queryByYonQL(sql5, "orgcenter");
        if (res5.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到部门id");
        } else {
          return res5[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用承担部门编码为空!");
      }
    }
    //费用项目
    function getXmCode(serialNumber, code) {
      if (code != "" && code != null) {
        let yonSql = "select id from bd.expenseitem.ExpenseItem where code = '" + code + "'";
        let result = ObjectStore.queryByYonQL(yonSql, "finbd");
        if (result.length == 0) {
          throw new Error("流水号:" + serialNumber + "没有查到费用项目id");
        } else {
          return result[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + "费用项目编码为空!");
      }
    }
    //根据客户编码查询ys客户id
    function getCustomer(serialNumber, customer) {
      if (customer != "" && customer != null) {
        let sql3 = "select id from aa.merchant.Merchant where code = '" + customer + "'";
        let res3 = ObjectStore.queryByYonQL(sql3, "u8c-auth");
        if (res3.length == 0) {
          throw new Error("流水号:" + serialNumber + "根据简道云客户编码未查到客户ID");
        } else {
          return res3[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + "客户编码为空!");
      }
    }
    //合同编号
    function getHtCode(serialNumber, code) {
      if (code != "" && code != null) {
        let sql4 = "select id from bd.project.ProjectVO where code = '" + code + "'  and dr = 0";
        let res4 = ObjectStore.queryByYonQL(sql4, "u8c-auth");
        if (res4.length == 0) {
          throw new Error("流水号:" + serialNumber + "没有在ys查到项目id");
        } else {
          return res4[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + "合同编号为空!");
      }
    }
    //根据费用类型编码查询自定义档案维护查询列表 获取ys费用类型id
    function getExpenseType(serialNumber, expenseType, access_token) {
      if (expenseType != "" && expenseType != null) {
        let expenseTypeBody = { code: expenseType };
        let expenseTypeUrl = "https://www.example.com/" + access_token;
        let expenseTypeResponse = apiman("post", expenseTypeUrl, JSON.stringify(header), JSON.stringify(expenseTypeBody));
        let expenseTypeInfo = JSON.parse(expenseTypeResponse).data.recordList[0];
        if (expenseTypeInfo == null || expenseTypeInfo == "") {
          throw new Error("流水号:" + serialNumber + "没有查到费用类型id或jdy商机id");
        } else {
          return expenseTypeInfo.id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + "费用类型编码或jdy商机编码为空!");
      }
    }
    //根据员工编码查询ys员工id
    function getStaff(staff, serialNumber) {
      if (staff != "" && staff != null) {
        let sql2 = "select id,code,mobile from bd.staff.StaffNew where name = '" + staff + "' and dr = 0";
        let res2 = ObjectStore.queryByYonQL(sql2, "u8c-auth");
        if (res2.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到员工id信息");
        } else {
          return res2[0];
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",员工名称为空!");
      }
    }
    // 获取个人借款单ID
    function getPersonalLoan(billNo, serialNumber) {
      if (billNo != "" && billNo != null) {
        let param = { billNo: billNo, serialNumber: serialNumber };
        let func = extrequire("AT1672920C08100005.backDesignerFunction.getPersonalLoan");
        let res = func.execute(param);
        return res;
      } else {
        throw new Error("流水号:" + serialNumber + ",个人借款单号为空!");
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });