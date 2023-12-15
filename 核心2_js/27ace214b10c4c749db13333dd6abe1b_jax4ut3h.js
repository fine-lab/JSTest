let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //调用获取token方法  access_token
    let tokenFun = extrequire("AT1672920C08100005.publickApi.getOpenApiToken");
    let tokenResult = tokenFun.execute();
    let access_token = tokenResult.access_token;
    //查询数据
    let url2 = "https://www.example.com/";
    //请求头
    let header2 = {
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
    //请求体
    let body2 = {
      app_id: "youridHere",
      entry_id: "youridHere", //youridHere 核销单  63579da527a64c0008a3b5cb 个人借款单   635b70c3b0d1d8000adc2ee5 公司借款单
      filter: {
        rel: "and",
        cond: [
          {
            field: "flowState", //排除当天流转未完成的
            type: "flowstate",
            method: "eq",
            value: 1
          },
          {
            field: "_widget_1671177248829", //YS同步状态 未同步
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
    //查询简道云
    let apiResponse2 = apiman("post", url2, JSON.stringify(header2), JSON.stringify(body2));
    let data = JSON.parse(apiResponse2).data;
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "89076615-609f-45ef-85da-2fc0effd16bf",
      appkey: "yourkeyHere"
    };
    let saveData = []; //ys对象
    //循环数据
    data.forEach((item) => {
      //定义jdy通用报销单对象
      let mapArr = {};
      let map = {};
      mapArr["billnum"] = "znbzbx_expensebill";
      //流水号
      let serialNumber = item._widget_1666689244340;
      //单据日期 发生日期
      let mt = item.createTime;
      let time = new Date(mt);
      let createTime = time.getFullYear() + "-" + getZero(time.getMonth() + 1) + "-" + getZero(time.getDate());
      //报销人
      let reimburse = item._widget_1667444101195;
      let staffId = "";
      let staffCode = "";
      let staffMobile = "";
      let reimburseName = "";
      if (reimburse != "" && reimburse != null) {
        reimburseName = reimburse.name;
        let staffInfo = getStaff(reimburseName, serialNumber);
        staffId = staffInfo.id;
        staffCode = staffInfo.code;
        staffMobile = staffInfo.mobile;
      } else {
        throw new Error("流水号:" + serialNumber + ",报销人信息为空!");
      }
      //调用获取报销人组织和部门的api
      let tokenFun = extrequire("AT1672920C08100005.publickApi.getStaff");
      request.code = staffCode;
      request.name = reimburseName;
      request.mobile = staffMobile;
      request.serialNumber = serialNumber;
      let tokenResult = tokenFun.execute(request);
      if (tokenResult == null || tokenResult == "") {
        throw new Error("流水号:" + serialNumber + ",报销人:" + reimburseName + ",查询出的报销人组织和报销人部门信息为空!");
      }
      //获取报销人组织id
      let reimburseOrgId = tokenResult.org_id;
      if (reimburseOrgId == "" || reimburseOrgId == null) {
        throw new Error("流水号:" + serialNumber + ",报销人:" + reimburseName + ",报销人组织id为空!");
      }
      //报销人部门id
      let departmentId = tokenResult.dept_id;
      if (departmentId == "" || departmentId == null) {
        throw new Error("流水号:" + serialNumber + ",报销人:" + reimburseName + ",报销人部门id为空!");
      }
      //费用承担组织 会计主体
      let org = item._widget_1668669743313[0]._widget_1670379825042;
      let orgId = getOrg(org, serialNumber);
      //创建人id
      //费用承担部门
      let assumeDepartment = item._widget_1668669743313[0]._widget_1672025963763;
      let assumeDepartmentId = getDepartment(assumeDepartment, serialNumber);
      //费用类型
      let expenseType = item._widget_1668669743313[0]._widget_1670551079369;
      let expenseTypeId = getExpenseType(expenseType, access_token, serialNumber);
      //价税总额
      let taxAmount = item._widget_1667527234550;
      if (taxAmount == "" || taxAmount == null) {
        throw new Error("价税总额为空!");
      }
      //幂等性
      let uid = uuid();
      let resubmitCheckKey = substring(uid, 0, 30);
      //主表数据
      map.vouchdate = createTime; //单据日期
      map.dcostdate = createTime; //发生日期
      map.cfinaceorg = orgId; //费用承担组织
      map.caccountorg = orgId; //会计主体
      map.chandleorg = reimburseOrgId; //报销人组织
      map.vhandledeptid = departmentId; //报销人部门
      map.pk_handlepsn = staffId; //报销人
      map.vfinacedeptid = assumeDepartmentId; //费用承担部门
      map.nsummny = taxAmount; //价税总额
      map.ncavmny = 0; //核销总额
      map.nshouldpaymny = taxAmount; //应付总额
      map.npaymentmny = taxAmount; //付款总额
      map.vreason = "对公预付核销"; //报销说明
      map.code = serialNumber; //编码
      map.vmemo = ""; //备注
      map.pk_billtype = "znbzbx_expensebill"; //单据类型
      map.resubmitCheckKey = resubmitCheckKey; //幂等性
      map.creatorId = 2581256809484544; //创建人id 2581256809484544 黄畅
      map.creator = "黄畅"; //创建人名称
      let expensebillDcs = {};
      expensebillDcs.attrext3 = expenseTypeId;
      map.expensebillDcs = expensebillDcs;
      map.bustype = "1633247411368361990"; //1633247411368361990  交易类型 JDY对公预付核销
      map.vcurrency = "2562965013025024"; //2562965013025024  原币 人民币
      map.vnatcurrency = "2562965013025024"; //2562965013025024  组织本币  人民币
      map.vnatexchratetype = "jax4ut3h"; //组织本币汇率类型 jax4ut3h 基准汇率
      map.dnatexchratedate = createTime; //组织本币汇率日期
      map.nnatbaseexchrate = 1; //组织本币企业汇率
      map.nnatexchrate = 1; //组织本币汇率
      map.nexpensemny = taxAmount; //不含税金额
      map.nnatexpensemny = taxAmount; //不含税总额-本币
      map.nnatsummny = taxAmount; //价税总额-本币
      map.nnatcavmny = 0; //核销总额-本币
      map.nnatshouldpaymny = taxAmount; //应付总额-本币
      map.nnatpaymentmny = taxAmount; //付款总额-本币
      map._status = "Insert"; //操作标识
      //获取报销明细数据
      let reimburseDetail = item._widget_1668669743313;
      //报销明细数组
      let bxmxArr = [];
      //循环报销明细
      reimburseDetail.forEach((detailRow) => {
        //定义报销明细对象
        let bxmx = {};
        //报销人
        bxmx["pk_handlepsn"] = staffId;
        //报销人部门
        bxmx["vhandledeptid"] = departmentId;
        //报销人组织
        bxmx["chandleorg"] = reimburseOrgId;
        //费用承担组织
        bxmx["cfinaceorg"] = orgId;
        //费用承担部门
        bxmx["vfinacedeptid"] = assumeDepartmentId;
        //会计主体
        bxmx["caccountorg"] = orgId;
        let expensebillBDcs = {};
        //供应商
        let supplierCode = detailRow._widget_1670551079367;
        expensebillBDcs.attrext15 = getSupplier(supplierCode, serialNumber); //jdy供应商
        // 客户编号
        let customer = detailRow._widget_1675737714944;
        if (customer != "" && customer != null) {
          let customerId = getCustomer(serialNumber, customer);
          expensebillBDcs.attrext16 = customerId; //jdy客户
        }
        //项目
        let project = detailRow._widget_1670381338587;
        bxmx["pk_project"] = getProject(project, serialNumber);
        //费用项目
        let expenseProject = detailRow._widget_1670486771722;
        bxmx["pk_busimemo"] = getCostProject(expenseProject, serialNumber);
        //税价合计
        let valoremTotal = detailRow._widget_1670926689827;
        if (valoremTotal == "" || valoremTotal == null) {
          throw new Error("报销明细-税价合计为空!");
        } else {
          bxmx["nsummny"] = valoremTotal;
        }
        //不含税金额
        bxmx["nexpensemny"] = valoremTotal;
        //可抵扣税额
        bxmx["ntaxmny"] = 0;
        //备注
        bxmx["vmemo"] = "";
        let business = detailRow._widget_1670381338586;
        expensebillBDcs.attrext2 = getExpenseType(business, access_token, serialNumber); //jdy客户
        //费用类别
        let category = detailRow._widget_1670551079369;
        if (category == "" || category == null) {
          throw new Error("流水号:" + serialNumber + ",费用类别编码为空!");
        } else {
          let fylb = extrequire("AT1672920C08100005.backDesignerFunction.getFylb");
          request.fylx = category;
          request.serialNumber = serialNumber;
          let fylbid = fylb.execute(request);
          expensebillBDcs.attrext17 = fylbid.id; //费用类别
        }
        bxmx.expensebillBDcs = expensebillBDcs;
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
        //应付额
        bxmx["nshouldpaymny"] = valoremTotal;
        //应付额-本币
        bxmx["nnatshouldpaymny"] = valoremTotal;
        //付款额
        bxmx["npaymentmny"] = valoremTotal;
        //付款额-本币
        bxmx["nnatpaymentmny"] = valoremTotal;
        //核销额
        bxmx["ncavmny"] = 0;
        //核销额-本币
        bxmx["nnatcavmny"] = 0;
        //不含税总额-本币
        bxmx["nnatexpensemny"] = valoremTotal;
        //价税合计-本币
        bxmx["nnatsummny"] = valoremTotal;
        //可抵扣税额-本币
        bxmx["nnattaxmny"] = 0;
        bxmx["_status"] = "Insert";
        bxmxArr.push(bxmx);
      });
      //获取费用分摊数据
      let costApportionDetail = item._widget_1668669743313;
      //定义费用分摊数组
      let fyftArr = [];
      //循环费用分摊
      costApportionDetail.forEach((childItem) => {
        //定义费用分摊对象
        let fyft = {};
        //费用项目
        let expenseProject = childItem._widget_1670486771722;
        fyft["pk_busimemo"] = getCostProject(expenseProject, serialNumber);
        //费用承担部门
        fyft["vfinacedeptid"] = assumeDepartmentId;
        //费用承担组织
        fyft["cfinaceorg"] = orgId;
        //项目
        let project = childItem._widget_1670381338587;
        fyft["pk_project"] = getProject(project, serialNumber);
        //不含税金额
        fyft["napportnotaxmny"] = childItem._widget_1670926689827;
        //可抵扣税额
        fyft["napporttaxmny"] = 0;
        //价税合计
        let valoremTotal = childItem._widget_1670926689827;
        fyft["napportmny"] = valoremTotal;
        //分摊比例
        let ratio = (valoremTotal * 1 * 100) / (taxAmount * 1);
        fyft["napportrate"] = ratio.toFixed(6);
        //会计主体
        fyft["caccountorg"] = orgId;
        //不含税金额-本币
        fyft["nnatapportnotaxmny"] = childItem._widget_1670926689827;
        //可抵扣税额-本币
        fyft["nnatapporttaxmny"] = 0;
        //价税合计-本币
        fyft["nnatapportmny"] = valoremTotal;
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
        fyft["_status"] = "Insert";
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
      //结算方式
      jsxx["pk_balatype"] = "2562748744751983"; //2562748744751983：现金首付款
      //付款金额
      jsxx["nsummny"] = item._widget_1667527234550;
      //企业银行账户
      jsxx["pk_enterprisebankacct"] = "";
      //收款银行类别
      jsxx["pk_banktype"] = "2572634551179777";
      //收款类型
      jsxx["igathertype"] = 1;
      //结算方式业务属性
      jsxx["balatypesrvattr"] = 1;
      //报销币种
      jsxx["vcurrency"] = "2562965013025024"; //2562965013025024 人民币
      //组织本币
      jsxx["vnatcurrency"] = "2562965013025024"; //2562965013025024 人民币
      //组织本币汇率
      jsxx["nnatexchrate"] = 1;
      //结算币种
      jsxx["vsettlecurrency"] = "2562965013025024"; //2562965013025024 人民币
      //期望收款金额
      jsxx["nsettlesummny"] = item._widget_1667527234550;
      //期望收款金额-本币
      jsxx["nnatsettlesummny"] = item._widget_1667527234550;
      //操作标识
      jsxx["_status"] = "Insert";
      jsxxArr.push(jsxx);
      //添加报销明细数组
      map["expensebillbs"] = bxmxArr;
      //添加费用分摊数组
      map["expapportions"] = fyftArr;
      //添加结算信息数组
      map["expsettleinfos"] = jsxxArr;
      mapArr["data"] = map;
      saveData.push(mapArr);
      let ysHeader = {};
      //保存路径
      let url = "https://www.example.com/" + access_token;
      let apiResponse = postman("post", url, JSON.stringify(ysHeader), JSON.stringify(mapArr));
      let saveResponse = JSON.parse(apiResponse);
      if (saveResponse.code == 200) {
        //回写jdy同步状态
        //参数
        let data_id = item._id; //获取表单id
        let jdyBody = {
          app_id: "youridHere",
          entry_id: "youridHere", //youridHere 对公预付核销
          data_id: data_id,
          data: {
            _widget_1671177248829: {
              value: 1
            }
          }
        };
        //简道云地址
        let url3 = "https://www.example.com/";
        let apiResponse3 = apiman("post", url3, JSON.stringify(header2), JSON.stringify(jdyBody));
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
      } else {
        throw new Error("流水号:" + serialNumber + ",保存失败!错误原因如下：" + apiResponse);
      }
    });
    return { saveData };
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
          throw new Error("流水号:" + serialNumber + ",没有查到组织id");
        } else {
          return res[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",组织编码为空!");
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
    //根据供应商编码查询ys供应商id
    function getSupplier(supplier, serialNumber) {
      if (supplier != "" && supplier != null) {
        let sql3 = "select id from aa.vendor.Vendor where code = '" + supplier + "'";
        let res3 = ObjectStore.queryByYonQL(sql3, "yssupplier");
        if (res3.length == 0) {
          throw new Error("流水号:" + serialNumber + ",没有查到供应商id");
        } else {
          return res3[0].id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",供应商编码为空!");
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
          throw new Error("流水号:" + serialNumber + ",没有查到费用类型id或jdy商机id");
        } else {
          return expenseTypeInfo.id;
        }
      } else {
        throw new Error("流水号:" + serialNumber + ",费用类型编码或jdy商机编码为空!");
      }
    }
    //根据客户编码查询ys客户id
    function getCustomer(serialNumber, customer) {
      let sql3 = "select id from aa.merchant.Merchant where code = '" + customer + "'";
      let res3 = ObjectStore.queryByYonQL(sql3, "u8c-auth");
      if (res3.length == 0) {
        throw new Error("流水号:" + serialNumber + "根据简道云客户编码未查到客户ID");
      } else {
        return res3[0].id;
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });