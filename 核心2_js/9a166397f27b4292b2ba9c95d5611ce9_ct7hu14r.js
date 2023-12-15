viewModel.on("customInit", function (data) {
  // 智能货位详情--页面初始化
  console.log("============[智能货位]");
  //卡片页面数据加载完成
  viewModel.on("afterLoadData", function () {
    console.log("[afterLoadData]");
    //监听父级
    viewModel.get("item35qd_name").on("afterValueChange", function (data) {
      console.log(data);
      if (data.value !== null) {
        viewModel.get("level").setValue(parseInt(data.value.level) + 1);
      }
    });
    console.log(event);
    let pageType = data.originalParams.mode;
    var huoweiNow = viewModel.getCache("parentViewModel").selectedHuowei;
    let RFIDCode = viewModel.get("RFIDCode");
    RFIDCode.setDisabled(true);
    RFIDCode.setState("bCanModify", false);
    let nodeName = viewModel.get("name");
    nodeName.setDisabled(true);
    nodeName.setState("bCanModify", false);
    if (pageType == "edit") {
      console.log("[edit]");
      UIInitData();
    } else if (pageType == "add") {
      console.log("[add]");
      console.log(huoweiNow.length, huoweiNow.length > 0);
      // 没有树的情况
    } else {
      UIInitData();
      console.log("[UIInitData-show]");
    }
  });
  function UIInitData() {
    console.log("[UIInitData]");
    let billData = data.originalParams.billData;
    console.log(billData);
    let parentNameObj = viewModel.get("parentName");
    let warehouseID = viewModel.get("warehouseID").getValue();
    console.log(JSON.stringify(billData));
    viewModel.get("org_id").setValue(billData.org_id);
    viewModel.get("org_id_name").setDisabled(true);
    viewModel.get("locationCode").setDisabled(false);
    viewModel.get("locationName").setDisabled(false);
    viewModel.get("btnSaveAndAdd").setDisabled(false);
    viewModel.get("btnSave").setDisabled(false);
    //仓库
    let cangkuUI = viewModel.get("item66vd_name");
    viewModel.get("item66vd").setValue(billData.warehouseID);
    cangkuUI.setDisabled(true);
    cangkuUI.setState("bCanModify", false);
    cangkuUI.setValue(billData.warehouseName);
    //上级分类
    let parentUI = viewModel.get("item35qd_name");
    parentUI.setDisabled(true);
    parentUI.setState("bCanModify", false);
    if (billData.level == 1) {
      parentUI.setValue(billData.warehouseName);
      viewModel.get("item35qd").setValue(billData.warehouseID);
      viewModel.get("parent").setValue(billData.warehouseID);
      viewModel.get("parentName").setValue(billData.warehouseName);
    } else {
      parentUI.setValue(billData.parentName);
      viewModel.get("item35qd").setValue(billData.parent);
      viewModel.get("parent").setValue(billData.parent);
      viewModel.get("parentName").setValue(billData.parentName);
    }
    viewModel.get("warehouseID").setValue(billData.warehouseID);
    viewModel.get("warehouseName").setValue(billData.warehouseName);
    viewModel.get("warehouseCode").setValue(billData.warehouseCode);
    viewModel.get("level").setValue(billData.level);
  }
  //跳转页面
  viewModel.get("button15gk").on("click", function () {
    let result = getLableCode(1);
    let RFIDCode = viewModel.get("RFIDCode");
    RFIDCode.setValue(result);
    RFIDCode.setState("bCanModify", false);
    let val = viewModel.get("RFIDCode").getValue();
    if (!cb.utils.isEmpty(val)) {
      window.location.href = "DXCFMSG://" + val;
    } else {
      cb.utils.alert("发签识别，请重试");
      return false;
    }
  });
  Date.prototype.myFormat = function (format) {
    var o = {
      "M+": this.getMonth() + 1, // month
      "d+": this.getDate(), // day
      "h+": this.getHours(), // hour
      "m+": this.getMinutes(), // minute
      "s+": this.getSeconds(), // second
      "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
      S: this.getMilliseconds(),
      "f+": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    } else if (new RegExp("(f+)").test(format)) {
      var _minSeconds = this.getMilliseconds() + "";
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? ("0" + _minSeconds).substr(("" + _minSeconds).length)
          : RegExp.$1.length == 2
          ? ("00" + _minSeconds).substr(("" + _minSeconds).length)
          : ("000" + _minSeconds).substr(("" + _minSeconds).length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };
  //生成标签
  function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  }
  //数字前补零
  function prefixInteger(num, length) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
  }
  //数字后补零
  function appfixInteger(num, length) {
    if ((num + "").length < length) return appfixInteger(num + "0", length);
    else if ((num + "").length > length) return (num + "").substr(0, length);
    else return num;
  }
  function getLableCode(type) {
    var res = "B01";
    if (type == 2) res = "A01";
    res += new Date().myFormat("yyyyMMdd");
    var time = new Date().myFormat("hhmmssfff");
    res += appfixInteger(time, 9);
    //平台不支持fff
    console.log(new Date().format("yyyyMMddhhmmss"));
    var strRandomNum = randomNum(1000, 9999);
    res += strRandomNum;
    return res;
  }
  viewModel.on("beforeSave", function (args) {
    let pageType = data.originalParams.mode;
    console.log(pageType);
    //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
    console.log(args);
    // 获取单个数据的内容
    const innerdata = JSON.parse(args.data.data);
    console.log(innerdata);
    var parentParams = viewModel.getCache("parentViewModel");
    var parentId = viewModel.get("parent").getValue();
    var locationCode = viewModel.get("locationCode").getValue();
    console.log(parentId);
    if (typeof parentId == "undefined") {
      cb.utils.alert("操作异常，请刷新重试");
      return false;
    }
    let level = innerdata.level;
    if (level > 3) {
      cb.utils.alert('仅支持自建 "区域-货架-货位" 三级数据! ');
      return false;
    }
    if (pageType == "add") {
      var locationCodeCheck = cb.rest.invokeFunction("798e7edb0e4548a4ac96a64349cedc97", { parentId: parentId, locationCode: locationCode }, function (err, res) {}, viewModel, { async: false });
      const res = locationCodeCheck.result.rst;
      if (res.length > 0) {
        console.log(false);
        cb.utils.alert("货位编码已经存在，请重新输入货位编码", "error");
        return false;
      }
    }
  });
  viewModel.on("afterSave", function (params) {
    //事件发生之后，可以进行保存成功以后的特色化需求
    var parentParams = viewModel.getCache("parentViewModel");
    console.log("afterSave-------------------------------------------");
    viewModel.getCache("parentViewModel").flagBack = true;
    let pagetype = data.originalParams.mode;
    if (pagetype === "edit") {
      console.log(params.res.id);
      var nodeData = parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree")._get_data("keyMap")[params.res.id];
      console.log(nodeData);
      if (nodeData === undefined) {
        var huoweiNow = viewModel.getCache("parentViewModel").selectedHuowei;
        if (huoweiNow.length > 0) {
          var parentNode = parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree")._get_data("keyMap")[params.res.parent];
          parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").addNode(params.res, parentNode);
          parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").select(huoweiNow[0].id);
        } else {
          var parentNode = parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree")._get_data("keyMap")[params.res.parent];
          parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").addNode(params.res, parentNode);
          parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").select("");
        }
      } else {
        nodeData.name = params.res.name;
        nodeData.locationName = params.res.locationName;
        nodeData.locationCode = params.res.locationCode;
        parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").updateNode(nodeData);
      }
    } else if (pagetype === "add") {
      var huoweiNow = viewModel.getCache("parentViewModel").selectedHuowei;
      if (huoweiNow.length > 0) {
        var parentNode = parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree")._get_data("keyMap")[huoweiNow[0].id];
        parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").addNode(params.res, parentNode);
        parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").select(huoweiNow[0].id);
      } else {
        var parentNode = parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree")._get_data("keyMap")[params.res.parent];
        parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").addNode(params.res, parentNode);
        parentParams.getCache("FilterViewModel").get("parent").getFromModel().getCache("vm").get("tree").select("");
      }
    }
  });
});
viewModel.get("locationName") &&
  viewModel.get("locationName").on("afterValueChange", function (data) {
    // 名称--值改变后
    let locationName = viewModel.get("locationName");
    let nodeName = viewModel.get("name");
    nodeName.setValue(locationName.getValue());
    nodeName.setReadOnly(false);
    nodeName.setState("bCanModify", false);
    console.log("locationName" + locationName.getValue());
    console.log("locationName" + nodeName.getValue());
  });