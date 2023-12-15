viewModel.on("beforeSave", function (args) {
  debugger;
  let fieldSMapping = viewModel.getCache("fieldSMapping");
  if (args && args.data && args.data.data) {
    //获取变更后的数据
    let dataJson = JSON.parse(args.data.data);
    //变动单字表数据
    let bodyItems = dataJson.bodies;
    if (dataJson.changetype == "fixedassetsinfo_userdefine") {
      bodyItems.forEach((item) => {
        let beUserDefs = {};
        let afUserDefs = {};
        let attrextId = item["extendCharcterId"] || "";
        for (let itemFieldKey in fieldSMapping) {
          let fieldBefKey = itemFieldKey + "Bef";
          let atrextKey = fieldSMapping[itemFieldKey];
          let atrextValue = item[itemFieldKey];
          let atrextBefValue = item[fieldBefKey];
          if (atrextValue != atrextBefValue) {
            beUserDefs[atrextKey] = atrextBefValue || "";
            afUserDefs[atrextKey] = atrextValue || "";
          }
        }
        if (attrextId) {
          afUserDefs.id = attrextId;
          beUserDefs.id = attrextId;
        }
        if (Object.keys(afUserDefs).length > 0) {
          item.beUserDefs = beUserDefs;
          item.afUserDefs = afUserDefs;
        }
      });
      args.data.data = JSON.stringify(dataJson);
    }
  }
});
viewModel.on("customInit", function (data) {
  //固定资产变动单--页面初始化
  cb.rest.invokeFunction(
    "FA.billChange.defineToAttrext",
    {},
    function (err, res) {
      let { fieldSMapping } = res;
      viewModel.setCache("fieldSMapping", fieldSMapping);
    },
    viewModel,
    { async: true }
  );
});