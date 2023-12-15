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
    let ontInData = ["2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12"];
    //参数
    let body = {
      app_id: "youridHere",
      entry_id: "youridHere", //youridHere 报销(不予商机关联)
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
            field: "_widget_1671177429276", //YS同步状态 未同步
            method: "eq",
            type: "text",
            value: 0
          },
          {
            field: "updateTime", //日期
            method: "eq",
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
    //定义jdy通用报销单数组
    let mapArr = [];
    //循环数据
    dataList.forEach((row) => {
      if (row.createTime != undefined && !includes(row.createTime, "2022")) {
        //定义jdy通用报销单对象
        let map = {};
        map["billnum"] = "znbzbx_expensebill";
        let data = {};
        //流水号
        let serialNumber = row._widget_1666941387501;
        //报销人
        let reimburse = row._widget_1666864446874.name;
        if (reimburse == null || reimburse == "") {
          throw "流水号:" + serialNumber + ",报销人信息为空!";
        }
        let bxrName = { name: reimburse };
        let func = extrequire("AT1672920C08100005.backDesignerFunction.getPerson");
        let resBxr = func.execute(bxrName);
        //报销人
        data["pk_handlepsn"] = resBxr.id;
        if (resBxr.id == null || resBxr.id == "") {
          throw "流水号:" + serialNumber + "未查询到报销人信息！";
        }
        //报销人组织
        data["chandleorg"] = resBxr.org_id;
        //报销人部门
        data["vhandledeptid"] = resBxr.dept_id;
        //单据日期 发生日期
        let mt = row.createTime;
        let time = new Date(mt);
        let createTime = time.getFullYear() + "-" + getZero(time.getMonth() + 1) + "-" + getZero(time.getDate());
        data["vouchdate"] = createTime;
        data["dcostdate"] = createTime;
        //费用承担组织 会计主体
        let org = row._widget_1671433696119;
        let orgId = getOrg(org, serialNumber);
        data["cfinaceorg"] = orgId;
        data["caccountorg"] = orgId;
        //单据类型
        data["pk_billtype"] = "znbzbx_expensebill";
        //编码
        data["code"] = serialNumber;
        //幂等性
        let uid = uuid();
        let resubmitCheckKey = substring(uid, 0, 30);
        data["resubmitCheckKey"] = resubmitCheckKey;
        //创建人默认
        data["creatorId"] = 2581256809484544;
        data["creator"] = "黄畅";
        //费用承担部门
        let assumeDepartment = row._widget_1672018127062;
        let assumeDepartmentId = getDepartment(assumeDepartment, serialNumber);
        data["vfinacedeptid"] = assumeDepartmentId;
        //报销说明
        let explain = row._widget_1666936807420;
        if (explain == "" || explain == null) {
          throw new Error("报销说明为空!");
        } else {
          data["vreason"] = explain;
        }
        //价税总额
        let taxAmount = row._widget_1666936807444;
        if (taxAmount == "" || taxAmount == null) {
          throw new Error("价税总额为空!");
        } else {
          data["nsummny"] = taxAmount;
        }
        //核销总额
        let verificationAmount = row._widget_1667377805995;
        data["ncavmny"] = verificationAmount;
        //应付总额 付款总额
        let copeAmount = row._widget_1667377805996;
        data["nshouldpaymny"] = copeAmount;
        data["npaymentmny"] = copeAmount;
        //预提核销总额
        data["ncavwithholdingmny"] = 0;
        //备注
        data["vmemo"] = "";
        //费用类型
        let expenseType = row._widget_1671433696120;
        let expenseTypeId = getExpenseType(expenseType, access_token, serialNumber);
        let expensebillDcs = {};
        expensebillDcs.attrext3 = expenseTypeId;
        data.expensebillDcs = expensebillDcs;
        //交易类型
        data["bustype"] = "1613235414993731589"; //1613235414993731589 JDY通用报销单
        //原币
        data["vcurrency"] = "2562965013025024"; //2562965013025024 人民币
        //组织本币
        data["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
        //组织本币汇率类型
        data["vnatexchratetype"] = "jax4ut3h"; //jax4ut3h 基准汇率
        //组织本币汇率日期
        data["dnatexchratedate"] = createTime; //createTime 单据日期
        //组织本币企业汇率
        data["nnatbaseexchrate"] = 1;
        //组织本币汇率
        data["nnatexchrate"] = 1;
        //不含税总额
        data["nexpensemny"] = taxAmount;
        //不含税总额-本币
        data["nnatexpensemny"] = taxAmount;
        //报销价税总额-本币
        data["nnatsummny"] = taxAmount;
        //应付总额-本币
        data["nnatshouldpaymny"] = copeAmount;
        //核销总额-本币
        data["nnatcavmny"] = verificationAmount;
        //付款总额-本币
        data["nnatpaymentmny"] = copeAmount;
        //预提核销总额-本币
        data["nnatcavwithholdingmny"] = 0;
        //操作标识
        data["_status"] = "Insert";
        //项目
        let project = row._widget_1671433696117;
        let projectId = getProject(project, serialNumber);
        //借款（经办）人
        let loanPerson = row._widget_1670816114260;
        let loanPersonId = "";
        if (loanPerson != "" && loanPerson != null) {
          let loanPersonName = loanPerson.name;
          loanPersonId = getStaff(loanPersonName, serialNumber).id;
        } else {
          let loanPersonId = "";
        }
        //获取报销明细数据
        let reimburseDetail = row._widget_1669881349721;
        //定义报销明细数组
        let bxmxArr = [];
        //核销额
        let ncavmny = row._widget_1667377805995 == "" || row._widget_1667377805995 == null ? 0 : row._widget_1667377805995;
        //循环报销明细
        reimburseDetail.forEach((item) => {
          //定义报销明细对象
          let bxmx = {};
          //报销人
          bxmx["pk_handlepsn"] = resBxr.id;
          //报销人部门
          bxmx["vhandledeptid"] = resBxr.dept_id;
          //报销人组织
          bxmx["chandleorg"] = resBxr.org_id;
          //费用承担组织
          bxmx["cfinaceorg"] = orgId;
          //费用承担部门
          bxmx["vfinacedeptid"] = assumeDepartmentId;
          //会计主体
          bxmx["caccountorg"] = orgId;
          //客户
          //项目
          bxmx["pk_project"] = projectId;
          //费用项目
          let expenseProject = item._widget_1671433696121;
          let costProjectId = getCostProject(expenseProject, serialNumber);
          bxmx["pk_busimemo"] = costProjectId;
          //可抵扣税额
          bxmx["ntaxmny"] = 0;
          //价税合计
          let valoremTotal = item._widget_1669881349726;
          if (valoremTotal == "" || valoremTotal == null) {
            throw new Error("流水号：" + serialNumber + "，报销明细-价税合计为空!");
          } else {
            bxmx["nsummny"] = valoremTotal;
          }
          //不含税金额
          bxmx["nexpensemny"] = valoremTotal;
          //备注
          bxmx["vmemo"] = "";
          //组织本币
          bxmx["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
          //报销币种
          bxmx["vcurrency"] = "2562965013025024"; //2562965013025024 人民币
          //组织本币汇率类型
          bxmx["vnatexchratetype"] = "jax4ut3h"; //jax4ut3h 基准汇率
          //组织本币企业汇率
          bxmx["nnatbaseexchrate"] = 1;
          //组织本币汇率
          bxmx["nnatexchrate"] = 1;
          //组织本币汇率日期
          bxmx["dnatexchratedate"] = createTime;
          //判断核销额是否大于价税合计
          if (ncavmny > valoremTotal) {
            //设置核销额的值为 核销额 - 价税合计
            ncavmny = ncavmny - valoremTotal;
            //应付额
            bxmx["nshouldpaymny"] = 0;
            //应付额-本币
            bxmx["nnatshouldpaymny"] = 0;
            //付款额
            bxmx["npaymentmny"] = 0;
            //付款额-本币
            bxmx["nnatpaymentmny"] = 0;
            //核销额
            bxmx["ncavmny"] = valoremTotal;
            //核销额-本币
            bxmx["nnatcavmny"] = valoremTotal;
          } else {
            //应付额
            bxmx["nshouldpaymny"] = valoremTotal - ncavmny;
            //应付额-本币
            bxmx["nnatshouldpaymny"] = valoremTotal - ncavmny;
            //付款额
            bxmx["npaymentmny"] = valoremTotal - ncavmny;
            //付款额-本币
            bxmx["nnatpaymentmny"] = valoremTotal - ncavmny;
            //核销额
            bxmx["ncavmny"] = ncavmny;
            //核销额-本币
            bxmx["nnatcavmny"] = ncavmny;
            //设置核销额的值为0
            ncavmny = 0;
          }
          //不含税总额-本币
          bxmx["nnatexpensemny"] = valoremTotal;
          //价税合计-本币
          bxmx["nnatsummny"] = valoremTotal;
          //可抵扣税额-本币
          bxmx["nnattaxmny"] = 0;
          bxmxArr.push(bxmx);
        });
        let reimburseType = row._widget_1668408484907;
        //定义借款核销数组
        let jkhxArr = [];
        //判断报销类型
        if (reimburseType == "冲借款") {
          //定义借款核销对象
          let jkhx = {};
          //借款/预付单号
          let prepayCode = row._widget_1670816114256;
          jkhx["loanno"] = prepayCode;
          jkhx["pk_loanbill"] = getPersonalLoan(prepayCode, serialNumber).id;
          //借款（经办）人
          jkhx["pk_loanpsn"] = loanPersonId;
          //借款（经办）人部门
          jkhx["vloandeptid"] = tokenResult.dept_id;
          //借款（单据）日期
          let ms = row._widget_1667209128497;
          if (ms != "" && ms != null) {
            let date = new Date(ms);
            let billsDate = date.getFullYear() + "-" + getZero(date.getMonth() + 1) + "-" + getZero(date.getDate()) + " 00:00:00";
            jkhx["loandate"] = billsDate;
          } else {
            jkhx["loandate"] = "";
          }
          //单据类型
          jkhx["pk_loanbilltype"] = "znbzbx_loanbill"; //znbzbx_loanbill 个人借款单
          //借款/预提额
          jkhx["nloanmny"] = row._widget_1668408189747 == null || row._widget_1668408189747 == "" ? 0 : row._widget_1668408189747;
          //借款/预提额-本币
          jkhx["nnatloanmny"] = row._widget_1668408189747 == null || row._widget_1668408189747 == "" ? 0 : row._widget_1668408189747;
          //核销额（含未审核）
          jkhx["nacccavmny"] = row._widget_1670816114264 == null || row._widget_1670816114264 == "" ? 0 : row._widget_1670816114264;
          //核销额(含未审核)-本币
          jkhx["nnatacccavmny"] = row._widget_1670816114264 == null || row._widget_1670816114264 == "" ? 0 : row._widget_1670816114264;
          //还款额（含未审核）
          jkhx["naccreturnmny"] = 0;
          //还款额(含未审核)-本币
          jkhx["nnataccreturnmny"] = 0;
          //余额
          jkhx["ntotalcavmny"] = row._widget_1670816114266;
          //余额-本币
          jkhx["nnattotalcavmny"] = row._widget_1670816114266;
          //本次核销
          jkhx["ncavmny"] = row._widget_1667377805995;
          //本次核销-本币
          jkhx["nnatcavmny"] = row._widget_1667377805995;
          //剩余金额
          jkhx["nuncavmny"] = 0;
          //剩余金额-本币
          jkhx["nnatuncavmny"] = 0;
          //借款/预提原因
          jkhx["vreason"] = row._widget_1670816114257;
          //借款币种
          jkhx["vloancurrency"] = "2562965013025024";
          //借款币种金额精度
          jkhx["vloancurrency_moneyDigit"] = "2";
          //组织本币
          jkhx["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
          //组织本币金额精度
          jkhx["vnatcurrency_moneyDigit"] = "2";
          //汇率类型
          jkhx["vnatexchratetype"] = "jax4ut3h";
          //汇率精度
          jkhx["vnatexchratetype_digit"] = "6";
          //组织本币汇率日期
          jkhx["dnatexchratedate"] = createTime;
          //组织本币汇率
          jkhx["nnatexchrate"] = 1;
          //备注
          jkhx["vmemo"] = "";
          //核销
          jkhx["bcav"] = true;
          jkhxArr.push(jkhx);
        }
        //获取费用分摊数据
        let costApportionDetail = row._widget_1669881349721;
        //定义费用分摊数组
        let fyftArr = [];
        //循环费用分摊
        costApportionDetail.forEach((item) => {
          //定义费用分摊对象
          let fyft = {};
          //费用承担部门
          fyft["vfinacedeptid"] = assumeDepartmentId;
          //费用承担组织
          fyft["cfinaceorg"] = orgId;
          //项目
          fyft["pk_project"] = projectId;
          //会计主体
          fyft["caccountorg"] = orgId;
          //费用项目
          let expenseProject = item._widget_1671433696121;
          let costProjectId = getCostProject(expenseProject, serialNumber);
          fyft["pk_busimemo"] = costProjectId;
          //报销币种
          fyft["vcurrency"] = "2562965013025024";
          //报销币种金额精度
          fyft["vcurrency_moneyDigit"] = 2;
          //组织本币 人民币:2562965013025024
          fyft["vnatcurrency"] = "2562965013025024";
          //组织本币金额精度
          fyft["vnatcurrency_moneyDigit"] = "2";
          //组织本币汇率类型
          fyft["vnatexchratetype"] = "jax4ut3h";
          //组织本币汇率类型精度
          fyft["vnatexchratetype_digit"] = 6;
          //组织本币汇率日期
          fyft["dnatexchratedate"] = createTime;
          //组织本币企业汇率
          fyft["nnatbaseexchrate"] = 1;
          //组织本币汇率
          fyft["nnatexchrate"] = 1;
          //含税金额
          let valoremTotal = item._widget_1669881349726;
          fyft["napportmny"] = valoremTotal;
          //含税金额-本币
          fyft["nnatapportmny"] = item._widget_1669881349726;
          //不含税金额
          fyft["napportnotaxmny"] = item._widget_1669881349726;
          //不含税金额-本币
          fyft["nnatapportnotaxmny"] = item._widget_1669881349726;
          //分摊比例
          let ratio = (valoremTotal / taxAmount) * 100;
          fyft["napportrate"] = MoneyFormatReturnBd(ratio, 6) * 1;
          fyftArr.push(fyft);
        });
        //定义结算信息数组
        let jsxxArr = [];
        //定义结算信息对象
        let jsxx = {};
        //收款方帐号
        jsxx["vbankaccount"] = "6214830172400482";
        //收款方户名
        jsxx["vbankaccname"] = "刘媛午";
        //收款方开户行
        jsxx["pk_bankdoc"] = "2581242369138432"; //2581242369138432 招商银行
        //收款方开户行名称
        jsxx["vbankdocname"] = "招商银行";
        //银行类别名称
        jsxx["vbanktypename"] = "招商银行";
        //付款金额
        jsxx["nsummny"] = row._widget_1667377805996;
        //收款银行类别
        jsxx["pk_banktype"] = "2572634551179777";
        //收款类型
        jsxx["igathertype"] = 1;
        //支付组织
        jsxx["centerpriseorg"] = orgId;
        //报销币种
        jsxx["vcurrency"] = "2562965013025024"; //2562965013025024 人民币
        //组织本币
        jsxx["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
        //组织本币汇率
        jsxx["nnatexchrate"] = 1;
        //结算币种
        jsxx["vsettlecurrency"] = "2562965013025024"; //2562965013025024 人民币
        //期望收款金额
        jsxx["nsettlesummny"] = row._widget_1667377805996;
        //期望收款金额-本币
        jsxx["nnatsettlesummny"] = row._widget_1667377805996;
        //操作标识
        jsxx["_status"] = "Insert";
        //获取简道云银行账户编码
        let bankCode = row._widget_1675936463813;
        //获取简道云银行账户名称
        let bankName = row._widget_1675936463812;
        //判断银行账户是否为空 为空设置为现金 否则设置银行转账
        if ((bankCode == "" || bankCode == null) && (bankName == "" || bankName == null)) {
          //结算方式
          jsxx["pk_balatype"] = "2562748744751983"; //2562748744751983：现金首付款
          //结算方式业务属性
          jsxx["balatypesrvattr"] = "1"; //1:现金业务
        } else {
          //结算方式
          jsxx["pk_balatype"] = "2562748744751982"; //2562748744751982：银行转账
          //结算方式业务属性
          jsxx["balatypesrvattr"] = "0"; //0:银行业务
          //根据银行账户名称和编码查询银行账户信息
          let bank = extrequire("AT1672920C08100005.publickApi.getBankInfo");
          request.code = bankCode;
          request.name = bankName;
          request.serialNumber = serialNumber;
          let bankInfo = bank.execute(request);
          //企业银行账户
          jsxx["pk_enterprisebankacct"] = bankInfo.id;
          //付款银行账号
          jsxx["vbankaccount_opp"] = bankInfo.account;
          //付款银行类别
          jsxx["pk_banktype_opp"] = bankInfo.bank;
          //付款开户行
          jsxx["pk_bankdoc_opp"] = bankInfo.bankNumber;
        }
        jsxxArr.push(jsxx);
        //添加报销明细数组
        data["expensebillbs"] = bxmxArr;
        //判断报销类型 是冲借款就添加借款核销数组
        if (reimburseType == "冲借款") {
          //添加借款核销数组
          data["loancavs"] = jkhxArr;
        }
        //添加费用分摊数组
        data["expapportions"] = fyftArr;
        //添加结算信息数组
        data["expsettleinfos"] = jsxxArr;
        map["data"] = data;
        mapArr.push(map);
        //保存到JDY通用报销单
        let body2 = map;
        let ysHeader = {};
        //保存路径
        let url2 = "https://www.example.com/";
        let apiResponse2 = openLinker("POST", url2, "AT1672920C08100005", JSON.stringify(body2));
        let resJson = JSON.parse(apiResponse2);
        if (resJson.code == 200) {
          //回写jdy同步状态
          //参数
          let data_id = row._id; //获取表单id
          let jdyBody = {
            app_id: "youridHere",
            entry_id: "youridHere", //youridHere 报销(不予商机关联)
            data_id: data_id,
            data: {
              _widget_1671177429276: {
                value: 1
              }
            }
          };
          //简道云地址
          let url3 = "https://www.example.com/";
          let apiResponse3 = apiman("post", url3, JSON.stringify(header), JSON.stringify(jdyBody));
          let auditUrl = "https://www.example.com/" + access_token;
          //保存后的ys单据id
          let ysId = substring(resJson.data.barCode, 19);
          let auditBody = {
            data: {
              resubmitCheckKey: resubmitCheckKey,
              id: ysId
            }
          };
          let auditApiResponse = postman("post", auditUrl, JSON.stringify(ysHeader), JSON.stringify(auditBody));
          let auditJson = JSON.parse(auditApiResponse);
          if (auditJson.code != "200") {
            throw new Error("ys单号:" + resJson.data.code + ",单据审核失败，失败原因：" + auditApiResponse);
          }
        } else {
          throw new Error("保存ys通用报销单流水号:" + serialNumber + "," + resJson.message + "入参如下" + JSON.stringify(body2));
        }
      }
    });
    return { mapArr };
    //判断月和日是否是单数，单数前面加0 列如3得到的是03
    function getZero(num) {
      // 单数前面加0
      if (num < 10) {
        return "0" + num;
      }
      return num;
    }
    //根据组织编码查询ys组织id
    function getOrg(org, serialNumber) {
      if (org != "" && org != null) {
        let sql = "select id from org.func.BaseOrg where code = '" + org + "' and dr = 0";
        let res = ObjectStore.queryByYonQL(sql, "orgcenter");
        if (res.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到费用承担组织id");
        } else {
          return res[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用承担组织编码为空!");
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
    //根据客户编码查询ys客户id
    function getCustomer(customer, serialNumber) {
      if (customer != "" && customer != null) {
        let sql3 = "select id from aa.merchant.Merchant where code = '" + customer + "'";
        let res3 = ObjectStore.queryByYonQL(sql3, "u8c-auth");
        if (res3.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到客户id");
        } else {
          return res3[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",客户编码为空!");
      }
    }
    //根据项目编码查询ys项目id
    function getProject(project, serialNumber) {
      if (project != "" && project != null) {
        let sql4 = "select id from bd.project.ProjectVO where code = '" + project + "' and dr = 0";
        let res4 = ObjectStore.queryByYonQL(sql4, "u8c-auth");
        if (res4.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到项目id");
        } else {
          return res4[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",项目编码为空!");
      }
    }
    //根据费用承担部门编码查询ys费用承担部门id
    function getDepartment(departmentCode, serialNumber) {
      if (departmentCode != "" && departmentCode != null) {
        let sql5 = "select id from bd.adminOrg.DeptOrgVO where code = '" + departmentCode + "' and dr = 0";
        let res5 = ObjectStore.queryByYonQL(sql5, "orgcenter");
        if (res5.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到费用承担部门id");
        } else {
          return res5[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用承担部门编码为空!");
      }
    }
    //根据费用项目编码查询ys费用项目id
    function getCostProject(costProject, serialNumber) {
      if (costProject != "" && costProject != null) {
        let yonSql = "select id from bd.expenseitem.ExpenseItem where code = '" + costProject + "'";
        let result = ObjectStore.queryByYonQL(yonSql, "finbd");
        if (result.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到费用项目id");
        } else {
          return result[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用项目编码为空!");
      }
    }
    //根据费用类型编码、jdy商机编码查询自定义档案维护查询列表 获取ys费用类型id 或 jdy商机id
    function getExpenseType(expenseType, access_token, serialNumber) {
      if (expenseType != "" && expenseType != null) {
        let expenseTypeBody = { code: expenseType };
        let expenseTypeUrl = "https://www.example.com/" + access_token;
        let expenseTypeResponse = apiman("post", expenseTypeUrl, JSON.stringify(header), JSON.stringify(expenseTypeBody));
        let expenseTypeInfo = JSON.parse(expenseTypeResponse).data.recordList[0];
        if (expenseTypeInfo == null || expenseTypeInfo == "") {
          throw new Error("流水号:" + serialNumber + ",没有查到费用类型id");
        } else {
          return expenseTypeInfo.id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用类型编码为空!");
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