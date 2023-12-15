viewModel.on("customInit", function (data) {
  // 老邻居部门管理详情--页面初始化
  viewModel.on("afterRule", function (event) {
    let item254td = viewModel.get("item254td").getValue();
    if (item254td === "1") {
      let lljnumbertype = viewModel.get("lLJnumberType").getValue();
      console.log("lljnumbertype", lljnumbertype);
    }
  });
});
viewModel.get("codeNO") &&
  viewModel.get("codeNO").on("afterValueChange", function (data) {
    // 部门序号--值改变后
    let ssOrgCode = viewModel.get("item905pi").getValue();
    let item1109sf = viewModel.get("item1109sf").getValue(); //本部门所属组织编码
    let sysparentcode = viewModel.get("sysparentcode").getValue();
    let LLJnumberType = viewModel.get("item843li").getValue();
    let number = viewModel.get("codeNO").getValue() + "";
    let OrgCode = "";
    if (LLJnumberType === "A") {
      if (number.length === 6) {
        const str = number.substring(4);
        OrgCode = ssOrgCode + LLJnumberType + str + "0";
        viewModel.get("OrgCode").setValue(OrgCode);
      } else if (number.length === 7) {
        const str = number.substring(4);
        OrgCode = ssOrgCode + LLJnumberType + str;
        viewModel.get("OrgCode").setValue(OrgCode);
      } else if (number.length === 4) {
        OrgCode = ssOrgCode + LLJnumberType + number;
        viewModel.get("OrgCode").setValue(OrgCode);
      }
    } else if (LLJnumberType === "B") {
      if (number.length !== 2 && number.length !== 4) {
        const str = number.substring(3);
        OrgCode = ssOrgCode + LLJnumberType + str;
        viewModel.get("OrgCode").setValue(OrgCode);
      } else if (number.length === 4) {
        OrgCode = ssOrgCode + LLJnumberType + number;
        viewModel.get("OrgCode").setValue(OrgCode);
      }
    }
    if (number === "01") {
      OrgCode = item1109sf + "A" + "000";
      viewModel.get("OrgCode").setValue(OrgCode);
    } else if (number === "02") {
      OrgCode = item1109sf + "B" + "000";
      viewModel.get("OrgCode").setValue(OrgCode);
    }
    if (number === "01") {
      OrgCode = item1109sf + "A" + "000";
      viewModel.get("OrgCode").setValue(OrgCode);
    } else if (number === "02") {
      OrgCode = item1109sf + "B" + "000";
      viewModel.get("OrgCode").setValue(OrgCode);
    }
  });
viewModel.get("parent_name") &&
  viewModel.get("parent_name").on("afterValueChange", function (data) {
    // 上级分类--值改变后
    //所属组织编码
    let ssOrgCode = viewModel.get("item905pi").getValue();
    let isbizunit = data.value.isbizunit;
    if (isbizunit === "1") {
      ssOrgCode = data.value.OrgCode;
      viewModel.get("parentorg").setValue(data.value.id);
      viewModel.get("sysparentorg").setValue(data.value.sysOrg);
      ssOrgCode = data.value.OrgCode;
    } else if (isbizunit === "0") {
      ssOrgCode = data.value.sysparentorgcode;
      viewModel.get("parentorg_name").setValue(data.value.parentorg_name);
      viewModel.get("sysparentorg_name").setValue(data.value.sysparentorg_name);
      viewModel.get("parentorg").setValue(data.value.parentorg);
      viewModel.get("sysparentorg").setValue(data.value.sysparentorg);
    }
    let OrgCode = "";
    let LLJnumberType = viewModel.get("item843li").getValue();
    let number = viewModel.get("codeNO").getValue() + "";
    if (number !== "undefined" && number.length !== 0 && number !== null) {
      if (LLJnumberType === "A") {
        if (number.length === 6) {
          const str = number.substring(4);
          OrgCode = ssOrgCode + LLJnumberType + str + "0";
          viewModel.get("OrgCode").setValue(OrgCode);
        } else if (number.length === 7) {
          const str = number.substring(4);
          OrgCode = ssOrgCode + LLJnumberType + str;
          viewModel.get("OrgCode").setValue(OrgCode);
        }
      } else if (LLJnumberType === "B") {
        const str = number.substring(3);
        OrgCode = ssOrgCode + LLJnumberType + str;
        viewModel.get("OrgCode").setValue(OrgCode);
      }
    }
    viewModel.get("item1109sf").setValue(ssOrgCode);
  });
viewModel.get("item843li") &&
  viewModel.get("item843li").on("afterValueChange", function (data) {
    // 部门类型--值改变后
    let item843li = viewModel.get("item843li").getValue();
    viewModel.get("lLJnumberType").setValue(item843li);
  });