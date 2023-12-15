viewModel.on("customInit", function (data) {
  // 出国（境）回程详情--页面初始化
  viewModel.on("afterLoadMeta", function (data) {
    // 隐藏一个主表字段
    viewModel.get("btnModelPreview").setVisible(false);
    viewModel.get("btnBizFlowPush").setVisible(false);
  });
});
viewModel.get("cgjsqInformation_billName") &&
  viewModel.get("cgjsqInformation_billName").on("afterMount", function (data) {
    // 出国境申请信息--参照加载完成后
    let currentRowData = viewModel.getParams().currentRowData;
    let data2 = {
      cgjsqInformation_nhregistered_name: currentRowData.nhregistered || "",
      cgjsqInformation_nhidcard: currentRowData.nhidcard || "",
      cgjsqInformation_nhpolitics_name: currentRowData.nhpolitics || "",
      cgjsqInformation_nhname_name: currentRowData.nhname || "",
      cgjsqInformation_nhphone: currentRowData.nhphone || "",
      cgjsqInformation: currentRowData.id || "",
      cgjsqInformation_billName: currentRowData.billName || "",
      cgjhc: currentRowData.billName || ""
    };
    debugger;
    viewModel.get("cgjsqInformation_billName").setData(currentRowData.billName);
    viewModel.get("cgjsqInformation").setData(currentRowData.id);
    viewModel.get("cgjsqInformation_nhname_name").setData(currentRowData.nhname_name);
    viewModel.get("cgjsqInformation_nhphone").setData(currentRowData.nhphone);
    viewModel.get("cgjsqInformation_nhidcardnew").setData(currentRowData.nhidcardnew);
    viewModel.get("cgjsqInformation_nhregistered_name").setData(currentRowData.nhregistered_name);
    viewModel.get("cgjsqInformation_nhpolitics_name").setData(currentRowData.nhpolitics_name);
    viewModel.get("cgjsqInformation_nhsex").setData(currentRowData.nhsex);
    viewModel.get("cgjsqInformation_nhoffical").setData(currentRowData.nhoffical);
    viewModel.get("cgjsqInformation_nhbirthday").setData(currentRowData.nhbirthday);
    viewModel.get("cgjsqInformation_nhsecrettype").setData(currentRowData.nhsecrettype);
    viewModel.get("cgjsqInformation_nhCertificates").setData(currentRowData.nhCertificates);
    viewModel.get("cgjsqInformation_nhDestination_name").setData(currentRowData.nhDestination_name);
    viewModel.get("cgjsqInformation_nhIdleDays").setData(currentRowData.nhIdleDays);
    viewModel.get("cgjsqInformation_nhleavingReasons").setData(currentRowData.nhleavingReasons);
    viewModel.get("cgjsqInformation_nhContractPersonnel").setData(currentRowData.nhContractPersonnel);
    viewModel.get("cgjsqInformation_nhDestination_name").setData(currentRowData.nhDestination_name);
    viewModel.get("cgjsqInformation_nhCertificates").setData(currentRowData.nhCertificates);
    viewModel.get("cgjsqInformation_nhDeparture").setData(currentRowData.nhDeparture);
    viewModel.get("cgjsqInformation_nhDepartureEnd").setData(currentRowData.nhDepartureEnd);
  });