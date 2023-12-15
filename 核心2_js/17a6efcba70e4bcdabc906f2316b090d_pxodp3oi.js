viewModel.on("afterProcessWorkflow", function (args) {
  let nabuchengjiefang = viewModel.get("nabuchengjiefang");
  let hideV = nabuchengjiefang.__data.bShowIt;
  debugger;
  if (nabuchengjiefang.__data.bShowIt) {
    nabuchengjiefang.setState("bIsNull", false);
  } else {
    nabuchengjiefang.setState("bIsNull", true);
  }
}); //内部承接方
viewModel.on("afterProcessWorkflow", function (args) {
  let jutizerenren_name = viewModel.get("jutizerenren_name");
  let hideV = jutizerenren_name.__data.bShowIt;
  debugger;
  if (jutizerenren_name.__data.bShowIt) {
    jutizerenren_name.setState("bIsNull", false);
  } else {
    jutizerenren_name.setState("bIsNull", true);
  }
}); //具体责任人
viewModel.on("afterProcessWorkflow", function (args) {
  let shifucainajianyi = viewModel.get("shifucainajianyi");
  let hideV = shifucainajianyi.__data.bShowIt;
  debugger;
  if (shifucainajianyi.__data.bShowIt) {
    shifucainajianyi.setState("bIsNull", false);
  } else {
    shifucainajianyi.setState("bIsNull", true);
  }
}); //是否采纳建议
viewModel.on("afterProcessWorkflow", function (args) {
  let shifouxietong = viewModel.get("shifouxietong");
  let hideV = shifouxietong.__data.bShowIt;
  debugger;
  if (shifouxietong.__data.bShowIt) {
    shifouxietong.setState("bIsNull", false);
  } else {
    shifouxietong.setState("bIsNull", true);
  }
}); //是否需要协同人
viewModel.on("afterProcessWorkflow", function (args) {
  let yNEnum = viewModel.get("yNEnum");
  let hideV = yNEnum.__data.bShowIt;
  debugger;
  if (yNEnum.__data.bShowIt) {
    yNEnum.setState("bIsNull", false);
  } else {
    yNEnum.setState("bIsNull", true);
  }
}); //是否采纳建议2
viewModel.on("afterProcessWorkflow", function (args) {
  let yNEnum = viewModel.get("yNEnum");
  let hideV = yNEnum.__data.bShowIt;
  debugger;
  if (yNEnum.__data.bShowIt) {
    yNEnum.setState("bIsNull", false);
  } else {
    yNEnum.setState("bIsNull", true);
  }
});