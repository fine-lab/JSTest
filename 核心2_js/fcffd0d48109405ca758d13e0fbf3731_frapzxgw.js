viewModel.get("ProductNumb_Name_name").on("afterValueChange", function (data) {
  console.log(data);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var Coefficient; //系数初始化
  var OtherManufacturingCostMargin; //其他制造成本率
  var SalesCostMargin; //销售成本率
  var OverheadCostMargin; //管理费用率
  console.log(data.value);
  var GetMargin = cb.rest.invokeFunction("AT18B4840209080005.back.GetMargin", {}, function (err, res) {}, viewModel, { async: false });
  console.log(GetMargin);
  GetMargin = GetMargin.result.res;
  debugger;
  Transportation = GetMargin[0].Transportation == undefined ? 0.025 : GetMargin[0].Transportation; //运输
  ProfitMargin = GetMargin[0].ProfitMargin == undefined ? 0.1 : GetMargin[0].ProfitMargin / 100; //利润率
  AgencyFeeMargin = GetMargin[0].AgencyFeeMargin == undefined ? 0.04 : GetMargin[0].AgencyFeeMargin / 100; //代理利润率
  PackingMargin = GetMargin[0].PackingMargin == undefined ? 0.03 : GetMargin[0].PackingMargin / 100; //包装百分比
  Coefficient = GetMargin[0].Coefficient == undefined ? 0.15 : GetMargin[0].Coefficient / 100; //系数初始化
  OtherManufacturingCostMargin = GetMargin[0].OtherManufacturingCostMargin == undefined ? 0.67 : GetMargin[0].OtherManufacturingCostMargin / 100; //其他制造成本率
  SalesCostMargin = GetMargin[0].SalesCostMargin == undefined ? 0.08 : GetMargin[0].SalesCostMargin / 100; //销售成本率
  OverheadCostMargin = GetMargin[0].OverheadCostMargin == undefined ? 0.17 : GetMargin[0].OverheadCostMargin / 100; //管理费用率
  var aasas = viewModel.get("ProductNumb_Name_name").getValue();
  if (aasas == undefined) {
    viewModel.get("Coefficient").setValue(); //材料成本
    viewModel.get("MaterialCost").setValue(); //材料成本
    viewModel.get("ManufacturingCost").setValue(); //制造成本
    viewModel.get("OtherManufacturingCost").setValue(); //其他制造成本
    viewModel.get("SalesCost").setValue(); //销售成本
    viewModel.get("OverheadCost").setValue(); //管理费用
    viewModel.get("TotalCost").setValue(); //总成本
    viewModel.get("Packing").setValue(); //包装
    viewModel.get("Transportation").setValue(); //运输
    viewModel.get("AgencyFee").setValue(); //代理费
    viewModel.get("ProfitMargin").setValue(); //利润率
    viewModel.get("Profit").setValue(); //利润
    viewModel.get("Finalquotation").setValue(); //最终报价
    viewModel.get("ControlParameters").setValue(); //控制参数
    viewModel.get("PackingMargin").setValue(); //包装利率
    viewModel.get("AgencyFeeMargin").setValue(); //代理费利率
  }
  //费用初始化
  MaterialCost = 0;
  ManufacturingCost = 0;
  OtherManufacturingCost = 0;
  SalesCost = 0;
  OverheadCost = 0;
  Packing = 0;
  TotalCost = 0;
  AgencyFee = 0;
  Profit = 0;
  Finalquotation = 0;
  ControlParameters = 0;
  var PersonCost = 0; //人工费
  var OtherindirectCost = 0; //其他间接成本
  var BOMListViewModel = viewModel.get("BOMHelsaList");
  var RoutingListViewModel = viewModel.get("RoutingHelsaList");
  var getData = BOMListViewModel.getData();
  var getData1 = RoutingListViewModel.getData();
  var index = new Array();
  if (getData.length > 0) {
    for (var a = 0; a < getData.length; a++) {
      index.push(a);
    }
    //删除bom所有行
    BOMListViewModel.deleteRows(index);
  }
  if (getData1.length > 0) {
    index = new Array();
    for (var a = 0; a < getData1.length; a++) {
      index.push(a);
    }
    //删除rout所有行
    RoutingListViewModel.deleteRows(index);
  }
  if (data.value != null) {
    console.log(data.value.id);
    var dataBody = {
      id: data.value.id,
      code: data.value.code
    };
    debugger;
    //获取BOM routing页
    var getResultList = cb.rest.invokeFunction("AT18B4840209080005.back.GetBomList", { dataBody: dataBody }, function (err, res) {}, viewModel, { async: false });
    console.log(getResultList);
    if (getResultList.result.ProductQuotationBody.BomArray.length > 0) {
      var insertBody = new Array();
      for (var i = 0; i < getResultList.result.ProductQuotationBody.BomArray.length; i++) {
        var body = {
          Level: getResultList.result.ProductQuotationBody.BomArray[i].index,
          MaterialNumb_Name: getResultList.result.ProductQuotationBody.BomArray[i].MaterialNumb_Name,
          MaterialNumb: getResultList.result.ProductQuotationBody.BomArray[i].MaterialNumb,
          MaterialNumb_Name_name: getResultList.result.ProductQuotationBody.BomArray[i].MaterialNumb_Name_name,
          ComponentQty: getResultList.result.ProductQuotationBody.BomArray[i].BomComponent_numeratorQuantity,
          ComponentUOM: getResultList.result.ProductQuotationBody.BomArray[i].BomComponent_bomUnitName,
          Batch: getResultList.result.ProductQuotationBody.BomArray[i].Batch,
          UOM: getResultList.result.ProductQuotationBody.BomArray[i].UOM,
          UnitPrice: getResultList.result.ProductQuotationBody.BomArray[i].UnitPrice,
          Amount: getResultList.result.ProductQuotationBody.BomArray[i].Amount
        };
        MaterialCost = MaterialCost + (body.Amount == "" ? 0 : body.Amount);
        insertBody.push(body);
      }
      console.log(insertBody);
      BOMListViewModel.insertRows(1, insertBody);
    }
    if (getResultList.result.ProductQuotationBody.RoutingArray.length > 0) {
      var insertBody = new Array();
      for (var i = 0; i < getResultList.result.ProductQuotationBody.RoutingArray.length; i++) {
        var body = {
          Level: getResultList.result.ProductQuotationBody.RoutingArray[i].index,
          MaterialCode_Name: getResultList.result.ProductQuotationBody.RoutingArray[i].MaterialCode_Name,
          MaterialCode: getResultList.result.ProductQuotationBody.RoutingArray[i].MaterialCode,
          MaterialCode_Name_name: getResultList.result.ProductQuotationBody.RoutingArray[i].MaterialCode_Name_name,
          WorkCenter: getResultList.result.ProductQuotationBody.RoutingArray[i].WorkCenter,
          PreparationTime: getResultList.result.ProductQuotationBody.RoutingArray[i].PreparationTime,
          ProcessingTime: getResultList.result.ProductQuotationBody.RoutingArray[i].ProcessingTime,
          Descriptions:
            getResultList.result.ProductQuotationBody.RoutingArray[i].Description == "undefined\nundefined" ? "" + "\n" + "" : getResultList.result.ProductQuotationBody.RoutingArray[i].Description,
          LaborCost: getResultList.result.ProductQuotationBody.RoutingArray[i].LaborCost,
          OtherCost: getResultList.result.ProductQuotationBody.RoutingArray[i].OtherCost,
          IndirectCosts: getResultList.result.ProductQuotationBody.RoutingArray[i].IndirectCosts
        };
        insertBody.push(body);
        ManufacturingCost = ManufacturingCost + body.LaborCost + body.OtherCost + body.IndirectCosts;
        PersonCost = PersonCost + body.LaborCost;
        OtherindirectCost = OtherindirectCost + body.OtherCost;
      }
      console.log(insertBody);
      RoutingListViewModel.insertRows(1, insertBody);
    }
    //标体赋值
    MaterialCost = MaterialCost * (Coefficient + 1);
    OtherManufacturingCost = Math.round(parseFloat(PersonCost * OtherManufacturingCostMargin) * 10000) / 10000; //0.67
    SalesCost = Math.round(parseFloat((MaterialCost + ManufacturingCost + OtherManufacturingCost) * SalesCostMargin) * 10000) / 10000; //0.08
    OverheadCost = Math.round(parseFloat((MaterialCost + ManufacturingCost + OtherManufacturingCost) * OverheadCostMargin) * 10000) / 10000; //0.17
    TotalCost = MaterialCost + ManufacturingCost + OtherManufacturingCost + SalesCost + OverheadCost;
    Packing = TotalCost * PackingMargin;
    AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
    Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
    Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
    ControlParameters =
      Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
    debugger;
    viewModel.get("MaterialCost").setValue(MaterialCost); //材料成本
    viewModel.get("ManufacturingCost").setValue(ManufacturingCost); //制造成本
    viewModel.get("OtherManufacturingCost").setValue(OtherManufacturingCost); //其他制造成本
    viewModel.get("SalesCost").setValue(SalesCost); //销售成本
    viewModel.get("OverheadCost").setValue(OverheadCost); //管理费用
    viewModel.get("TotalCost").setValue(TotalCost); //总成本
    viewModel.get("PackingMargin").setValue(PackingMargin * 100); //包装利率
    viewModel.get("Packing").setValue(Packing); //包装
    viewModel.get("Transportation").setValue(Transportation); //运输
    viewModel.get("AgencyFeeMargin").setValue(AgencyFeeMargin * 100); //代理费利率
    viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
    viewModel.get("ProfitMargin").setValue(ProfitMargin * 100); //利润率
    viewModel.get("Profit").setValue(Profit); //利润
    viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
    viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
    viewModel.get("Coefficient").setValue(Coefficient * 100); //系数
    viewModel.get("PackingQty").setValue(getResultList.result.ProductQuotationBody.gauge.model); //系数
    viewModel.get("VersionNO").setValue(getResultList.result.ProductQuotationBody.gauge.versionCode); //系数
  }
  var notHaveCode = ` `;
  var notHaveCodeV1 = new Array();
  var cc = 0;
  if (getResultList.result.ProductQuotationBody.notHave.length > 0) {
    for (var aa = 0; getResultList.result.ProductQuotationBody.notHave.length > aa; aa++) {
      for (var bb = 0; notHaveCodeV1.length > bb; bb++) {
        if (getResultList.result.ProductQuotationBody.notHave[aa] == notHaveCodeV1[bb]) {
          cc = 1;
        }
      }
      if (cc == 1) {
        continue;
      }
      notHaveCode = `  ` + notHaveCode + getResultList.result.ProductQuotationBody.notHave[aa] + `  `;
      notHaveCodeV1.push(getResultList.result.ProductQuotationBody.notHave[aa]);
    }
    cb.utils.alert("waring MaterialCode：" + notHaveCode, "error");
  }
});
//包装利率改变
viewModel.get("PackingMargin").on("afterValueChange", function (data) {
  var viewData = viewModel.getData();
  console.log(viewData);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var PersonCost = 0;
  var OtherindirectCost = 0;
  debugger;
  for (var i = 0; i < viewData.RoutingHelsaList.length; i++) {
    PersonCost = PersonCost + viewData.RoutingHelsaList[i].LaborCost;
    OtherindirectCost = OtherindirectCost + viewData.RoutingHelsaList[i].OtherCost;
  }
  MaterialCost = viewData.MaterialCost;
  ManufacturingCost = viewData.MaterialCost;
  OtherManufacturingCost = viewData.OtherManufacturingCost;
  SalesCost = viewData.SalesCost;
  OverheadCost = viewData.OverheadCost;
  Packing = viewData.Packing;
  TotalCost = viewData.TotalCost;
  Transportation = viewData.Transportation;
  AgencyFee = viewData.AgencyFee;
  ProfitMargin = viewData.ProfitMargin;
  Profit = viewData.Profit;
  Finalquotation = viewData.Finalquotation;
  ControlParameters = viewData.ControlParameters;
  PackingMargin = viewData.PackingMargin;
  AgencyFeeMargin = viewData.AgencyFeeMargin;
  PackingMargin = PackingMargin / 100;
  ProfitMargin = ProfitMargin / 100;
  AgencyFeeMargin = AgencyFeeMargin / 100;
  debugger;
  Packing = TotalCost * PackingMargin;
  AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
  Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
  Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
  ControlParameters =
    Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
  viewModel.get("Packing").setValue(Packing); //包装
  viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
  viewModel.get("Profit").setValue(Profit); //利润
  viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
  viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
  var body = {
    PackingMargin: PackingMargin * 100,
    ProfitMargin: ProfitMargin * 100,
    AgencyFeeMargin: AgencyFeeMargin * 100
  };
});
//代理费利率
viewModel.get("AgencyFeeMargin").on("afterValueChange", function (data) {
  var viewData = viewModel.getData();
  console.log(viewData);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var PersonCost = 0;
  var OtherindirectCost = 0;
  debugger;
  for (var i = 0; i < viewData.RoutingHelsaList.length; i++) {
    PersonCost = PersonCost + viewData.RoutingHelsaList[i].LaborCost;
    OtherindirectCost = OtherindirectCost + viewData.RoutingHelsaList[i].OtherCost;
  }
  MaterialCost = viewData.MaterialCost;
  ManufacturingCost = viewData.MaterialCost;
  OtherManufacturingCost = viewData.OtherManufacturingCost;
  SalesCost = viewData.SalesCost;
  OverheadCost = viewData.OverheadCost;
  Packing = viewData.Packing;
  TotalCost = viewData.TotalCost;
  Transportation = viewData.Transportation;
  AgencyFee = viewData.AgencyFee;
  ProfitMargin = viewData.ProfitMargin;
  Profit = viewData.Profit;
  Finalquotation = viewData.Finalquotation;
  ControlParameters = viewData.ControlParameters;
  PackingMargin = viewData.PackingMargin;
  AgencyFeeMargin = viewData.AgencyFeeMargin;
  PackingMargin = PackingMargin / 100;
  ProfitMargin = ProfitMargin / 100;
  AgencyFeeMargin = AgencyFeeMargin / 100;
  debugger;
  Packing = TotalCost * PackingMargin;
  AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
  Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
  Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
  ControlParameters =
    Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
  viewModel.get("Packing").setValue(Packing); //包装
  viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
  viewModel.get("Profit").setValue(Profit); //利润
  viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
  viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
  var body = {
    PackingMargin: PackingMargin * 100,
    ProfitMargin: ProfitMargin * 100,
    AgencyFeeMargin: AgencyFeeMargin * 100
  };
});
//利润率
viewModel.get("ProfitMargin").on("afterValueChange", function (data) {
  var viewData = viewModel.getData();
  console.log(viewData);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var PersonCost = 0;
  var OtherindirectCost = 0;
  debugger;
  for (var i = 0; i < viewData.RoutingHelsaList.length; i++) {
    PersonCost = PersonCost + viewData.RoutingHelsaList[i].LaborCost;
    OtherindirectCost = OtherindirectCost + viewData.RoutingHelsaList[i].OtherCost;
  }
  MaterialCost = viewData.MaterialCost;
  ManufacturingCost = viewData.MaterialCost;
  OtherManufacturingCost = viewData.OtherManufacturingCost;
  SalesCost = viewData.SalesCost;
  OverheadCost = viewData.OverheadCost;
  Packing = viewData.Packing;
  TotalCost = viewData.TotalCost;
  Transportation = viewData.Transportation;
  AgencyFee = viewData.AgencyFee;
  ProfitMargin = viewData.ProfitMargin;
  Profit = viewData.Profit;
  Finalquotation = viewData.Finalquotation;
  ControlParameters = viewData.ControlParameters;
  PackingMargin = viewData.PackingMargin;
  AgencyFeeMargin = viewData.AgencyFeeMargin;
  PackingMargin = PackingMargin / 100;
  ProfitMargin = ProfitMargin / 100;
  AgencyFeeMargin = AgencyFeeMargin / 100;
  debugger;
  Packing = TotalCost * PackingMargin;
  AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
  Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
  Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
  ControlParameters =
    Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
  viewModel.get("Packing").setValue(Packing); //包装
  viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
  viewModel.get("Profit").setValue(Profit); //利润
  viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
  viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
  var body = {
    PackingMargin: PackingMargin * 100,
    ProfitMargin: ProfitMargin * 100,
    AgencyFeeMargin: AgencyFeeMargin * 100
  };
});
viewModel.get("Transportation").on("afterValueChange", function (data) {
  var viewData = viewModel.getData();
  console.log(viewData);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var PersonCost = 0;
  var OtherindirectCost = 0;
  debugger;
  for (var i = 0; i < viewData.RoutingHelsaList.length; i++) {
    PersonCost = PersonCost + viewData.RoutingHelsaList[i].LaborCost;
    OtherindirectCost = OtherindirectCost + viewData.RoutingHelsaList[i].OtherCost;
  }
  MaterialCost = viewData.MaterialCost;
  ManufacturingCost = viewData.MaterialCost;
  OtherManufacturingCost = viewData.OtherManufacturingCost;
  SalesCost = viewData.SalesCost;
  OverheadCost = viewData.OverheadCost;
  Packing = viewData.Packing;
  TotalCost = viewData.TotalCost;
  Transportation = viewData.Transportation;
  AgencyFee = viewData.AgencyFee;
  ProfitMargin = viewData.ProfitMargin;
  Profit = viewData.Profit;
  Finalquotation = viewData.Finalquotation;
  ControlParameters = viewData.ControlParameters;
  PackingMargin = viewData.PackingMargin;
  AgencyFeeMargin = viewData.AgencyFeeMargin;
  PackingMargin = PackingMargin / 100;
  ProfitMargin = ProfitMargin / 100;
  AgencyFeeMargin = AgencyFeeMargin / 100;
  debugger;
  Packing = TotalCost * PackingMargin;
  AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
  Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
  Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
  ControlParameters =
    Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
  viewModel.get("Packing").setValue(Packing); //包装
  viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
  viewModel.get("Profit").setValue(Profit); //利润
  viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
  viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
});
//系数
viewModel.get("Coefficient").on("afterValueChange", function (data) {
  var viewData = viewModel.getData();
  console.log(viewData);
  var MaterialCost; //材料成本
  var ManufacturingCost; //制造成本
  var OtherManufacturingCost; //其他制造成本
  var SalesCost; //销售成本
  var OverheadCost; //管理费用
  var Packing; //包装
  var TotalCost; //总成本
  var Transportation; //运输
  var AgencyFee; //代理费
  var ProfitMargin; //利润率
  var Profit; //利润
  var Finalquotation; //最终报价
  var ControlParameters; //控制参数
  var PackingMargin; //包装利率
  var AgencyFeeMargin; //代理费利率
  var Coefficient; //系数
  var PersonCost = 0;
  var OtherindirectCost = 0;
  ManufacturingCost = 0;
  MaterialCost = 0;
  for (var j = 0; j < viewData.BOMHelsaList.length; j++) {
    if (viewData.BOMHelsaList[j].Amount != "") {
      MaterialCost = MaterialCost + viewData.BOMHelsaList[j].Amount;
    }
  }
  for (var i = 0; i < viewData.RoutingHelsaList.length; i++) {
    ManufacturingCost = ManufacturingCost + viewData.RoutingHelsaList[i].IndirectCosts + viewData.RoutingHelsaList[i].LaborCost + viewData.RoutingHelsaList[i].OtherCost;
    PersonCost = PersonCost + viewData.RoutingHelsaList[i].LaborCost;
    OtherindirectCost = OtherindirectCost + viewData.RoutingHelsaList[i].OtherCost;
  }
  debugger;
  ProfitMargin = viewData.ProfitMargin;
  PackingMargin = viewData.PackingMargin;
  AgencyFeeMargin = viewData.AgencyFeeMargin;
  Coefficient = viewData.Coefficient;
  PackingMargin = PackingMargin / 100;
  ProfitMargin = ProfitMargin / 100;
  AgencyFeeMargin = AgencyFeeMargin / 100;
  Coefficient = Coefficient / 100;
  Transportation = 0;
  Transportation = viewData.Transportation;
  debugger;
  MaterialCost = MaterialCost * (Coefficient + 1);
  OtherManufacturingCost = Math.round(parseFloat(PersonCost * 0.67) * 10000) / 10000;
  SalesCost = Math.round(parseFloat((MaterialCost + ManufacturingCost + OtherManufacturingCost) * 0.08) * 10000) / 10000; //0.08
  OverheadCost = Math.round(parseFloat((MaterialCost + ManufacturingCost + OtherManufacturingCost) * 0.17) * 10000) / 10000; //0.17
  TotalCost = MaterialCost + ManufacturingCost + OtherManufacturingCost + SalesCost + OverheadCost;
  Packing = TotalCost * PackingMargin;
  AgencyFee = Math.round(parseFloat(TotalCost + Packing + Transportation) * AgencyFeeMargin * 10000) / 10000;
  Profit = Math.round(parseFloat(TotalCost + Packing + Transportation + AgencyFee) * ProfitMargin * 10000) / 10000;
  Finalquotation = TotalCost + Packing + Transportation + AgencyFee + Profit;
  ControlParameters =
    Math.round(parseFloat((Finalquotation - AgencyFee - Transportation - Packing - MaterialCost - PersonCost - OtherindirectCost) / (Finalquotation - AgencyFee - Transportation)) * 10000) / 10000;
  viewModel.get("MaterialCost").setValue(MaterialCost); //材料成本
  viewModel.get("ManufacturingCost").setValue(ManufacturingCost); //制造成本
  viewModel.get("OtherManufacturingCost").setValue(OtherManufacturingCost); //其他制造成本
  viewModel.get("SalesCost").setValue(SalesCost); //销售成本
  viewModel.get("OverheadCost").setValue(OverheadCost); //管理费用
  viewModel.get("TotalCost").setValue(TotalCost); //总成本
  viewModel.get("Packing").setValue(Packing); //包装
  viewModel.get("AgencyFee").setValue(AgencyFee); //代理费
  viewModel.get("Profit").setValue(Profit); //利润
  viewModel.get("Finalquotation").setValue(Finalquotation); //最终报价
  viewModel.get("ControlParameters").setValue(ControlParameters); //控制参数
});