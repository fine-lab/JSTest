rootStore.designerScripts = {
  savebeforeSaveHook: function (rootStore, alias, event, rowStore) {
    // 保存——保存请求前事件
  },
  btnSaveonClick: function (rootStore, alias, event, rowStore) {
    // 保存——单击事件
  },
  btnSaveonClick: function () {
    // 保存——单击事件
  },
  savebeforeHook: function () {
    // 保存——保存前事件
  },
  btnSaveonBeforeClick: function () {
    // 保存——单击前
    debugger;
    let x1 = parseInt(rootStore.formStore.get("Enumerate8fi").value);
    let x2 = parseInt(rootStore.formStore.get("Enumerate19eb").value);
    let x3 = parseInt(rootStore.formStore.get("Enumerate21bc").value);
    let x4 = parseInt(rootStore.formStore.get("Enumerate27cg").value);
    let x5 = parseInt(rootStore.formStore.get("Enumerate23ze").value);
    let x6 = parseInt(rootStore.formStore.get("Enumerate25sg").value);
    let x8 = parseInt(rootStore.formStore.get("Enumerate29jd").value);
    let x9 = parseInt(rootStore.formStore.get("Enumerate31ob").value);
    let x10 = parseInt(rootStore.formStore.get("Enumerate33pc").value);
    let total = x1 + x2 + x3 + x4 + x5 + x6 + x8 + x9 + x10;
    if (total > 3) {
      rootStore.utils.message.danger("投票数据请不要超过3票");
      rootStore.actions.save.abort("阻断save");
    }
  }
}; // disabled-row-code [designerScripts-end]