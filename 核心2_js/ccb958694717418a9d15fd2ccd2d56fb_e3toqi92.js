viewModel.on("afterWorkflow", function (args) {
  //获取审批状态：同意：2  退回：4  撤回：1
  let verifystate = args.res.verifystate;
  //退回后删除单据
  if (verifystate === 4) {
    //获取单据id
    let id = args.res.id;
    console.log(JSON.stringify(args));
    // 获取两个子表并封闭成array;
    let rp_prom_solution_scopeList = [];
    var temp = args.res.rp_prom_solution_scopeList;
    for (var i = 0; i < temp.length; i++) {
      let newobject = { id: "" };
      newobject.id = temp[i].id;
      //获取list中的id,用做删除
      rp_prom_solution_scopeList.push(newobject);
    }
    let rp_prom_solution_configList = [];
    var temp2 = args.res.rp_prom_solution_configList;
    for (var i = 0; i < temp2.length; i++) {
      let newobject = { id: "" };
      newobject.id = temp2[i].id;
      //获取list中的id,用做删除
      rp_prom_solution_configList.push(newobject);
    }
    //如果状态审批为4,调用后端函数删除单据,并调用后台接口告知单据已删除，让他把中间平台上的单据改成未审核
    console.log(id);
    //调用后端函数删除单据
    let result = cb.rest.invokeFunction(
      "AT19D3CA6A0868000B.backOpenApiFunction.delete4",
      { id: id, rp_prom_solution_scopeList: rp_prom_solution_scopeList, rp_prom_solution_configList: rp_prom_solution_configList },
      function (err, res) {
        console.log(err);
      },
      viewModel,
      { async: false }
    );
    args.isExtend = true;
  }
});
viewModel.get("button36hg") &&
  viewModel.get("button36hg").on("click", function (data) {
    //测试curd--单击
    var data = {
      verifystate: 0,
      rp_prom_solution_configList: [
        {
          rp_snumber: "rp_促销方案表头 文本",
          rp_code: "rp_项目编码 文本",
          rp_name: "rp_项目名称 文本",
          _status: "Insert",
          rp_is_recyle: "rp_是否循环 文本",
          rp_is_first: "rp_是否首次 文本",
          rp_full_quantity: "1",
          rp_full_quantity_unit: "rp_满额数量单位 文本",
          rp_concession_number: "1",
          rp_concession_unit: " rp_让利单位",
          rp_concession_currency: "rp_让利币种 文本",
          rp_concession_discount: "rp_打折折扣 文本",
          rp_gift_category: "rp_赠送品类别 文本",
          rp_gift_product: "rp_赠送产品 文本",
          rp_prom_id: "rp_促销方案表头id 文本",
          rp_prom_config_lineid: "rp_促销方案表体项目行id  文本",
          rp_iseffect: "是否生效 文本",
          rp_sdate: "2023-12-04 16:18:03",
          rp_edate: "2023-12-04 16:18:03",
          rp_prom_solution_id: "22222 文本"
        }
      ],
      enable: 1,
      rp_supplier: "rp_供应商  文本",
      _status: "Insert",
      rp_start_time: "2023-12-04 16:18:03",
      rp_end_time: "2023-12-04 16:18:03",
      rp_is_issue: "rp_供应商已发布  文本",
      rp_is_approve: "rp_客户已审批  文本",
      rp_prom_kind: "rp_促销范围选择依据  文本",
      rps_new_apply: "rp_区间新品适用  文本",
      rp_prom_overview: "rp_促销信息概述  文本",
      rp_prom_id: "rp_促销方案表头id 文本",
      rp_iseffect: "rp_是否生效   文本",
      rp_sdate: "2023-12-04 16:18:03",
      rp_edate: "2023-12-04 16:18:03",
      org_id: "youridHere",
      rp_prom_solution_scopeList: [
        {
          material_code: "编码 文本",
          brand: "品牌 文本",
          classes: "类别 文本",
          sdate: "2023-12-04 16:18:03",
          _status: "Insert",
          edate: "2023-12-04 16:18:03",
          prom_id: "促销方案表头id 文本",
          prom_scope_lineid: "促销方案表体范围行id 文本",
          rp_prom_solution_id: "rp_促销方案表头 文本"
        }
      ]
    };
    cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.InsertCuXFA", { data: data }, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("button52xj") &&
  viewModel.get("button52xj").on("click", function (data) {
    //测试update--单击
    var data = {
      id: "youridHere",
      rp_iseffect: "是的",
      rp_prom_solution_configList: [
        {
          rp_code: "55555",
          _status: "Insert"
        },
        {
          id: "youridHere",
          rp_code: "666",
          _status: "Update"
        },
        {
          id: "youridHere",
          _status: "Delete"
        }
      ],
      rp_prom_solution_scopeList: [
        {
          material_code: "6666",
          _status: "Insert"
        },
        {
          id: "youridHere",
          material_code: "777",
          _status: "Update"
        },
        {
          id: "youridHere",
          _status: "Delete"
        }
      ]
    };
    cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.UpdateCuXFA", { data: data }, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("button69kc") &&
  viewModel.get("button69kc").on("click", function (data) {
    var data = { code: "000016", compositions: [{ name: "rp_prom_solution_configList" }, { name: "rp_prom_solution_scopeList" }] };
    //测试select--单击
    cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.SelectCuXFA", { data: data }, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("button85lb") &&
  viewModel.get("button85lb").on("click", function (data) {
    //测试删除--单击
    var data = { id: "youridHere", rp_prom_solution_scopeList: [{ id: "youridHere" }], rp_prom_solution_configList: [{ id: "youridHere" }] };
    cb.rest.invokeFunction("AT19D3CA6A0868000B.backOpenApiFunction.DeleteCuXFA", { data: data }, function (err, res) {
      console.log(res);
    });
  });