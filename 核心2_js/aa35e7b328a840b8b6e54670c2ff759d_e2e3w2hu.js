var index = viewModel.getParams().line;
function formatData(val) {
  var out_res = "";
  if (val == undefined || val == "" || val == null) {
    out_res = "";
  } else {
    out_res = val;
  }
  return out_res;
}
viewModel.on("afterLoadData", function (data) {
  // 盘管现场登记明细表(模态框)详情--页面初始化
  debugger;
  var bh = viewModel.getParams().shoujixinghao;
  viewModel.get("coilRegistrationDetails_wasteidList");
  viewModel.get("begin_date_v1").setValue(formatData(bh.begin_date_v1)); //开始时间
  viewModel.get("end_date_v1").setValue(formatData(bh.end_date_v1)); //结束时间
  viewModel.get("length").setValue(formatData(bh.length)); //长度
  viewModel.get("material_v1").setValue(formatData(bh.material_v1)); //物料
  viewModel.get("material_v1_name").setValue(formatData(bh.material_v1_name)); //物料
  viewModel.get("material_name").setValue(formatData(bh.material_name)); //物料编码
  viewModel.get("weigth").setValue(formatData(bh.weigth)); //净重
  viewModel.get("principal_measurement").setValue(formatData(bh.principal_measurement)); //主计量
  viewModel.get("stock_keeping_unit_name").setValue(formatData(bh.stock_keeping_unit_name)); //库存单位
  viewModel.get("stock_keeping_unit_id").setValue(formatData(bh.stock_keeping_unit_id)); //库存单位id
  viewModel.get("average_outside_diameter").setValue(formatData(bh.average_outside_diameter)); //平均外径
  viewModel.get("roundness").setValue(formatData(bh.roundness)); //圆度
  viewModel.get("lap_width").setValue(formatData(bh.lap_width)); //搭接宽度
  viewModel.get("min_wall_thickness").setValue(formatData(bh.min_wall_thickness)); //最小壁厚
  viewModel.get("max_wall_thickness").setValue(formatData(bh.max_wall_thickness)); //最大壁厚
  viewModel.get("penacengzuixiaohoudu").setValue(formatData(bh.penacengzuixiaohoudu)); //PE内层最小厚度
  viewModel.get("pewaicengzuixiaohoudu").setValue(formatData(bh.pewaicengzuixiaohoudu)); //PE外层最小厚度
  viewModel.get("chanpinpanduan_v1").setValue(formatData(bh.chanpinpanduan_v1)); //产品判断
  viewModel.get("production_condition").setValue(formatData(bh.production_condition)); //生产状况id
  viewModel.get("production_condition_name").setValue(formatData(bh.production_condition_name)); //生产状况
  viewModel.get("godown_type_v1").setValue(formatData(bh.godown_type_v1)); //入库方式
  viewModel.get("auxiliary_worker_code_v1").setValue(formatData(bh.auxiliary_worker_code_v1)); //辅助工编号
  viewModel.get("auxiliary_worker_v1_name").setValue(formatData(bh.auxiliary_worker_v1_name)); //辅助工
  viewModel.get("pantiaoma").setValue(formatData(bh.pantiaoma)); //盘条码
  viewModel.get("foreman_code_v1").setValue(formatData(bh.foreman_code_v1)); //领班编号
  viewModel.get("foreman_name").setValue(formatData(bh.foreman_name)); //领班
  viewModel.get("inspector_code_v1").setValue(formatData(bh.inspector_code_v1)); //检验员编号
  viewModel.get("inspector_v1_name").setValue(formatData(bh.inspector_v1_name)); //检验员
  viewModel.get("waste_product").setValue(formatData(bh.waste_product)); //废品物料
  viewModel.get("waste_product_name").setValue(formatData(bh.waste_product_name)); //废品物料
  viewModel.get("waste_product_code").setValue(formatData(bh.waste_product_code)); //废品物料编码
});
viewModel.get("button14sh") &&
  viewModel.get("button14sh").on("click", function (data) {
    // 确定--单击
    var data_v1 = viewModel.getAllData();
    var line_v1 = viewModel.getParams().shoujixinghao.line;
    var date_v2 = new Date(data_v1.begin_date_v1);
    var date_v3 = new Date(data_v1.end_date_v1);
    var time3 = Date.parse(date_v2);
    var time4 = Date.parse(date_v3);
    if (data_v1.godown_type_v1 == "3") {
      if (data_v1.waste_product == undefined || data_v1.waste_product == "") {
        alert("废品物料不能为空");
        return;
      }
    }
    var timestamp_v1 = time4 - time3;
    if (timestamp_v1 >= 0) {
      if (0 <= timestamp_v1 && timestamp_v1 <= 28800000) {
        var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
        var gridModel = parentViewModel.get("coilRegistrationDetailsList");
        var line_v2 = gridModel.getSelectedRowIndexes();
        var all_data = gridModel.getData();
        var num = all_data.length - 1;
        if (all_data.length >= 2) {
          var flag = all_data[all_data.length - 2].rukufangshi;
        }
        if (flag == "1") {
          line_v1 = num;
        }
        if (data_v1.godown_type_v1 == "3") {
          gridModel.setCellState(line_v1, "length", "readOnly", true);
          data_v1.length = "0";
        }
        let a = gridModel.updateRow(index, {
          begin_date_v1: data_v1.begin_date_v1, //开始时间
          end_date_v1: data_v1.end_date_v1, //结束时间
          material_v1: data_v1.material_v1,
          material_v1_name: data_v1.material_v1_name, //物料
          waste_product: data_v1.waste_product,
          waste_product_name: data_v1.waste_product_name, //废品物料
          waste_product_code: data_v1.waste_product_code, //废品物料编码
          material_name: data_v1.material_name, //物料编码
          length: data_v1.length, //长度
          weigth: data_v1.weigth, //净重
          average_outside_diameter: data_v1.average_outside_diameter, //平均外径
          roundness: data_v1.roundness, //圆度
          lap_width: data_v1.lap_width, //搭接宽度
          min_wall_thickness: data_v1.min_wall_thickness, //最小壁厚
          max_wall_thickness: data_v1.max_wall_thickness, //最大壁厚
          penacengzuixiaohoudu: data_v1.penacengzuixiaohoudu, //PE内层最小厚度
          pewaicengzuixiaohoudu: data_v1.pewaicengzuixiaohoudu, //PE外层最小厚度
          chanpinpanduan_v1: data_v1.chanpinpanduan_v1, //产品判断
          production_condition: data_v1.production_condition, //生产状况id
          production_condition_name: data_v1.production_condition_name, //生产状况
          principal_measurement: data_v1.principal_measurement, //主计量
          stock_keeping_unit_name: data_v1.stock_keeping_unit_name, //库存单位
          stock_keeping_unit_id: data_v1.stock_keeping_unit_id, //库存单位id
          godown_type_v1: data_v1.godown_type_v1, //入库方式
          auxiliary_worker_code_v1: data_v1.auxiliary_worker_code_v1, //辅助工编号
          auxiliary_worker_v1_name: data_v1.auxiliary_worker_v1_name, //辅助工
          pantiaoma: data_v1.pantiaoma, //盘条码
          foreman_code_v1: data_v1.foreman_code_v1, //领班编号
          foreman_name: data_v1.foreman_name, //领班
          inspector_code_v1: data_v1.inspector_code_v1, //检验员编号
          inspector_v1_name: data_v1.inspector_v1_name //检验员
        });
        console.log(a);
        if (data_v1.godown_type_v1 != undefined && data_v1.production_condition_name != undefined && data_v1.chanpinpanduan_v1 != undefined) {
          //计算废品汇总数量
          if (data_v1.godown_type_v1 == "3") {
            if (viewModel.getParams().shoujixinghao.weigth == null) {
              viewModel.getParams().shoujixinghao.weigth = 0;
            }
            if (flag == "1") {
              viewModel.getParams().shoujixinghao.weigth = all_data[all_data.length - 1].weigth;
            }
          }
          var end_date_v1 = Date.parse(new Date(data_v1.end_date_v1));
          //开始时间时间戳
          var begin_date_v1 = Date.parse(new Date(data_v1.begin_date_v1));
          for (var i = 0; i < all_data.length - 1; i++) {
            debugger;
            end_date_v1 = Date.parse(new Date(all_data[i].end_date_v1)) + end_date_v1;
            begin_date_v1 = Date.parse(new Date(all_data[i].begin_date_v1)) + begin_date_v1;
          }
          var hours = Math.ceil((end_date_v1 - begin_date_v1) / 3600000);
          parentViewModel.get("summary_time").setValue(hours);
          //计算汇总长度
          if (data_v1.godown_type_v1 != "3") {
            var length_host = parentViewModel.get("summary_length").getValue();
            if (viewModel.getParams().shoujixinghao.length == null) {
              viewModel.getParams().shoujixinghao.length = 0;
            }
            if (flag == "1") {
              viewModel.getParams().shoujixinghao.length = all_data[all_data.length - 1].length;
            }
            var total_length = parseFloat(length_host) - parseFloat(viewModel.getParams().shoujixinghao.length) + parseFloat(data_v1.length);
            if (data_v1.length != undefined && total_length != undefined) {
              parentViewModel.get("summary_length").setValue(total_length);
            } else {
              parentViewModel.get("summary_length").setValue(length_host);
            }
          }
          //计算汇总长度
          if (true) {
            var alllength_data = gridModel.getData();
            var lengthAllAdd = 0;
            for (var i = 0; i < alllength_data.length; i++) {
              lengthAllAdd += parseInt(alllength_data[i].length);
            }
            parentViewModel.get("summary_length").setValue(lengthAllAdd);
          }
          //计算汇总重量
          var weigth_host = parentViewModel.get("summary_weight").getValue();
          if (viewModel.getParams().shoujixinghao.weigth == null) {
            viewModel.getParams().shoujixinghao.weigth = 0;
          }
          if (flag == "1") {
            viewModel.getParams().shoujixinghao.weigth = all_data[all_data.length - 1].weigth;
          }
          var total_weight = parseFloat(weigth_host) - parseFloat(viewModel.getParams().shoujixinghao.weigth) + parseFloat(data_v1.weigth);
          if (data_v1.weigth != undefined && total_weight != undefined) {
            parentViewModel.get("summary_weight").setValue(total_weight);
          } else {
            parentViewModel.get("summary_weight").setValue(weigth_host);
          }
          //汇总重量
          if (true) {
            var alllength_data = gridModel.getData();
            var weigthAllAdd = 0;
            for (var i = 0; i < alllength_data.length; i++) {
              weigthAllAdd += parseInt(alllength_data[i].weigth);
            }
            parentViewModel.get("summary_weight").setValue(weigthAllAdd);
          }
          let waste_quantity = 0;
          for (let i = 0; i < all_data.length; i++) {
            if (all_data[i].godown_type_v1 == "3") {
              waste_quantity += parseFloat(all_data[i].weigth);
            }
          }
          //增加废品重量
          if (data_v1.godown_type_v1 == "3") {
            waste_quantity += parseFloat(data_v1.weigth);
          }
          //设置废品汇总数量
          parentViewModel.get("waste_quantity").setValue(parseFloat(waste_quantity));
          viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
        } else {
          alert("必填项不能为空");
        }
        var aaa = data_v1.godown_type_v1;
      } else {
        alert("时间相差不能大于八个小时");
      }
    } else {
      alert("结束时间不能超过开始时间");
    }
  });
viewModel.get("button15if") &&
  viewModel.get("button15if").on("click", function (data) {
    // 保存并新增--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    var gridModel = parentViewModel.get("coilRegistrationDetailsList");
    var all_data = gridModel.getData();
    var data_v1 = viewModel.getAllData();
    var line_v1 = viewModel.getParams().shoujixinghao.line;
    var date_v2 = new Date(data_v1.begin_date_v1);
    var date_v3 = new Date(data_v1.end_date_v1);
    var time3 = Date.parse(date_v2);
    var time4 = Date.parse(date_v3);
    var timestamp_v1 = time4 - time3;
    if (0 <= timestamp_v1 && timestamp_v1 <= 28800000) {
      if (data_v1.godown_type_v1 == "3") {
        gridModel.setCellState(all_data.length - 1, "length", "readOnly", true);
        data_v1.length = "0";
      }
      gridModel.updateRow(index, {
        begin_date_v1: data_v1.begin_date_v1, //开始时间
        end_date_v1: data_v1.end_date_v1, //结束时间
        material_v1: data_v1.material_v1,
        material_v1_name: data_v1.material_v1_name, //物料
        material_name: data_v1.material_name, //物料编码
        length: data_v1.length, //长度
        weigth: data_v1.weigth, //净重
        average_outside_diameter: data_v1.average_outside_diameter, //平均外径
        roundness: data_v1.roundness, //圆度
        lap_width: data_v1.lap_width, //搭接宽度
        waste_product: data_v1.waste_product,
        waste_product_name: data_v1.waste_product_name, //废品物料
        waste_product_code: data_v1.waste_product_code, //废品物料编码
        min_wall_thickness: data_v1.min_wall_thickness, //最小壁厚
        max_wall_thickness: data_v1.max_wall_thickness, //最大壁厚
        principal_measurement: data_v1.principal_measurement, //主计量
        stock_keeping_unit_name: data_v1.stock_keeping_unit_name, //库存单位
        stock_keeping_unit_id: data_v1.stock_keeping_unit_id, //库存单位id
        penacengzuixiaohoudu: data_v1.penacengzuixiaohoudu, //PE内层最小厚度
        pewaicengzuixiaohoudu: data_v1.pewaicengzuixiaohoudu, //PE外层最小厚度
        chanpinpanduan_v1: data_v1.chanpinpanduan_v1, //产品判断
        production_condition: data_v1.production_condition, //生产状况
        production_condition_name: data_v1.production_condition_name, //生产状况
        godown_type_v1: data_v1.godown_type_v1, //入库方式
        auxiliary_worker_code_v1: data_v1.auxiliary_worker_code_v1, //辅助工编号
        auxiliary_worker_v1_name: data_v1.auxiliary_worker_v1_name, //辅助工
        pantiaoma: data_v1.pantiaoma, //盘条码
        foreman_code_v1: data_v1.foreman_code_v1, //领班编号
        foreman_name: data_v1.foreman_name, //领班
        inspector_code_v1: data_v1.inspector_code_v1, //检验员编号
        inspector_v1_name: data_v1.inspector_v1_name, //检验员
        rukufangshi: "1"
      });
      index = all_data.length;
      if (data_v1.godown_type_v1 != undefined && data_v1.production_condition_name != undefined && data_v1.chanpinpanduan_v1 != undefined) {
        //计算废品汇总数量
        if (data_v1.godown_type_v1 == "3") {
          if (viewModel.getParams().shoujixinghao.weigth == null) {
            viewModel.getParams().shoujixinghao.weigth = 0;
          }
        }
        //计算汇总工时
        let h = Date.parse(date_v2);
        let j = Date.parse(date_v3);
        var formerly_time = Date.parse(new Date(viewModel.getParams().shoujixinghao.end_date_v1));
        if (j != formerly_time) {
          let k = j - h;
          let l = formerly_time - h;
          var hours = parseInt(k / (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          var before_hours = parseInt(l / (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          var collect_hours = parentViewModel.get("summary_time").getValue();
          parentViewModel.get("summary_time").setValue(parseInt(collect_hours) - parseInt(before_hours) + parseInt(hours));
        }
        //计算汇总长度
        var length_host = parentViewModel.get("summary_length").getValue();
        if (viewModel.getParams().shoujixinghao.length == null) {
          viewModel.getParams().shoujixinghao.length = 0;
        }
        var total_length = parseFloat(length_host) - parseFloat(viewModel.getParams().shoujixinghao.length) + parseFloat(data_v1.length);
        if (data_v1.length != undefined && total_length != undefined) {
          parentViewModel.get("summary_length").setValue(total_length);
        } else {
          parentViewModel.get("summary_length").setValue(length_host);
        }
        //计算汇总重量
        var weigth_host = parentViewModel.get("summary_weight").getValue();
        if (viewModel.getParams().shoujixinghao.weigth == null) {
          viewModel.getParams().shoujixinghao.weigth = 0;
        }
        var total_weight = parseFloat(weigth_host) - parseFloat(viewModel.getParams().shoujixinghao.weigth) + parseFloat(data_v1.weigth);
        if (data_v1.weigth != undefined && total_weight != undefined) {
          parentViewModel.get("summary_weight").setValue(total_weight);
        } else {
          parentViewModel.get("summary_weight").setValue(weigth_host);
        }
        viewModel.clear();
        var begin_time = gridModel.getCellValue(all_data.length - 1, "end_date_v1");
        viewModel.get("begin_date_v1").setValue(begin_time); //开始时间
        viewModel.get("end_date_v1").setValue(data_v1.end_date_v1); //结束时间
        viewModel.get("material_v1").setValue(data_v1.material_v1);
        viewModel.get("material_v1_name").setValue(data_v1.material_v1_name); //物料
        viewModel.get("material_name").setValue(data_v1.material_name); //物料编码
        viewModel.get("principal_measurement").setValue(data_v1.principal_measurement); //物料编码
        viewModel.get("stock_keeping_unit_name").setValue(data_v1.stock_keeping_unit_name); //库存单位
        viewModel.get("stock_keeping_unit_id").setValue(data_v1.stock_keeping_unit_id); //库存单位id
        gridModel.insertRow(all_data.length + 1, {
          begin_date_v1: data_v1.begin_date_v1, //开始时间
          end_date_v1: data_v1.end_date_v1, //结束时间
          material_v1: data_v1.material_v1,
          material_v1_name: data_v1.material_v1_name, //物料
          material_name: data_v1.material_name, //物料编码
          principal_measurement: data_v1.principal_measurement, //主计量
          stock_keeping_unit_name: data_v1.stock_keeping_unit_name, //库存单位
          stock_keeping_unit_id: data_v1.stock_keeping_unit_id //库存单位id
        });
        let waste_quantity = 0;
        for (let i = 0; i < all_data.length; i++) {
          if (all_data[i].godown_type_v1 == "3") {
            waste_quantity += parseFloat(all_data[i].weigth);
          }
        }
        //增加废品重量
        if (data_v1.godown_type_v1 == "3") {
          waste_quantity += parseFloat(data_v1.weigth);
        }
        //设置废品汇总数量
        parentViewModel.get("waste_quantity").setValue(parseFloat(waste_quantity));
      } else {
        alert("必填项不能为空");
      }
    } else {
      alert("时间相差不能大于八个小时");
    }
  });
viewModel.get("chanpinpanduan_v1") &&
  viewModel.get("chanpinpanduan_v1").on("afterValueChange", function (data) {
    // 产品判定--值改变后
    debugger;
    if (data.value.text == "一级管") {
      viewModel.get("production_condition").setValue("1733989597330276355"); //生产状况id
      viewModel.get("production_condition_name").setValue("正常生产"); //生产状况
      viewModel.get("godown_type_v1").setValue("1"); //入库方式
    } else if (data.value.text == "待用管") {
      viewModel.get("production_condition").setValue("1733989597330276355"); //生产状况id
      viewModel.get("production_condition_name").setValue("正常生产"); //生产状况
      viewModel.get("godown_type_v1").setValue("1"); //入库方式
    } else if (data.value.text == "不可回收料") {
      viewModel.get("godown_type_v1").setValue("3"); //入库方式
    } else {
    }
  });