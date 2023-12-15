viewModel.get("changebillrecords") &&
  viewModel.get("changebillrecords").on("beforeSetDataSource", function (data) {
    //变动记录详情--设置数据源前
    debugger;
    if (data && data.length > 0) {
      cb.rest.invokeFunction("FA.billChange.defineToAttrext", {}, function (err, res) {
        let { fieldSMapping } = res;
        data.forEach((item) => {
          if (item.changetypecode == "fixedassetsinfo_userdefine") {
            let beUserDefsStr = item.befchange
              .replaceAll(/( \d{2}:\d{2}:\d{2})/g, "")
              .replaceAll(":", '":"')
              .replaceAll(",", '","')
              .replaceAll("{", '{"')
              .replaceAll("}", '"}');
            let afUserDefsStr = item.aftchange
              .replaceAll(/( \d{2}:\d{2}:\d{2})/g, "")
              .replaceAll(":", '":"')
              .replaceAll(",", '","')
              .replaceAll("{", '{"')
              .replaceAll("}", '"}');
            let beUserDefs = JSON.parse(beUserDefsStr);
            let afUserDefs = JSON.parse(afUserDefsStr);
            for (let itemFieldKey in fieldSMapping) {
              let fieldBefKey = itemFieldKey + "Bef";
              let atrextKey = fieldSMapping[itemFieldKey];
              let atrextValue = afUserDefs[atrextKey];
              let atrextBefValue = beUserDefs[atrextKey];
              if (atrextValue) {
                item[fieldBefKey] = atrextBefValue || "";
                item[itemFieldKey] = atrextValue || "";
              }
            }
          }
        });
      });
    }
  });