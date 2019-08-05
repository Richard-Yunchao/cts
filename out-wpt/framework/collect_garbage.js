// tslint:disable-next-line: no-any
export function attemptGarbageCollection() {
  // tslint:disable-next-line: no-any
  const w = window;

  if (w.GCController) {
    w.GCController.collect();
    return;
  }

  if (w.opera && w.opera.collect) {
    w.opera.collect();
    return;
  }

  try {
    w.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).garbageCollect();
    return;
  } catch (e) {}

  if (w.gc) {
    w.gc();
    return;
  }

  if (w.CollectGarbage) {
    w.CollectGarbage();
    return;
  }

  let i;

  function gcRec(n) {
    if (n < 1) return; // tslint:disable-next-line: no-any

    let temp = {
      i: 'ab' + i + i / 100000
    };
    temp = temp + 'foo';
    gcRec(n - 1);
  }

  for (i = 0; i < 1000; i++) {
    gcRec(10);
  }
}
//# sourceMappingURL=collect_garbage.js.map