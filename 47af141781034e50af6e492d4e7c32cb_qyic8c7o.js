viewModel.on("customInit", function (data) {
  // 正式客户--页面初始化
  var viewModel = data;
  viewModel.on("afterLoadData", function () {
    console.log("正式客户afterLoadData");
    // 删除团队成员组建
    const merchantrelevant = document.getElementById("cust_aa_merchantrelevantTabPage");
    merchantrelevant && merchantrelevant.remove();
    // 回写营销一体化状态
    getSopCustStatus();
    var principals = viewModel.get("principals").getAllData();
    cb.rest.invokeFunction("GT65292AT10.backDefaultGroup.roleAuthCust", {}, function (err, res) {
      if (err == null) {
        var new_principals = [];
        console.log(res);
        //主管权限
        if (res.role_auth_cust == 2) {
          var deptId = res.AppContext.currentUser.deptId;
          for (var i in principals) {
            if (principals[i].specialManagementDep == deptId) {
              new_principals.push(principals[i]);
            }
          }
          viewModel.get("principals").setDataSource(new_principals);
        } else if (res.role_auth_cust == 1) {
          //个人权限
          var staffId = res.AppContext.currentUser.staffId;
          for (var i in principals) {
            if (principals[i].professSalesman == staffId) {
              new_principals.push(principals[i]);
            }
          }
          viewModel.get("principals").setDataSource(new_principals);
        } else {
        }
      }
    });
  });
  // 判断统一信用代码是否为空
  viewModel.on("beforeSave", function () {
    const creditCode = viewModel.get("creditCode").getValue();
    if (!creditCode) {
      let returnPromise = new cb.promise(); //同步
      cb.utils.confirm(
        "统一信用代码为空，是否继续保存？",
        function () {
          //默认异步
          //获取选中行
          return returnPromise.resolve();
        },
        function (args) {
          returnPromise.reject();
        }
      );
      return returnPromise;
    }
  });
  viewModel.on("afterTabActiveKeyChange", function (info) {
    const { key } = info;
    if (key == "qualification_infos") {
      changeTelStatus();
    }
  });
  viewModel.on("modeChange", function (mode) {
    debugger;
    if (mode == "edit" || mode == "add") {
      changeTelStatus();
      setTimeout(function () {
        const currUser = viewModel.getAppContext().user.currentPerson.id;
        // 暂时设定李安东和高祥能编辑行业
        // 如果为空那么就让编辑
        const industryModule = viewModel.get("customerIndustry_Name");
        debugger;
        if (!industryModule.getValue() || currUser == "2383428931784960" || currUser == "1838369576603910" || currUser == "2282554454446338") {
          industryModule.setDisabled(false);
        } else {
          industryModule.setDisabled(true);
        }
      }, 10);
    }
    //如果2023客户行业、业务归属编码不为空则只许集团销管编辑'周丹','夏国强','万平军','叶洋洋','江姬清','潘冬静','闫斌','赵旭','高祥','吴施南'
    //允许改行业组织
    const persons = [
      "3ce6da3d911b45d982cb6bd9e4d670ac",
      "fc0901df53d8414e855a8b67034ca8e3",
      "322c5546613040e4bd5f167314ae1ef7",
      "44657167963489792",
      "1461949214839050",
      "2282554454446338",
      "1838369576603910",
      "7bf245850f6d4a829ca7149f9b2ecfb7",
      "29735ab9c4714f64aba77ddd174c918e",
      "2466891088105728"
    ];
    //允许改行业分类
    const persons2 = [
      "3ce6da3d911b45d982cb6bd9e4d670ac",
      "fc0901df53d8414e855a8b67034ca8e3",
      "322c5546613040e4bd5f167314ae1ef7",
      "44657167963489792",
      "1461949214839050",
      "1838369576603910",
      "2282554454446338"
    ];
    debugger;
    const currPerson = viewModel.getAppContext().user.currentPerson.id;
    if (mode === "edit") {
      const define13 = viewModel.get("merchantDefine!define13").getValue();
      const define14 = viewModel.get("merchantDefine!define14").getValue();
      const isInPerson = persons.indexOf(currPerson) == -1;
      const isInPerson2 = persons2.indexOf(currPerson) == -1;
      const define13_name = viewModel.get("merchantDefine!define13_name");
      const define14_name = viewModel.get("merchantDefine!define14_name");
      // 如果不为空， 只有上面ID可以编辑
      if (!define13) {
        define13_name.setDisabled(false);
      } else {
        if (!isInPerson2) {
          define13_name.setDisabled(false);
        } else {
          define13_name.setDisabled(true);
        }
      }
      if (!define14) {
        define14_name.setDisabled(false);
      } else {
        if (!isInPerson) {
          define14_name.setDisabled(false);
        } else {
          define14_name.setDisabled(true);
        }
      }
    }
  });
  // 都能编辑联系电话
  function changeTelStatus() {
    const tel = viewModel.get("contactTel");
    setTimeout(function () {
      tel.setDisabled(false);
    }, 10);
  }
  function getSopCustStatus() {
    const id = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction(
      "SFA.itapi.GetCustomerById",
      {
        id: id
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    const curPrincipal = viewModel.get("professSalesman");
    debugger;
    if (id) {
      cb.rest.invokeFunction(
        "CUST.backOpenApiFunction.getSopCustStatus",
        {
          id: viewModel.get("id").getValue()
        },
        function (err, res) {
          console.log(err);
          if (!err) {
            const message = JSON.parse(res.message);
            if (message.Status == "0") {
              let _data = message.Body.GetCustomerByCrmId;
              // 只要有通过的 那么就让通过
              const filterData = Array.isArray(_data) && _data.filter((item) => item.masterDataCode.length > 0);
              if (filterData.length > 0) {
                viewModel.get("merchantDefine!define5").setValue("审批通过");
                // 保存状态
                saveCustomer("审批通过");
                return;
              }
              let data = "";
              if (Array.isArray(_data)) {
                _data.sort((a, b) => {
                  if (a.MDM_TS < b.MDM_TS) {
                    return -1;
                  }
                  if (a.MDM_TS > b.MDM_TS) {
                    return 1;
                  }
                  return 0;
                });
                data = _data[0];
              } else {
                data = _data;
              }
              const sopName =
                data.masterDataCode.length == 0 && data.masterDataAudit === "2"
                  ? "审批不通过"
                  : data.masterDataCode.length == 0 && data.masterDataAudit === "0"
                  ? "审批中"
                  : data.masterDataCode.length > 0
                  ? "审批通过"
                  : "待提交";
              debugger;
              viewModel.get("merchantDefine!define5").setValue(sopName);
              // 保存状态
              saveCustomer(sopName);
            } else {
              viewModel.get("merchantDefine!define5").setValue(message.Description);
              // 保存状态
              saveCustomer(message.Description);
            }
          }
        }
      );
    }
  }
  function saveCustomer(sopName) {
    const id = viewModel.get("id").getValue();
    if (id) {
      cb.rest.invokeFunction(
        "CUST.rule.saveCust",
        {
          id: id,
          createOrg: viewModel.get("createOrg").getValue(),
          belongOrg: viewModel.get("merchantAppliedDetail!belongOrg").getValue(),
          sopStaus: sopName
        },
        function (err, res) {}
      );
    }
  }
  data.get("principals").on("beforeBrowse", function (args) {
    args.context.setState("refKeyField", "name");
    // 选择人员前根据组织过滤
    if (args.cellName === "professSalesman_Name") {
      args.context.setFilter("");
    }
  });
  if (viewModel.getAppContext().user.currentPerson.id == "2424360431358208") {
    debugger;
    let datas = {
      billtype: "Voucher", // 单据类型
      billno: "ybaa66bd6f", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit" // (卡片页面区分编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", datas, viewModel);
  }
});
viewModel.get("name") &&
  viewModel.get("name").on("blur", function (data) {
    // 客户名称--失去焦点的回调
    // 当客户名称改变的时候，暂时让行业可以编辑。之后调整完毕，在注释
    if (!industryModule.getValue()) {
      setTimeout(function () {
        viewModel.get("customerIndustry_Name").setDisabled(false);
      }, 3000);
    }
  });