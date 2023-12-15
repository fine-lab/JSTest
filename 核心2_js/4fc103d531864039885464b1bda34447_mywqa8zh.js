viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    // 获取
    viewModel.get("product.name").on("beforeBrowse", function () {
      debugger;
      // 获取当前编辑行的品牌字段值
      const value = viewModel.get("org_id").getValue();
      // 实现品牌的过滤
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productOrgs.orgId",
        op: "eq",
        value1: value
      });
      this.setFilter(condition);
    });
  });
viewModel.get("product_name") &&
  viewModel.get("product_name").on("afterValueChange", function (data) {
    // 物料(系统)--值改变后
    // 获取
    viewModel.get("product.name").on("beforeBrowse", function () {
      debugger;
      // 获取当前编辑行的品牌字段值
      const value = viewModel.get("org_id").getValue();
      // 实现品牌的过滤
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productOrgs.orgId",
        op: "eq",
        value1: value
      });
      this.setFilter(condition);
    });
  });