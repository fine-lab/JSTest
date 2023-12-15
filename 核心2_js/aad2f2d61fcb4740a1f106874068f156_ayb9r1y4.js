viewModel.on("customInit", function (data) {
  // 测试员工角色详情--页面初始化
  debugger;
  var tt = cb.rest.invokeFunction("GT102917AT3.API.roleTest", {}, function (err, res) {}, viewModel, { async: false });
  var data = tt.result.currentUser;
  //获取当前用户姓名
  var name = data.name;
  var options = {
    domainKey: "yourKeyHere",
    async: false
  };
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "https://www.example.com/",
      method: "POST",
      options: options
    }
  });
  var reqParams = {
    page: {
      pageSize: 20,
      pageIndex: 1,
      totalCount: 1
    },
    billnum: "sys_authority",
    condition: {
      commonVOs: [
        {
          itemName: "schemeName",
          value1: "全部身份类型查询"
        },
        {
          itemName: "isDefault",
          value1: true
        },
        {
          itemName: "name",
          value1: name
        }
      ],
      filtersId: "yourIdHere",
      solutionId: 1102914164,
      bInit: true
    },
    bEmptyWithoutFilterTree: false,
    serviceCode: "u8c_GZTACT020",
    refimestamp: "1661398544688",
    ownDomain: "u8c-auth"
  };
  var def = proxy.settle(reqParams, function (err, result) {});
  if (def.err) {
    cb.utils.alert("未获得授权权限");
    return false;
  } else {
    var userDate = def.result.recordList;
    if (userDate.length > 0) {
      var userId = null;
      for (var i = 0; i < userDate.length; i++) {
        if (def.result.recordList[i].yhtUserId == data.id) {
          userId = userDate[i].id;
          break;
        }
      }
      if (userId == null) {
        cb.utils.alert("1111111");
        //表单字段进行隐藏、只读操作
      } else {
        var proxy1 = cb.rest.DynamicProxy.create({
          settle: {
            url: "https://www.example.com/" + userId,
            method: "GET",
            options: options
          }
        });
        var reqParams1 = { page: { pageSize: 20, pageIndex: 1, totalCount: 2 } };
        var gta = proxy1.settle(reqParams1, function (err1, result1) {});
        if (gta.err1) {
          cb.utils.alert("未获得授权权限");
          return false;
        } else {
          var GridModel = viewModel.getGridModel("BasicInformationDetailsList");
          var FrontSunGrideModel = viewModel.getGridModel("BeforetheconstructionList");
          var InSunGridModel = viewModel.getGridModel("constructionofList");
          var AfterSunGridModel = viewModel.getGridModel("CompletionoftheList");
          var SecuritySunGridModel = viewModel.getGridModel("qualitySafetyInspectionList");
          for (var role = 0; role < gta.result.roles.length; role++) {
            var roleName = gta.result.roles[role].name;
            // 判断角色是否是监理
            if (roleName == "监理") {
              viewModel.get("Acceptance_date").setState("bCanModify", false);
              viewModel.get("contractno").setState("bCanModify", false);
              viewModel.get("PartyA").setState("bCanModify", false);
              viewModel.get("ProjectName").setState("bCanModify", false);
              viewModel.get("dizhi").setState("bCanModify", false);
              viewModel.get("ziduan6").setState("bCanModify", false);
              viewModel.get("beizhu").setState("bCanModify", false);
              viewModel.get("frequency").setState("bCanModify", false);
              GridModel.setColumnState("Productionworknumber", "bCanModify", false);
              GridModel.setColumnState("layer", "bCanModify", false);
              GridModel.setColumnState("standing", "bCanModify", false);
              GridModel.setColumnState("door", "bCanModify", false);
              GridModel.setColumnState("branch_name", "bCanModify", false);
              GridModel.setColumnState("Supervisorystaff_name", "bCanModify", false);
              GridModel.setColumnState("Hitachisupervision", "bCanModify", false);
              GridModel.setColumnState("clerk", "bCanModify", false);
              GridModel.setColumnState("model", "bCanModify", false);
              GridModel.setColumnState("installationgroup_name", "bCanModify", false);
              GridModel.setColumnState("state", "bCanModify", false);
              FrontSunGrideModel.setColumnState("shangerpairiqi", "bCanModify", false);
              FrontSunGrideModel.setColumnState("rilifahuoriqi", "bCanModify", false);
              FrontSunGrideModel.setColumnState("gaozhidanwei", "bCanModify", false);
              FrontSunGrideModel.setColumnState("gaozhiriqi", "bCanModify", false);
              InSunGridModel.setColumnState("baodiaoriqin", "bCanModify", false);
              InSunGridModel.setColumnState("baoyanriqi", "bCanModify", false);
              InSunGridModel.setColumnState("jihuayanshouriqin", "bCanModify", false);
              InSunGridModel.setColumnState("jianjiantijiaoriqi", "bCanModify", false);
              InSunGridModel.setColumnState("jianjianshenpiwanchengriqi", "bCanModify", false);
              InSunGridModel.setColumnState("changjianbaogao", "bCanModify", false);
              InSunGridModel.setColumnState("diaoshiwanchengriqi", "bCanModify", false);
              InSunGridModel.setColumnState("quxiandabiaoqingkuangn", "bCanModify", false);
              InSunGridModel.setColumnState("daquxiancishu", "bCanModify", false);
              InSunGridModel.setColumnState("tuidiao", "bCanModify", false);
              InSunGridModel.setColumnState("tuijianriqi", "bCanModify", false);
              InSunGridModel.setColumnState("tuijianwanchengriqi", "bCanModify", false);
              InSunGridModel.setColumnState("jijianbaogao", "bCanModify", false);
              SecuritySunGridModel.setColumnState("diaolangongfajianchariqin", "bCanModify", false);
              SecuritySunGridModel.setColumnState("diaolangongfachouchan", "bCanModify", false);
              SecuritySunGridModel.setColumnState("diaolangongfachuxiancaidann", "bCanModify", false);
              SecuritySunGridModel.setColumnState("an2gongfashenqingn", "bCanModify", false);
              SecuritySunGridModel.setColumnState("an2gongfashenqingchuxiancaidann", "bCanModify", false);
              SecuritySunGridModel.setColumnState("an2gongfajianchariqi", "bCanModify", false);
              SecuritySunGridModel.setColumnState("jiaoshoujiajianchariqi", "bCanModify", false);
              SecuritySunGridModel.setColumnState("jiaoshoujiajianchan", "bCanModify", false);
              SecuritySunGridModel.setColumnState("jiaoshoujiachuxiancaidann", "bCanModify", false);
              SecuritySunGridModel.setColumnState("anquanzhenggaiwanchengriqin", "bCanModify", false);
              SecuritySunGridModel.setColumnState("daoguijianyanriqi", "bCanModify", false);
              SecuritySunGridModel.setColumnState("zhiliangzijianriqi", "bCanModify", false);
              SecuritySunGridModel.setColumnState("zhiliangzijianchuxiancaidann", "bCanModify", false);
              AfterSunGridModel.setColumnState("riliquerenwangong", "bCanModify", false);
              AfterSunGridModel.setColumnState("shifuhege", "bCanModify", false);
              AfterSunGridModel.setColumnState("zhibaohetongshuangfanggaizhang", "bCanModify", false);
              AfterSunGridModel.setColumnState("shiyongdengjizhengbanliriqi", "bCanModify", false);
              AfterSunGridModel.setColumnState("ziliaoyijiaobiao", "bCanModify", false);
              AfterSunGridModel.setColumnState("wangongdaiwanchengriqi", "bCanModify", false);
            } else {
              // 判断角色信息是否是安装文员
              if (roleName == "安装文员") {
                FrontSunGrideModel.setColumnState("jianliweixinqun", "bCanModify", false);
                FrontSunGrideModel.setColumnState("yicidipanjianchabaogao", "bCanModify", false);
                FrontSunGrideModel.setColumnState("xianchangjianchazhaopian", "bCanModify", false);
                FrontSunGrideModel.setColumnState("wenxintishi", "bCanModify", false);
                FrontSunGrideModel.setColumnState("baozhuangziliaotishi", "bCanModify", false);
                FrontSunGrideModel.setColumnState("ercidipanjianchabaogao", "bCanModify", false);
                FrontSunGrideModel.setColumnState("kehushigongjihua", "bCanModify", false);
                FrontSunGrideModel.setColumnState("fangyangdipanjianchabaogao", "bCanModify", false);
                FrontSunGrideModel.setColumnState("kaigongbaogao", "bCanModify", false);
                FrontSunGrideModel.setColumnState("chuchanghegezheng", "bCanModify", false);
                FrontSunGrideModel.setColumnState("gaozhiriqi", "bCanModify", false);
                FrontSunGrideModel.setColumnState("jihuajinchangriqi", "bCanModify", false);
                FrontSunGrideModel.setColumnState("gaozhidanwei", "bCanModify", false);
                InSunGridModel.setColumnState("jinchangriqi", "bCanModify", false);
                InSunGridModel.setColumnState("jianjiantijiaoriqi", "bCanModify", false);
                InSunGridModel.setColumnState("jianjianshenpiwanchengriqi", "bCanModify", false);
                InSunGridModel.setColumnState("changjianbaogao", "bCanModify", false);
                InSunGridModel.setColumnState("rilisanlingqingkuang", "bCanModify", false);
                InSunGridModel.setColumnState("kyshangbaoqingkuang", "bCanModify", false);
                SecuritySunGridModel.setColumnState("diaolangongfajianchariqin", "bCanModify", false);
                SecuritySunGridModel.setColumnState("diaolangongfachouchan", "bCanModify", false);
                SecuritySunGridModel.setColumnState("diaolangongfachuxiancaidann", "bCanModify", false);
                SecuritySunGridModel.setColumnState("an2gongfashenqingn", "bCanModify", false);
                SecuritySunGridModel.setColumnState("an2gongfashenqingchuxiancaidann", "bCanModify", false);
                SecuritySunGridModel.setColumnState("an2gongfajianchariqi", "bCanModify", false);
                SecuritySunGridModel.setColumnState("jiaoshoujiajianchariqi", "bCanModify", false);
                SecuritySunGridModel.setColumnState("jiaoshoujiajianchan", "bCanModify", false);
                SecuritySunGridModel.setColumnState("jiaoshoujiachuxiancaidann", "bCanModify", false);
                SecuritySunGridModel.setColumnState("anquanzhenggaiwanchengriqin", "bCanModify", false);
                SecuritySunGridModel.setColumnState("daoguijianyanriqi", "bCanModify", false);
                SecuritySunGridModel.setColumnState("zhiliangzijianriqi", "bCanModify", false);
                SecuritySunGridModel.setColumnState("zhiliangzijianchuxiancaidann", "bCanModify", false);
                InSunGridModel.setColumnState("jihuayanshouriqin", "bCanModify", false);
                InSunGridModel.setColumnState("shijiyanshouriqi", "bCanModify", false);
                InSunGridModel.setColumnState("jihuajijianriqin", "bCanModify", false);
                InSunGridModel.setColumnState("shijijijianriqi", "bCanModify", false);
                InSunGridModel.setColumnState("quxiandabiaoqingkuangn", "bCanModify", false);
                InSunGridModel.setColumnState("daquxiancishu", "bCanModify", false);
                InSunGridModel.setColumnState("tuijianriqi", "bCanModify", false);
                InSunGridModel.setColumnState("tuidiao", "bCanModify", false);
                InSunGridModel.setColumnState("tuijianwanchengriqi", "bCanModify", false);
                AfterSunGridModel.setColumnState("zhibaohetongshuangfanggaizhang", "bCanModify", false);
                AfterSunGridModel.setColumnState("shiyongdengjizhengbanliriqi", "bCanModify", false);
                AfterSunGridModel.setColumnState("diantiyijiaoquerenshu", "bCanModify", false);
                AfterSunGridModel.setColumnState("ziliaoyijiaobiao", "bCanModify", false);
                AfterSunGridModel.setColumnState("shiyongdengjizhengwanchengriqi", "bCanModify", false);
                AfterSunGridModel.setColumnState("wangongdaiwanchengriqi", "bCanModify", false);
              } else {
                // 判断角色信息是否是质检
                if (roleName == "质检") {
                  viewModel.get("Acceptance_date").setState("bCanModify", false);
                  viewModel.get("contractno").setState("bCanModify", false);
                  viewModel.get("PartyA").setState("bCanModify", false);
                  viewModel.get("ProjectName").setState("bCanModify", false);
                  viewModel.get("dizhi").setState("bCanModify", false);
                  viewModel.get("ziduan6").setState("bCanModify", false);
                  viewModel.get("beizhu").setState("bCanModify", false);
                  viewModel.get("frequency").setState("bCanModify", false);
                  GridModel.setColumnState("Productionworknumber", "bCanModify", false);
                  GridModel.setColumnState("layer", "bCanModify", false);
                  GridModel.setColumnState("standing", "bCanModify", false);
                  GridModel.setColumnState("door", "bCanModify", false);
                  GridModel.setColumnState("branch_name", "bCanModify", false);
                  GridModel.setColumnState("Supervisorystaff_name", "bCanModify", false);
                  GridModel.setColumnState("Hitachisupervision", "bCanModify", false);
                  GridModel.setColumnState("clerk", "bCanModify", false);
                  GridModel.setColumnState("model", "bCanModify", false);
                  GridModel.setColumnState("installationgroup_name", "bCanModify", false);
                  GridModel.setColumnState("state", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("jianliweixinqun", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("yicidipanjianchabaogao", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("xianchangjianchazhaopian", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("wenxintishi", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("baozhuangziliaotishi", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("shangerpairiqi", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("ercidipanjianchabaogao", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("rilifahuoriqi", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("kehushigongjihua", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("fangyangdipanjianchabaogao", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("kaigongbaogao", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("chuchanghegezheng", "bCanModify", false);
                  FrontSunGrideModel.setColumnState("jihuajinchangriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("jinchangriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("baodiaoriqin", "bCanModify", false);
                  InSunGridModel.setColumnState("baoyanriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("changjianbaogao", "bCanModify", false);
                  InSunGridModel.setColumnState("rilisanlingqingkuang", "bCanModify", false);
                  InSunGridModel.setColumnState("kyshangbaoqingkuang", "bCanModify", false);
                  InSunGridModel.setColumnState("quxiandabiaoqingkuangn", "bCanModify", false);
                  InSunGridModel.setColumnState("daquxiancishu", "bCanModify", false);
                  InSunGridModel.setColumnState("tuijianriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("tuidiao", "bCanModify", false);
                  InSunGridModel.setColumnState("tuijianwanchengriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("renwudanjihuayanshouwanchengriq", "bCanModify", false);
                  InSunGridModel.setColumnState("jihuayanshouriqin", "bCanModify", false);
                  InSunGridModel.setColumnState("shijiyanshouriqi", "bCanModify", false);
                  InSunGridModel.setColumnState("jihuajijianriqin", "bCanModify", false);
                  InSunGridModel.setColumnState("shijijijianriqi", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("diaolangongfajianchariqin", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("diaolangongfachouchan", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("diaolangongfachuxiancaidann", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("an2gongfashenqingn", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("an2gongfashenqingchuxiancaidann", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("an2gongfajianchariqi", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("jiaoshoujiajianchariqi", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("jiaoshoujiajianchan", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("jiaoshoujiachuxiancaidann", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("anquanzhenggaiwanchengriqin", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("daoguijianyanriqi", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("zhiliangzijianriqi", "bCanModify", false);
                  SecuritySunGridModel.setColumnState("zhiliangzijianchuxiancaidann", "bCanModify", false);
                  AfterSunGridModel.setColumnState("diantiyijiaoquerenshu", "bCanModify", false);
                  AfterSunGridModel.setColumnState("ziliaoyijiaobiao", "bCanModify", false);
                  AfterSunGridModel.setColumnState("riliquerenwangong", "bCanModify", false);
                  AfterSunGridModel.setColumnState("shifuhege", "bCanModify", false);
                } else {
                  // 判断角色信息是否是质安
                  if (roleName == "质安") {
                    viewModel.get("Acceptance_date").setState("bCanModify", false);
                    viewModel.get("contractno").setState("bCanModify", false);
                    viewModel.get("PartyA").setState("bCanModify", false);
                    viewModel.get("ProjectName").setState("bCanModify", false);
                    viewModel.get("dizhi").setState("bCanModify", false);
                    viewModel.get("ziduan6").setState("bCanModify", false);
                    viewModel.get("beizhu").setState("bCanModify", false);
                    viewModel.get("frequency").setState("bCanModify", false);
                    GridModel.setColumnState("Productionworknumber", "bCanModify", false);
                    GridModel.setColumnState("layer", "bCanModify", false);
                    GridModel.setColumnState("standing", "bCanModify", false);
                    GridModel.setColumnState("door", "bCanModify", false);
                    GridModel.setColumnState("branch_name", "bCanModify", false);
                    GridModel.setColumnState("Supervisorystaff_name", "bCanModify", false);
                    GridModel.setColumnState("Hitachisupervision", "bCanModify", false);
                    GridModel.setColumnState("clerk", "bCanModify", false);
                    GridModel.setColumnState("model", "bCanModify", false);
                    GridModel.setColumnState("installationgroup_name", "bCanModify", false);
                    GridModel.setColumnState("state", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("jianliweixinqun", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("yicidipanjianchabaogao", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("xianchangjianchazhaopian", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("wenxintishi", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("baozhuangziliaotishi", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("shangerpairiqi", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("ercidipanjianchabaogao", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("rilifahuoriqi", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("kehushigongjihua", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("fangyangdipanjianchabaogao", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("kaigongbaogao", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("chuchanghegezheng", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("jihuajinchangriqi", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("gaozhidanwei", "bCanModify", false);
                    FrontSunGrideModel.setColumnState("gaozhiriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("jinchangriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("baodiaoriqin", "bCanModify", false);
                    InSunGridModel.setColumnState("baoyanriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("rilisanlingqingkuang", "bCanModify", false);
                    InSunGridModel.setColumnState("kyshangbaoqingkuang", "bCanModify", false);
                    InSunGridModel.setColumnState("jianjiantijiaoriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("renwudanjihuayanshouwanchengriq", "bCanModify", false);
                    InSunGridModel.setColumnState("jihuayanshouriqin", "bCanModify", false);
                    InSunGridModel.setColumnState("shijiyanshouriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("jihuajijianriqin", "bCanModify", false);
                    InSunGridModel.setColumnState("shijijijianriqi", "bCanModify", false);
                    InSunGridModel.setColumnState("jijianbaogao", "bCanModify", false);
                    AfterSunGridModel.setColumnState("riliquerenwangong", "bCanModify", false);
                    AfterSunGridModel.setColumnState("shifuhege", "bCanModify", false);
                    AfterSunGridModel.setColumnState("zhibaohetongshuangfanggaizhang", "bCanModify", false);
                    AfterSunGridModel.setColumnState("shiyongdengjizhengbanliriqi", "bCanModify", false);
                    AfterSunGridModel.setColumnState("ziliaoyijiaobiao", "bCanModify", false);
                    AfterSunGridModel.setColumnState("wangongdaiwanchengriqi", "bCanModify", false);
                    AfterSunGridModel.setColumnState("riliquerenwangong", "bCanModify", false);
                    AfterSunGridModel.setColumnState("shifuhege", "bCanModify", false);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});