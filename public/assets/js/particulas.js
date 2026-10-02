// Partículas da abertura: poeira roxa e lilás que, com o mouse (ou toque, ou Enter),
// se junta e forma o símbolo hexagonal M do Menu10. Veio da demonstração do novo visual.
// A sequência codificada contém os pontos do símbolo e não precisa ser editada.
(function () {
  "use strict";
  const secao = document.getElementById("inicio");
  const palco = document.getElementById("palco-particulas");
  const tela = document.getElementById("particulas");
  if (!secao || !palco || !tela) return;
  const ctx = tela.getContext("2d", { alpha: false });
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const bytes = atob('AOAADwDjAA8A5gAPANoAEgDdABIA6QASANQAFQDXABUA3QAVAOAAFQDjABUA5gAVAOwAFQDvABUA0QAYANoAGADdABgA4AAYAOMAGADmABgA6QAYAOwAGADyABgA9QAYAMsAGwDOABsA1AAbANcAGwDaABsA3QAbAOAAGwDjABsA5gAbAOkAGwDsABsA7wAbAPIAGwD4ABsA+wAbAMUAHgDIAB4AzgAeANEAHgDUAB4A1wAeANoAHgDdAB4A4AAeAOMAHgDmAB4A6QAeAOwAHgDvAB4A8gAeAPUAHgD7AB4A/gAeAL8AIQDCACEAyAAhAMsAIQDOACEA0QAhANQAIQDXACEA2gAhAN0AIQDgACEA4wAhAOYAIQDpACEA7AAhAO8AIQDyACEA9QAhAPgAIQD7ACEBAQAhAQQAIQC8ACQAxQAkAMgAJADLACQAzgAkANEAJADUACQA1wAkANoAJADdACQA4AAkAOMAJADmACQA6QAkAOwAJADvACQA8gAkAPUAJAD4ACQA+wAkAP4AJAEBACQBBwAkAQoAJAC2ACcAuQAnAL8AJwDCACcAxQAnAMgAJwDLACcAzgAnANEAJwDUACcA1wAnANoAJwDdACcA4AAnAOMAJwDmACcA6QAnAOwAJwDvACcA8gAnAPUAJwD4ACcA+wAnAP4AJwEBACcBBAAnAQ0AJwCwACoAswAqALkAKgC8ACoAvwAqAMIAKgDFACoAyAAqAMsAKgDOACoA0QAqANQAKgDXACoA2gAqAN0AKgDgACoA4wAqAOYAKgDpACoA7AAqAO8AKgDyACoA9QAqAPgAKgD7ACoA/gAqAQEAKgEEACoBBwAqAQoAKgEQACoBEwAqAKoALQCtAC0AtgAtALkALQC8AC0AvwAtAMIALQDFAC0AyAAtAMsALQDOAC0A0QAtANQALQDXAC0A2gAtAN0ALQDgAC0A4wAtAOYALQDpAC0A7AAtAO8ALQDyAC0A9QAtAPgALQD7AC0A/gAtAQEALQEEAC0BBwAtAQoALQENAC0BEAAtARYALQEZAC0ApwAwAKoAMACwADAAswAwALYAMAC5ADAAvAAwAL8AMADCADAAxQAwAMgAMADLADAAzgAwANEAMADUADAA1wAwANoAMADdADAA4AAwAOMAMADmADAA6QAwAOwAMADvADAA8gAwAPUAMAD4ADAA+wAwAP4AMAEBADABBAAwAQcAMAEKADABDQAwARAAMAETADABFgAwARwAMAEfADAAoQAzAKQAMwCqADMArQAzALAAMwCzADMAtgAzALkAMwC8ADMAvwAzAMIAMwDFADMAyAAzAMsAMwDOADMA0QAzANQAMwDXADMA2gAzAN0AMwDgADMA4wAzAOYAMwDpADMA7AAzAO8AMwDyADMA9QAzAPgAMwD7ADMA/gAzAQEAMwEEADMBBwAzAQoAMwENADMBEAAzARMAMwEWADMBGQAzAR8AMwEiADMAmwA2AJ4ANgCkADYApwA2AKoANgCtADYAsAA2ALMANgC2ADYAuQA2ALwANgC/ADYAwgA2AMUANgDIADYAywA2AM4ANgDRADYA1AA2ANcANgDaADYA3QA2AOAANgDjADYA5gA2AOkANgDsADYA7wA2APIANgD1ADYA+AA2APsANgD+ADYBAQA2AQQANgEHADYBCgA2AQ0ANgEQADYBEwA2ARYANgEZADYBHAA2AR8ANgElADYBKAA2AJgAOQChADkApAA5AKcAOQCqADkArQA5ALAAOQCzADkAtgA5ALkAOQC8ADkAvwA5AMIAOQDFADkAyAA5AMsAOQDOADkA0QA5ANQAOQDXADkA2gA5AN0AOQDgADkA4wA5AOYAOQDpADkA7AA5AO8AOQDyADkA9QA5APgAOQD7ADkA/gA5AQEAOQEEADkBBwA5AQoAOQENADkBEAA5ARMAOQEWADkBGQA5ARwAOQEfADkBIgA5ASUAOQErADkBLgA5AJIAPACVADwAmwA8AJ4APAChADwApAA8AKcAPACqADwArQA8ALAAPACzADwAtgA8ALkAPAC8ADwAvwA8AMIAPADFADwAyAA8AMsAPADOADwA0QA8ANQAPADXADwA2gA8AN0APADgADwA4wA8AOYAPADpADwA7AA8AO8APADyADwA9QA8APgAPAD7ADwA/gA8AQEAPAEEADwBBwA8AQoAPAENADwBEAA8ARMAPAEWADwBGQA8ARwAPAEfADwBIgA8ASUAPAEoADwBMQA8AJIAPwCYAD8AmwA/AJ4APwChAD8ApAA/AKcAPwCqAD8ArQA/ALAAPwCzAD8AtgA/ALkAPwC8AD8AvwA/AMIAPwDFAD8AyAA/AMsAPwDOAD8A0QA/ANQAPwDXAD8A2gA/AN0APwDgAD8A4wA/AOYAPwDpAD8A7AA/AO8APwDyAD8A9QA/APgAPwD7AD8A/gA/AQEAPwEEAD8BBwA/AQoAPwENAD8BEAA/ARMAPwEWAD8BGQA/ARwAPwEfAD8BIgA/ASUAPwEoAD8BKwA/AS4APwExAD8AkgBCAJgAQgCbAEIAngBCAKEAQgCkAEIApwBCAKoAQgCtAEIAsABCALMAQgC2AEIAuQBCALwAQgC/AEIAwgBCAMUAQgDIAEIAywBCAM4AQgDRAEIA1ABCANcAQgDaAEIA3QBCAOAAQgDjAEIA5gBCAOkAQgDsAEIA7wBCAPIAQgD1AEIA+ABCAPsAQgD+AEIBAQBCAQQAQgEHAEIBCgBCAQ0AQgEQAEIBEwBCARYAQgEZAEIBHABCAR8AQgEiAEIBJQBCASgAQgErAEIBLgBCATEAQgCSAEUAmABFAJsARQCeAEUAoQBFAKQARQCnAEUAqgBFAK0ARQCwAEUAswBFAMgARQDLAEUAzgBFANEARQDUAEUA1wBFANoARQDdAEUA4ABFAOMARQDmAEUA6QBFAOwARQDvAEUA8gBFAPUARQD4AEUA+wBFARAARQETAEUBFgBFARkARQEcAEUBHwBFASIARQElAEUBKABFASsARQEuAEUBMQBFAJIASACYAEgAmwBIAJ4ASAChAEgApABIAKcASACqAEgArQBIALAASACzAEgAywBIAM4ASADRAEgA1ABIANcASADaAEgA3QBIAOAASADjAEgA5gBIAOkASADsAEgA7wBIAPIASAD1AEgA+ABIAPsASAEQAEgBEwBIARYASAEZAEgBHABIAR8ASAEiAEgBJQBIASgASAErAEgBLgBIATEASACSAEsAmABLAJsASwCeAEsAoQBLAKQASwCnAEsAqgBLAK0ASwCwAEsAswBLAM4ASwDRAEsA1ABLANcASwDaAEsA3QBLAOAASwDjAEsA5gBLAOkASwDsAEsA7wBLAPIASwD1AEsA+ABLARAASwETAEsBFgBLARkASwEcAEsBHwBLASIASwElAEsBKABLASsASwEuAEsBMQBLAJIATgCYAE4AmwBOAJ4ATgChAE4ApABOAKcATgCqAE4ArQBOALAATgCzAE4A0QBOANQATgDXAE4A2gBOAN0ATgDgAE4A4wBOAOYATgDpAE4A7ABOAO8ATgDyAE4A9QBOARAATgETAE4BFgBOARkATgEcAE4BHwBOASIATgElAE4BKABOASsATgEuAE4BMQBOAJIAUQCYAFEAmwBRAJ4AUQChAFEApABRAKcAUQCqAFEArQBRALAAUQCzAFEA0QBRANQAUQDXAFEA2gBRAN0AUQDgAFEA4wBRAOYAUQDpAFEA7ABRAO8AUQDyAFEBEABRARMAUQEWAFEBGQBRARwAUQEfAFEBIgBRASUAUQEoAFEBKwBRAS4AUQExAFEAkgBUAJgAVACbAFQAngBUAKEAVACkAFQApwBUAKoAVACtAFQAsABUALMAVADUAFQA1wBUANoAVADdAFQA4ABUAOMAVADmAFQA6QBUAOwAVADvAFQBEABUARMAVAEWAFQBGQBUARwAVAEfAFQBIgBUASUAVAEoAFQBKwBUAS4AVAExAFQAkgBXAJgAVwCbAFcAngBXAKEAVwCkAFcApwBXAKoAVwCtAFcAsABXALMAVwDXAFcA2gBXAN0AVwDgAFcA4wBXAOYAVwDpAFcA7ABXARAAVwETAFcBFgBXARkAVwEcAFcBHwBXASIAVwElAFcBKABXASsAVwEuAFcBMQBXAJIAWgCYAFoAmwBaAJ4AWgChAFoApABaAKcAWgCqAFoArQBaALAAWgCzAFoA2gBaAN0AWgDgAFoA4wBaAOYAWgDpAFoA7ABaARAAWgETAFoBFgBaARkAWgEcAFoBHwBaASIAWgElAFoBKABaASsAWgEuAFoBMQBaAJIAXQCYAF0AmwBdAJ4AXQChAF0ApABdAKcAXQCqAF0ArQBdALAAXQCzAF0AxQBdAN0AXQDgAF0A4wBdAOYAXQDpAF0A/gBdARAAXQETAF0BFgBdARkAXQEcAF0BHwBdASIAXQElAF0BKABdASsAXQEuAF0BMQBdAJIAYACYAGAAmwBgAJ4AYAChAGAApABgAKcAYACqAGAArQBgALAAYACzAGAAxQBgAMgAYADgAGAA4wBgAOYAYAD7AGAA/gBgARAAYAETAGABFgBgARkAYAEcAGABHwBgASIAYAElAGABKABgASsAYAEuAGABMQBgAJIAYwCYAGMAmwBjAJ4AYwChAGMApABjAKcAYwCqAGMArQBjALAAYwCzAGMAxQBjAMgAYwDLAGMA4ABjAOMAYwD4AGMA+wBjAP4AYwEQAGMBEwBjARYAYwEZAGMBHABjAR8AYwEiAGMBJQBjASgAYwErAGMBLgBjATEAYwCSAGYAmABmAJsAZgCeAGYAoQBmAKQAZgCnAGYAqgBmAK0AZgCwAGYAswBmAMUAZgDIAGYAywBmAM4AZgD4AGYA+wBmAP4AZgEQAGYBEwBmARYAZgEZAGYBHABmAR8AZgEiAGYBJQBmASgAZgErAGYBLgBmATEAZgCSAGkAmABpAJsAaQCeAGkAoQBpAKQAaQCnAGkAqgBpAK0AaQCwAGkAswBpAMUAaQDIAGkAywBpAM4AaQDRAGkA9QBpAPgAaQD7AGkA/gBpARAAaQETAGkBFgBpARkAaQEcAGkBHwBpASIAaQElAGkBKABpASsAaQEuAGkBMQBpAJIAbACYAGwAmwBsAJ4AbAChAGwApABsAKcAbACqAGwArQBsALAAbACzAGwAxQBsAMgAbADLAGwAzgBsANEAbADyAGwA9QBsAPgAbAD7AGwA/gBsARAAbAETAGwBFgBsARkAbAEcAGwBHwBsASIAbAElAGwBKABsASsAbAEuAGwBMQBsAJIAbwCYAG8AmwBvAJ4AbwChAG8ApABvAKcAbwCqAG8ArQBvALAAbwCzAG8AxQBvAMgAbwDLAG8AzgBvANEAbwDUAG8A7wBvAPIAbwD1AG8A+ABvAPsAbwD+AG8BEABvARMAbwEWAG8BGQBvARwAbwEfAG8BIgBvASUAbwEoAG8BKwBvAS4AbwExAG8AkgByAJgAcgCbAHIAngByAKEAcgCkAHIApwByAKoAcgCtAHIAsAByALMAcgDFAHIAyAByAMsAcgDOAHIA0QByANQAcgDXAHIA7AByAO8AcgDyAHIA9QByAPgAcgD7AHIA/gByARAAcgETAHIBFgByARkAcgEcAHIBHwByASIAcgElAHIBKAByASsAcgEuAHIBMQByAJIAdQCYAHUAmwB1AJ4AdQChAHUApAB1AKcAdQCqAHUArQB1ALAAdQCzAHUAxQB1AMgAdQDLAHUAzgB1ANEAdQDUAHUA1wB1ANoAdQDpAHUA7AB1AO8AdQDyAHUA9QB1APgAdQD7AHUA/gB1ARAAdQETAHUBFgB1ARkAdQEcAHUBHwB1ASIAdQElAHUBKAB1ASsAdQEuAHUBMQB1AJIAeACYAHgAmwB4AJ4AeAChAHgApAB4AKcAeACqAHgArQB4ALAAeACzAHgAxQB4AMgAeADLAHgAzgB4ANEAeADUAHgA1wB4ANoAeADdAHgA6QB4AOwAeADvAHgA8gB4APUAeAD4AHgA+wB4AP4AeAEQAHgBEwB4ARYAeAEZAHgBHAB4AR8AeAEiAHgBJQB4ASgAeAErAHgBLgB4ATEAeACSAHsAmAB7AJsAewCeAHsAoQB7AKQAewCnAHsAqgB7AK0AewCwAHsAswB7AMUAewDIAHsAywB7AM4AewDRAHsA1AB7ANcAewDaAHsA3QB7AOAAewDmAHsA6QB7AOwAewDvAHsA8gB7APUAewD4AHsA+wB7AP4AewEQAHsBEwB7ARYAewEZAHsBHAB7AR8AewEiAHsBJQB7ASgAewErAHsBLgB7ATEAewCSAH4AmAB+AJsAfgCeAH4AoQB+AKQAfgCnAH4AqgB+AK0AfgCwAH4AswB+AMUAfgDIAH4AywB+AM4AfgDRAH4A1AB+ANcAfgDaAH4A3QB+AOAAfgDjAH4A5gB+AOkAfgDsAH4A7wB+APIAfgD1AH4A+AB+APsAfgD+AH4BEAB+ARMAfgEWAH4BGQB+ARwAfgEfAH4BIgB+ASUAfgEoAH4BKwB+AS4AfgExAH4AkgCBAJgAgQCbAIEAngCBAKEAgQCkAIEApwCBAKoAgQCtAIEAsACBALMAgQDFAIEAyACBAMsAgQDOAIEA0QCBANQAgQDXAIEA2gCBAN0AgQDgAIEA4wCBAOYAgQDpAIEA7ACBAO8AgQDyAIEA9QCBAPgAgQD7AIEA/gCBARAAgQETAIEBFgCBARkAgQEcAIEBHwCBASIAgQElAIEBKACBASsAgQEuAIEBMQCBAJIAhACYAIQAmwCEAJ4AhAChAIQApACEAKcAhACqAIQArQCEALAAhACzAIQAxQCEAMgAhADLAIQAzgCEANEAhADUAIQA1wCEANoAhADdAIQA4ACEAOMAhADmAIQA6QCEAOwAhADvAIQA8gCEAPUAhAD4AIQA+wCEAP4AhAEQAIQBEwCEARYAhAEZAIQBHACEAR8AhAEiAIQBJQCEASgAhAErAIQBLgCEATEAhACSAIcAmACHAJsAhwCeAIcAoQCHAKQAhwCnAIcAqgCHAK0AhwCwAIcAswCHAMUAhwDIAIcAywCHAM4AhwDRAIcA1ACHANcAhwDaAIcA3QCHAOAAhwDjAIcA5gCHAOkAhwDsAIcA7wCHAPIAhwD1AIcA+ACHAPsAhwD+AIcBEACHARMAhwEWAIcBGQCHARwAhwEfAIcBIgCHASUAhwEoAIcBKwCHAS4AhwExAIcAkgCKAJgAigCbAIoAngCKAKEAigCkAIoApwCKAKoAigCtAIoAsACKALMAigDFAIoAyACKAMsAigDOAIoA0QCKANQAigDXAIoA2gCKAN0AigDgAIoA4wCKAOYAigDpAIoA7ACKAO8AigDyAIoA9QCKAPgAigD7AIoA/gCKARAAigETAIoBFgCKARkAigEcAIoBHwCKASIAigElAIoBKACKASsAigEuAIoBMQCKAJIAjQCYAI0AmwCNAJ4AjQChAI0ApACNAKcAjQCqAI0ArQCNALAAjQCzAI0AxQCNAMgAjQDLAI0AzgCNANEAjQDUAI0A1wCNANoAjQDdAI0A4ACNAOMAjQDmAI0A6QCNAOwAjQDvAI0A8gCNAPUAjQD4AI0A+wCNAP4AjQEQAI0BEwCNARYAjQEZAI0BHACNAR8AjQEiAI0BJQCNASgAjQErAI0BLgCNATEAjQCSAJAAmACQAJsAkACeAJAAoQCQAKQAkACnAJAAqgCQAK0AkACwAJAAswCQAMUAkADIAJAAywCQAM4AkADRAJAA1ACQANcAkADaAJAA3QCQAOAAkADjAJAA5gCQAOkAkADsAJAA7wCQAPIAkAD1AJAA+ACQAPsAkAD+AJABEACQARMAkAEWAJABGQCQARwAkAEfAJABIgCQASUAkAEoAJABKwCQAS4AkAExAJAAkgCTAJgAkwCbAJMAngCTAKEAkwCkAJMApwCTAKoAkwCtAJMAsACTALMAkwDFAJMAyACTAMsAkwDOAJMA0QCTANQAkwDXAJMA2gCTAN0AkwDgAJMA4wCTAOYAkwDpAJMA7ACTAO8AkwDyAJMA9QCTAPgAkwD7AJMA/gCTARAAkwETAJMBFgCTARkAkwEcAJMBHwCTASIAkwElAJMBKACTASsAkwEuAJMBMQCTAJIAlgCYAJYAmwCWAJ4AlgChAJYApACWAKcAlgCqAJYArQCWALAAlgCzAJYAtgCWALkAlgC8AJYAvwCWAMIAlgDFAJYAyACWAMsAlgDOAJYA0QCWANQAlgDXAJYA2gCWAN0AlgDgAJYA4wCWAOYAlgDpAJYA7ACWAO8AlgDyAJYA9QCWAPgAlgD7AJYA/gCWAQEAlgEEAJYBBwCWAQoAlgENAJYBEACWARMAlgEWAJYBGQCWARwAlgEfAJYBIgCWASUAlgEoAJYBKwCWAS4AlgExAJYAkgCZAJgAmQCbAJkAngCZAKEAmQCkAJkApwCZAKoAmQCtAJkAsACZALMAmQC2AJkAuQCZALwAmQC/AJkAwgCZAMUAmQDIAJkAywCZAM4AmQDRAJkA1ACZANcAmQDaAJkA3QCZAOAAmQDjAJkA5gCZAOkAmQDsAJkA7wCZAPIAmQD1AJkA+ACZAPsAmQD+AJkBAQCZAQQAmQEHAJkBCgCZAQ0AmQEQAJkBEwCZARYAmQEZAJkBHACZAR8AmQEiAJkBJQCZASgAmQErAJkBMQCZAJUAnACYAJwAngCcAKEAnACkAJwApwCcAKoAnACtAJwAsACcALMAnAC2AJwAuQCcALwAnAC/AJwAwgCcAMUAnADIAJwAywCcAM4AnADRAJwA1ACcANcAnADaAJwA3QCcAOAAnADjAJwA5gCcAOkAnADsAJwA7wCcAPIAnAD1AJwA+ACcAPsAnAD+AJwBAQCcAQQAnAEHAJwBCgCcAQ0AnAEQAJwBEwCcARYAnAEZAJwBHACcAR8AnAEiAJwBJQCcAS4AnACbAJ8AngCfAKQAnwCnAJ8AqgCfAK0AnwCwAJ8AswCfALYAnwC5AJ8AvACfAL8AnwDCAJ8AxQCfAMgAnwDLAJ8AzgCfANEAnwDUAJ8A1wCfANoAnwDdAJ8A4ACfAOMAnwDmAJ8A6QCfAOwAnwDvAJ8A8gCfAPUAnwD4AJ8A+wCfAP4AnwEBAJ8BBACfAQcAnwEKAJ8BDQCfARAAnwETAJ8BFgCfARkAnwEcAJ8BHwCfASIAnwEoAJ8BKwCfAJ4AogChAKIAqgCiAK0AogCwAKIAswCiALYAogC5AKIAvACiAL8AogDCAKIAxQCiAMgAogDLAKIAzgCiANEAogDUAKIA1wCiANoAogDdAKIA4ACiAOMAogDmAKIA6QCiAOwAogDvAKIA8gCiAPUAogD4AKIA+wCiAP4AogEBAKIBBACiAQcAogEKAKIBDQCiARAAogETAKIBFgCiARkAogEcAKIBIgCiASUAogCkAKUApwClAK0ApQCwAKUAswClALYApQC5AKUAvAClAL8ApQDCAKUAxQClAMgApQDLAKUAzgClANEApQDUAKUA1wClANoApQDdAKUA4AClAOMApQDmAKUA6QClAOwApQDvAKUA8gClAPUApQD4AKUA+wClAP4ApQEBAKUBBAClAQcApQEKAKUBDQClARAApQETAKUBFgClARwApQEfAKUAqgCoAK0AqACzAKgAtgCoALkAqAC8AKgAvwCoAMIAqADFAKgAyACoAMsAqADOAKgA0QCoANQAqADXAKgA2gCoAN0AqADgAKgA4wCoAOYAqADpAKgA7ACoAO8AqADyAKgA9QCoAPgAqAD7AKgA/gCoAQEAqAEEAKgBBwCoAQoAqAENAKgBEACoARkAqACwAKsAuQCrALwAqwC/AKsAwgCrAMUAqwDIAKsAywCrAM4AqwDRAKsA1ACrANcAqwDaAKsA3QCrAOAAqwDjAKsA5gCrAOkAqwDsAKsA7wCrAPIAqwD1AKsA+ACrAPsAqwD+AKsBAQCrAQQAqwEHAKsBCgCrAQ0AqwETAKsBFgCrALMArgC2AK4AvACuAL8ArgDCAK4AxQCuAMgArgDLAK4AzgCuANEArgDUAK4A1wCuANoArgDdAK4A4ACuAOMArgDmAK4A6QCuAOwArgDvAK4A8gCuAPUArgD4AK4A+wCuAP4ArgEBAK4BBACuAQcArgENAK4BEACuALkAsQC8ALEAwgCxAMUAsQDIALEAywCxAM4AsQDRALEA1ACxANcAsQDaALEA3QCxAOAAsQDjALEA5gCxAOkAsQDsALEA7wCxAPIAsQD1ALEA+ACxAPsAsQD+ALEBAQCxAQoAsQC/ALQAwgC0AMgAtADLALQAzgC0ANEAtADUALQA1wC0ANoAtADdALQA4AC0AOMAtADmALQA6QC0AOwAtADvALQA8gC0APUAtAD4ALQA+wC0AP4AtAEEALQBBwC0AMUAtwDOALcA0QC3ANQAtwDXALcA2gC3AN0AtwDgALcA4wC3AOYAtwDpALcA7AC3AO8AtwDyALcA9QC3APgAtwD+ALcBAQC3AMgAugDLALoA0QC6ANQAugDXALoA2gC6AN0AugDgALoA4wC6AOYAugDpALoA7AC6AO8AugDyALoA+AC6APsAugDOAL0A0QC9ANcAvQDaAL0A3QC9AOAAvQDjAL0A5gC9AOkAvQDsAL0A9QC9ANQAwADdAMAA4ADAAOMAwADmAMAA6QDAAO8AwADyAMAA1wDDANoAwwDgAMMA4wDDAOkAwwDsAMMA3QDGAOAAxgDmAMY=');
  const simbolo = [];
  for (let i = 0; i < bytes.length; i += 4) {
    simbolo.push({ x: (bytes.charCodeAt(i) << 8) | bytes.charCodeAt(i + 1), y: (bytes.charCodeAt(i + 2) << 8) | bytes.charCodeAt(i + 3) });
  }
  const TONS = ["128, 0, 187", "146, 18, 204", "164, 62, 220"]; // roxo da marca e dois violetas
  const CORES = TONS.flatMap((tom) => [0, 1, 2, 3, 4, 5].map((n) => `rgba(${tom}, ${(.36 + n * .1).toFixed(2)})`));
  let largura = 0, altura = 0, formam = [], soltas = [], progresso = 0, desejado = 0, passoFormado = 4;
  let visivel = true, quadro = 0, anterior = 0, esperaToque = 0;
  const aleatorio = (semente) => {
    let v = semente >>> 0;
    return () => ((v = (1664525 * v + 1013904223) >>> 0) / 4294967296);
  };

  function montar() {
    // Recalcula tamanhos e os alvos do M sempre que a área muda.
    const r = secao.getBoundingClientRect();
    largura = r.width; altura = r.height;
    if (!largura || !altura) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.round(largura * dpr); tela.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pequeno = largura < 700;
    // Símbolo: até 2,5× no computador e 1,7× no celular.
    const escala = pequeno
      ? Math.min((largura - 56) / 175, (altura * .33) / 193, 1.7)
      : Math.min((largura * .46 - 42) / 175, (altura * .74) / 193, 2.5);
    // Os pontos do símbolo ficam a 3 unidades uns dos outros: formado, cada ponto
    // cresce até metade desse espaço (pontilhado leve, mas legível).
    passoFormado = 3 * escala * .5;
    const cx = largura * (pequeno ? .5 : .735);
    const cy = altura * (pequeno ? .77 : .52);
    const ox = cx - 175 * escala / 2, oy = cy - 193 * escala / 2;
    const r1 = aleatorio(90327);
    formam = simbolo.map((p) => ({
      x0: 20 + r1() * (largura - 40), y0: 16 + r1() * (altura - 32),
      x1: ox + (p.x - 140) * escala, y1: oy + (p.y - 12) * escala,
      fase: r1() * 6.283, raio: .75 + r1() * .7,
    }));
    // Poeira densa, proporcional à área (uma partícula a cada ~210px² no computador),
    // toda em roxo forte. Uma em sete é um pouco maior, para dar profundidade.
    const total = Math.min(pequeno ? 2200 : 6500, Math.round(largura * altura / (pequeno ? 170 : 210)));
    soltas = Array.from({ length: total }, () => {
      const grande = r1() < .14;
      return {
        x: r1() * largura, y: r1() * altura, fase: r1() * 6.283, vel: .5 + r1(),
        raio: grande ? 1.9 + r1() * .9 : .85 + r1() * 1.05,
        // alfa em 6 degraus (.36 a .86) para agrupar por cor ao desenhar
        nivel: Math.floor(r1() * 6), tom: Math.floor(r1() * 3),
      };
    });
    // Agrupa por cor: o fillStyle só muda 18 vezes por quadro, não milhares.
    soltas.sort((a, b) => (a.tom * 6 + a.nivel) - (b.tom * 6 + b.nivel));
    desenhar(performance.now());
    pedir();
  }

  function desenhar(t) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largura, altura);
    const mov = reduzido.matches ? 0 : 1;
    const k = progresso * progresso * (3 - 2 * progresso);
    let cor = -1;
    ctx.globalAlpha = 1 - k * .35;  // a poeira recua um pouco enquanto o M está formado
    for (const p of soltas) {
      const c = p.tom * 6 + p.nivel;
      if (c !== cor) { cor = c; ctx.fillStyle = CORES[c]; }
      const x = p.x + Math.sin(t * .00048 * p.vel + p.fase) * 5 * mov;
      const y = p.y + Math.cos(t * .00036 * p.vel + p.fase) * 6 * mov;
      ctx.fillRect(x, y, p.raio, p.raio);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(128, 0, 187, ${.5 + k * .3})`;
    for (const p of formam) {
      const dx = Math.sin(t * .00075 + p.fase) * 7 * mov;
      const dy = Math.cos(t * .0006 + p.fase) * 8 * mov;
      const x = p.x0 + dx + (p.x1 - p.x0 - dx) * k;
      const y = p.y0 + dy + (p.y1 - p.y0 - dy) * k;
      const s = p.raio + (passoFormado - p.raio) * k;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
  }

  function passo(t) {
    // progresso vai suavemente de 0 (solto) a 1 (símbolo formado) e volta.
    quadro = 0;
    if (!visivel) return;
    const dt = Math.min(50, t - (anterior || t)); anterior = t;
    if (reduzido.matches) progresso = desejado;
    else {
      progresso += (desejado - progresso) * (1 - Math.exp(-dt / 315));
      if (Math.abs(desejado - progresso) < .002) progresso = desejado;
    }
    desenhar(t);
    if (!reduzido.matches || progresso !== desejado) pedir();
  }
  function pedir() { if (!quadro && visivel) quadro = requestAnimationFrame(passo); }
  const juntar = () => { desejado = 1; pedir(); };
  const soltar = () => { desejado = 0; pedir(); };

  palco.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") juntar(); });
  palco.addEventListener("pointermove", (e) => { if (e.pointerType !== "touch") juntar(); });
  palco.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") soltar(); });
  // No celular, o toque forma o símbolo e ele se desfaz pouco depois; rolar a página continua livre.
  palco.addEventListener("pointerdown", (e) => { if (e.pointerType !== "touch") return; clearTimeout(esperaToque); juntar(); });
  palco.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "touch") return;
    clearTimeout(esperaToque);
    esperaToque = setTimeout(soltar, 1400);
  });
  palco.addEventListener("pointercancel", (e) => { if (e.pointerType === "touch") { clearTimeout(esperaToque); esperaToque = setTimeout(soltar, 900); } });
  palco.addEventListener("focus", juntar);
  palco.addEventListener("blur", soltar);
  palco.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); juntar(); } });
  palco.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") soltar(); });

  // Só desenha com a abertura à vista e a aba aberta.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      visivel = e ? e.isIntersecting : true;
      if (visivel) { anterior = 0; pedir(); } else { cancelAnimationFrame(quadro); quadro = 0; }
    }).observe(secao);
  }
  if ("ResizeObserver" in window) new ResizeObserver(montar).observe(secao);
  else { window.addEventListener("resize", montar); montar(); }
  reduzido.addEventListener("change", pedir);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(quadro); quadro = 0; } else { anterior = 0; pedir(); }
  });
})();
