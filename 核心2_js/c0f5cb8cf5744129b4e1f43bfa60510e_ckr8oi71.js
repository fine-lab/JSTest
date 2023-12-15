viewModel.get("shijianqujian") &&
  viewModel.get("shijianqujian").on("afterValueChange", function (data) {
    //时间区间--值改变后
    viewModel.getGridModel().clear();
    var res = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.SelectDragin", { data: data }, function (err, res) {}, viewModel, { async: false });
    if (res.error) {
      cb.utils.alert("错误原因:" + res.error.message);
      return;
    }
    var resArray = res.result.Alldata;
    var map = new Map();
    for (var j = 0; j < resArray.length; j++) {
      var key = resArray[j].weidu;
      var liaoyaomiao = resArray[j].liaoyaomiao;
      var depreciCost = resArray[j].zhejiu;
      var isKey = map.has(key);
      if (isKey) {
        //获取数据累加 --料苗费
        var mapData = map.get(key);
        var liaoyaomiaos = mapData.liaoyaomiao;
        liaoyaomiaos = liaoyaomiao + liaoyaomiaos;
        mapData.liaoyaomiao = liaoyaomiaos;
        //折旧费用
        var depreciCosts = mapData.zhejiu;
        depreciCosts = depreciCost + depreciCosts;
        mapData.zhejiu = depreciCosts;
        map.set(key, mapData);
      } else {
        map.set(key, resArray[j]);
      }
    }
    //精液成本
    var SemenCost = 0;
    //配种成本
    var MatingCost = 0;
    //产仔成本
    var CalvingCost = 0;
    //断奶成本
    var WeaningCost = 0;
    //出栏成本
    var ProductionCost = 0;
    var Arrays = [];
    map.forEach((v, k) => {
      Arrays.push(v);
    });
    for (var a = 0; a < Arrays.length; a++) {
      var zhuzhilx = Arrays[a].PigType;
      var costAcc = Arrays[a].liaoyaomiao + Arrays[a].money + Arrays[a].zhejiu;
      //判断类型并加入进去
      if (zhuzhilx === "1") {
        SemenCost += costAcc;
        MatingCost += costAcc;
        CalvingCost += costAcc;
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "2") {
        MatingCost += costAcc;
        CalvingCost += costAcc;
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "3") {
        SemenCost += costAcc;
        MatingCost += costAcc;
        CalvingCost += costAcc;
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "4") {
        MatingCost += costAcc;
        CalvingCost += costAcc;
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "5") {
        CalvingCost += costAcc;
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "6") {
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "7") {
        WeaningCost += costAcc;
        ProductionCost += costAcc;
      } else if (zhuzhilx === "8") {
        ProductionCost += costAcc;
      } else if (zhuzhilx === "9") {
        ProductionCost += costAcc;
      }
    }
    //批量插入数据
    for (var i = 0; i < Arrays.length; i++) {
      var zhuzhilx = Arrays[i].PigType;
      var cost = 0;
      var cbgj = 0;
      switch (zhuzhilx) {
        case "1":
          cbgj = "1";
          cost = SemenCost;
          break;
        case "2":
          cbgj = "2";
          cost = MatingCost;
          break;
        case "3":
          cbgj = "1";
          cost = SemenCost;
          break;
        case "4":
          cbgj = "2";
          cost = MatingCost;
          break;
        case "5":
          cbgj = "3";
          cost = CalvingCost;
          break;
        case "6":
          cbgj = "4";
          cost = WeaningCost;
          break;
        case "7":
          cbgj = "4";
          cost = WeaningCost;
          break;
        case "8":
          cbgj = "5";
          cost = ProductionCost;
          break;
        case "9":
          cbgj = "5";
          cost = ProductionCost;
          break;
        default:
          break;
      }
      viewModel
        .getGridModel()
        .insertRow(i, {
          picihaos: Arrays[i].picihao,
          zhuzhileixing: Arrays[i].PigType,
          liaoyaomiao: Arrays[i].liaoyaomiao,
          qijianfeiyong: Arrays[i].money,
          daitanzonge: Arrays[i].liaoyaomiao + Arrays[i].money + Arrays[i].zhejiu,
          zhejiu: Arrays[i].zhejiu,
          chengbenguiji: cost,
          chengben: cbgj
        });
    }
  });