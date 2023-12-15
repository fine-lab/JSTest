viewModel.get("button128oe") &&
  viewModel.get("button128oe").on("click", function (data) {
    // 付款按钮--单击
    debugger;
    let cardData = viewModel.getData();
    let amountPayable = 0;
    cardData.purchaseOrders.forEach((e) => {
      amountPayable += e.amountPayable;
    });
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "6b292d81",
        params: {
          mode: "add",
          domainKey: "yourKeyHere",
          code: cardData.code,
          name: cardData["headParallel!orderSubject"],
          price: amountPayable
        }
      },
      viewModel
    );
  });