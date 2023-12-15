viewModel.get("button40dk") &&
  viewModel.get("button40dk").on("click", function (data) {
    // 模态框--单击
    //获取选中行的行号
    var event = viewModel.getGridModel().getSelectedRows();
    if (event.length == 0) {
      cb.utils.alert("请选择，要弹窗的信息!");
      return;
    }
    if (event.length > 1) {
      cb.utils.alert("只能查看一条物料用量");
      return;
    }
    var testing = cb.rest.invokeFunction("AT15F164F008080007.jcdd.GetMaterialCode", { event: event }, function (err, res) {}, viewModel, { async: false });
    if (testing.error) {
      cb.utils.confirm("查询数据异常：" + testing.error.message);
      return;
    } else {
      var body = testing.result.body;
      let box = {
        billtype: "VoucherList", // 单据类型
        billno: "1c853b09", // 单据号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          body: body
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", box, viewModel);
    }
  });
viewModel.get("button45vh") &&
  viewModel.get("button45vh").on("click", function (data) {
    // 终止--单击
    const event = viewModel.getAllData();
    var checkStatus = event.checkStatus;
    var id = event.id;
    var ponseApi = cb.rest.invokeFunction("AT15F164F008080007.jcdd.Detectiontatus", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (ponseApi.error) {
      cb.utils.confirm("错误信息：" + ponseApi.error.message);
    } else {
      viewModel.execute("refresh");
    }
  });
viewModel.get("button82zb") &&
  viewModel.get("button82zb").on("click", function (data) {
    // 生成材料出库--单击
    var event = viewModel.getAllData();
    var djid = event.id;
    var ponseApi = cb.rest.invokeFunction("AT15F164F008080007.jcdd.Materialdelivery", { id: djid }, function (err, res) {}, viewModel, { async: false });
    if (ponseApi.error) {
      cb.utils.confirm("错误信息：" + ponseApi.error.message);
    } else {
      var Detect = ponseApi.result.Detect;
      var DetectList = ponseApi.result.Detect.DetectList;
      var checkStatus = Detect.DetectData.checkStatus;
      if (checkStatus != 10) {
        cb.utils.confirm("只有在检测中的时候才能生成材料出库");
        return;
      }
      var mages = "";
      var cNum = 0;
      var sNum = 0;
      a: for (var i = 0; i < DetectList.length; i++) {
        var DetectListData = DetectList[i];
        var Materialdelivery = DetectListData.Materialdelivery != undefined ? DetectListData.Materialdelivery : undefined;
        if (Materialdelivery != undefined) {
          mages += "第【" + i + "】行，" + "【" + Materialdelivery + "】已生成!\n";
          sNum += 1;
          continue a;
        }
        Detect.BOMwhid = DetectListData.billOfMaterial;
        Detect.DetectList = DetectListData;
        //物料清单
        var ponseBOMwh = cb.rest.invokeFunction("AT15F164F008080007.jcdd.BOMListSelect", { Detect: Detect }, function (err, res) {}, viewModel, { async: false });
        if (ponseBOMwh.error) {
          mages += "第【" + i + "】行，" + "生成材料出库失败：" + ponseBOMwh.error.message + "\n";
          sNum += 1;
          continue a;
        } else {
          cNum += 1;
        }
      }
      cb.utils.confirm("成功【" + cNum + "】条;\n" + "失败【" + sNum + "】条;\n" + "失败详情原因：\n" + mages + "");
      viewModel.execute("refresh");
    }
  });
viewModel.on("customInit", function (data) {
  // 检测订单详情--页面初始化
  var gridModelGoods = viewModel.getGridModel("BOMImportList");
  gridModelGoods.on("afterCellValueChange", function (params) {
    var rowIndex = params.rowIndex;
    var cellName = params.cellName;
    var value = params.value.bommingchen;
    if (cellName == "billOfMaterial_bombianma") {
      gridModelGoods.setCellValue(rowIndex, "billOfMaterial_bommingchen", value);
    }
  });
  viewModel.on("afterLoadData", function () {
    //数据加载完成后
    var userRes = cb.rest.invokeFunction("AT15F164F008080007.sampleRece.getUserData", {}, function (err, res) {}, viewModel, { async: false });
    if (userRes.error) {
      cb.utils.alert(userRes.error.message);
      return false;
    }
    var userData = userRes.result.returnData; //当前登陆信息
    //权限管理字段
    var roleCode = userData.roleCode;
    //实验室主任(Lab-DRA)/检测主管(Lab-JCZG)
    if (roleCode.indexOf("Lab-DRA") > -1 || roleCode.indexOf("Lab-JCZG") > -1 || roleCode.indexOf("0002") > -1) {
      viewModel.get("taxRateVO_name").setVisible(false); //检测项目税率(%)
      viewModel.get("jcprojecthanshuidanjia").setVisible(false); //检测项目含税单价
      viewModel.get("jcprojectwushuidanjia").setVisible(false); //检测项目无税单价
      viewModel.get("jcprojectshuie").setVisible(false); //检测项目税额
    } else if (roleCode.indexOf("Lab-JC") > -1 || roleCode.indexOf("Lab-JCZG") > -1 || roleCode.indexOf("0002") > -1) {
      viewModel.get("taxRateVO_name").setVisible(false); //检测项目税率(%)
      viewModel.get("jcprojecthanshuidanjia").setVisible(false); //检测项目含税单价
      viewModel.get("jcprojectwushuidanjia").setVisible(false); //检测项目无税单价
      viewModel.get("jcprojectshuie").setVisible(false); //检测项目税额
      viewModel.get("taxRate_ntaxRate").setVisible(false); //委外税率(%)
      viewModel.get("weiwaihanshuidanjia").setVisible(false); //委外含税单价
      viewModel.get("weiwaiwushuidanjia").setVisible(false); //委外无税单价
      viewModel.get("yuancailiao").setVisible(false); //生产成本_原材料
      viewModel.get("shiji").setVisible(false); //生产成本_原材料_试剂
      viewModel.get("haocai").setVisible(false); //生产成本_原材料_耗材
      viewModel.get("rengong").setVisible(false); //生产成本_人工
      viewModel.get("gongzi").setVisible(false); //生产成本_人工_工资
      viewModel.get("jiangjin").setVisible(false); //生产成本_人工_奖金
      viewModel.get("yanglaobaoxian").setVisible(false); //生产成本_人工_社保_养老保险
      viewModel.get("yiliaobaoxian").setVisible(false); //生产成本_人工_社保_医疗保险
      viewModel.get("shiyebaoxian").setVisible(false); //生产成本_人工_社保_失业保险
      viewModel.get("shengyubaoxian").setVisible(false); //生产成本_人工_社保_生育保险
      viewModel.get("gongshangbaoxian").setVisible(false); //生产成本_人工_社保_工伤保险
      viewModel.get("gongjijin").setVisible(false); //生产成本_人工_公积金
      viewModel.get("yuangongfuli").setVisible(false); //生产成本_人工_员工福利
      viewModel.get("gongxuweiwaifei").setVisible(false); //生产成本_委外服务费_工序委外费
      viewModel.get("shengchanchengben").setVisible(false); //生产成本_辅助生产成本
      viewModel.get("allMoney").setVisible(false); //成本总金额
    }
  });
});
viewModel.on("modeChange", function (data) {
  setTimeout(function () {
    if (data == "add" || data == "edit") {
      //新增
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    } else {
      //浏览
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    }
  }, 50);
});
//删行后
viewModel.getGridModel().on("afterDeleteRows", function (rows) {
  var gxwwzfy = Number(viewModel.get("gongxuweiwaifei").getValue());
  for (var i = 0; i < rows.length; i++) {
    var rowsDate = rows[i];
    var bomtype = rowsDate.bomType;
    if (bomtype == "02") {
      var gxdj = rowsDate.wushuijine;
      gxwwzfy = gxwwzfy - gxdj;
    }
  }
  viewModel.get("gongxuweiwaifei").setValue(gxwwzfy.toFixed(2));
});
//删行前
viewModel.on("beforeDeleteRow", function (args) {
  var rowsList = args.data;
  for (var i = 0; i < rowsList.length; i++) {
    var hh = rowsList[i];
    var event = viewModel.getGridModel().getRow(hh);
    var bomtype = event.bomType; //01 自检   02  委外
    if (bomtype == "02") {
      var istype = event.hasOwnProperty("caigoudingdanhao");
      if (istype == true) {
        cb.utils.alert("选择的【委外工序】含有已经【生成采购订单】无法删除！", "error");
        return false;
      }
    } else {
      var istype = event.hasOwnProperty("Materialdelivery");
      if (istype == true) {
        cb.utils.alert("选择的【自检工序】含有已经【生成材料出库单】无法删除！", "error");
        return false;
      }
    }
  }
});