// Define tilesheet named "persons_sheet"
Q.sheet("dp_persons_sheet",
		"dp_persons.png",
		{
			tilew: 32,
			tileh: 32,
			spacingX: 16
		}
);

Q.animations("dp_persons_anim", {
	
	stand_up16: { 	frames: [266], loop: false },
	stand_down16: { 	frames: [287], loop: false },
	stand_right16: { frames: [267], loop: false },
	stand_left16: { 	frames: [304], loop: false },
	
	walk_up16: { frames: [268, 266, 324], rate: 1/3 },
	walk_down16: { frames: [325, 287, 306], rate: 1/3 },
	walk_right16: { frames: [286, 267, 305], rate: 1/3 },
	walk_left16: { frames: [285, 304, 323], rate: 1/3 },
		
	stand_up1: { 	frames: [47], loop: false },
	stand_down1: { 	frames: [68], loop: false },
	stand_right1: { frames: [48], loop: false },
	stand_left1: { 	frames: [85], loop: false },
		
	walk_up1: { frames: [49, 47, 105], rate: 1/3 },
	walk_down1: { frames: [106, 68,87], rate: 1/3 },
	walk_right1: { frames: [67, 48, 86], rate: 1/3 },
	walk_left1: { frames: [66, 85, 104], rate: 1/3 },
	
	stand_up7: { 	frames: [123], loop: false },
	stand_down7: { 	frames: [144], loop: false },
	stand_right7: { frames: [124], loop: false },
	stand_left7: { 	frames: [161], loop: false },
		
	walk_up7: { frames: [125, 123, 181], rate: 1/3 },
	walk_down7: { frames: [182, 144,163], rate: 1/3 },
	walk_right7: { frames: [143, 124, 162], rate: 1/3 },
	walk_left7: { frames: [142, 161, 180], rate: 1/3 },
	
	stand_up13: { 	frames: [199], loop: false },
	stand_down13: { 	frames: [220], loop: false },
	stand_right13: { frames: [200], loop: false },
	stand_left13: { 	frames: [237], loop: false },
		
	walk_up13: { frames: [201, 199, 257], rate: 1/3 },
	walk_down13: { frames: [258, 220,239], rate: 1/3 },
	walk_right13: { frames: [219, 200, 238], rate: 1/3 },
	walk_left13: { frames: [218, 237, 256], rate: 1/3 },
	
	stand_up19: { 	frames: [275], loop: false },
	stand_down19: { 	frames: [296], loop: false },
	stand_right19: { frames: [276], loop: false },
	stand_left19: { 	frames: [313], loop: false },
		
	walk_up19: { frames: [277, 275, 333], rate: 1/3 },
	walk_down19: { frames: [334, 296,315], rate: 1/3 },
	walk_right19: { frames: [295, 276, 314], rate: 1/3 },
	walk_left19: { frames: [294, 313, 332], rate: 1/3 },
	
	stand_up25: { 	frames: [351], loop: false },
	stand_down25: { 	frames: [372], loop: false },
	stand_right25: { frames: [352], loop: false },
	stand_left25: { 	frames: [389], loop: false },
		
	walk_up25: { frames: [353, 351, 409], rate: 1/3 },
	walk_down25: { frames: [410, 372,391], rate: 1/3 },
	walk_right25: { frames: [371, 352, 390], rate: 1/3 },
	walk_left25: { frames: [370, 389, 408], rate: 1/3 },
	
	stand_up31: { 	frames: [427], loop: false },
	stand_down31: { 	frames: [448], loop: false },
	stand_right31: { frames: [428], loop: false },
	stand_left31: { 	frames: [465], loop: false },
		
	walk_up31: { frames: [429, 427, 485], rate: 1/3 },
	walk_down31: { frames: [486, 448,467], rate: 1/3 },
	walk_right31: { frames: [447, 428, 466], rate: 1/3 },
	walk_left31: { frames: [446, 465, 484], rate: 1/3 },
	
	stand_up37: { 	frames: [503], loop: false },
	stand_down37: { 	frames: [524], loop: false },
	stand_right37: { frames: [504], loop: false },
	stand_left37: { 	frames: [541], loop: false },
		
	walk_up37: { frames: [505, 503, 561], rate: 1/3 },
	walk_down37: { frames: [562, 524,543], rate: 1/3 },
	walk_right37: { frames: [523, 504, 542], rate: 1/3 },
	walk_left37: { frames: [522, 541, 560], rate: 1/3 },
	
	stand_up43: { 	frames: [579], loop: false },
	stand_down43: { 	frames: [600], loop: false },
	stand_right43: { frames: [580], loop: false },
	stand_left43: { 	frames: [617], loop: false },
		
	walk_up43: { frames: [581, 579, 637], rate: 1/3 },
	walk_down43: { frames: [638, 600,619], rate: 1/3 },
	walk_right43: { frames: [599, 580, 618], rate: 1/3 },
	walk_left43: { frames: [598, 617, 636], rate: 1/3 },
	
	stand_up49: { 	frames: [655], loop: false },
	stand_down49: { 	frames: [676], loop: false },
	stand_right49: { frames: [656], loop: false },
	stand_left49: { 	frames: [693], loop: false },
		
	walk_up49: { frames: [657, 655, 713], rate: 1/3 },
	walk_down49: { frames: [714, 676,695], rate: 1/3 },
	walk_right49: { frames: [675, 656, 694], rate: 1/3 },
	walk_left49: { frames: [674, 693, 712], rate: 1/3 },
	
	stand_up55: { 	frames: [731], loop: false },
	stand_down55: { 	frames: [752], loop: false },
	stand_right55: { frames: [732], loop: false },
	stand_left55: { 	frames: [769], loop: false },
		
	walk_up55: { frames: [733, 731, 789], rate: 1/3 },
	walk_down55: { frames: [790, 752,771], rate: 1/3 },
	walk_right55: { frames: [751, 732, 770], rate: 1/3 },
	walk_left55: { frames: [750, 769, 788], rate: 1/3 },
	
	stand_up61: { 	frames: [807], loop: false },
	stand_down61: { 	frames: [828], loop: false },
	stand_right61: { frames: [808], loop: false },
	stand_left61: { 	frames: [845], loop: false },
		
	walk_up61: { frames: [809, 807, 865], rate: 1/3 },
	walk_down61: { frames: [866, 828,847], rate: 1/3 },
	walk_right61: { frames: [827, 808, 846], rate: 1/3 },
	walk_left61: { frames: [826, 845, 864], rate: 1/3 },
	
	stand_up67: { 	frames: [883], loop: false },
	stand_down67: { 	frames: [904], loop: false },
	stand_right67: { frames: [884], loop: false },
	stand_left67: { 	frames: [921], loop: false },
		
	walk_up67: { frames: [885, 883, 941], rate: 1/3 },
	walk_down67: { frames: [942, 904,923], rate: 1/3 },
	walk_right67: { frames: [903, 884, 922], rate: 1/3 },
	walk_left67: { frames: [902, 921, 940], rate: 1/3 },
	
	stand_up73: { 	frames: [959], loop: false },
	stand_down73: { 	frames: [980], loop: false },
	stand_right73: { frames: [960], loop: false },
	stand_left73: { 	frames: [997], loop: false },
		
	walk_up73: { frames: [961, 959, 1017], rate: 1/3 },
	walk_down73: { frames: [1018, 980,999], rate: 1/3 },
	walk_right73: { frames: [979, 960, 998], rate: 1/3 },
	walk_left73: { frames: [978, 997, 1016], rate: 1/3 },
	
	stand_up79: { 	frames: [1035], loop: false },
	stand_down79: { 	frames: [1056], loop: false },
	stand_right79: { frames: [1036], loop: false },
	stand_left79: { 	frames: [1073], loop: false },
		
	walk_up79: { frames: [1037, 1035, 1093], rate: 1/3 },
	walk_down79: { frames: [1094, 1056,1075], rate: 1/3 },
	walk_right79: { frames: [1055, 1036, 1074], rate: 1/3 },
	walk_left79: { frames: [1054, 1073, 1092], rate: 1/3 },
	
	stand_up85: { 	frames: [1111], loop: false },
	stand_down85: { 	frames: [1132], loop: false },
	stand_right85: { frames: [1112], loop: false },
	stand_left85: { 	frames: [1149], loop: false },
		
	walk_up85: { frames: [1113, 1111, 1169], rate: 1/3 },
	walk_down85: { frames: [1170, 1132,1151], rate: 1/3 },
	walk_right85: { frames: [1131, 1112, 1150], rate: 1/3 },
	walk_left85: { frames: [1130, 1149, 1168], rate: 1/3 },
	
	stand_up91: { 	frames: [1187], loop: false },
	stand_down91: { 	frames: [1208], loop: false },
	stand_right91: { frames: [1188], loop: false },
	stand_left91: { 	frames: [1225], loop: false },
		
	walk_up91: { frames: [1189, 1187, 1245], rate: 1/3 },
	walk_down91: { frames: [1246, 1208,1227], rate: 1/3 },
	walk_right91: { frames: [1207, 1188, 1226], rate: 1/3 },
	walk_left91: { frames: [1206, 1225, 1244], rate: 1/3 },
	
	stand_up97: { 	frames: [1263], loop: false },
	stand_down97: { 	frames: [1284], loop: false },
	stand_right97: { frames: [1264], loop: false },
	stand_left97: { 	frames: [1301], loop: false },
		
	walk_up97: { frames: [1265, 1263, 1321], rate: 1/3 },
	walk_down97: { frames: [1322, 1284,1303], rate: 1/3 },
	walk_right97: { frames: [1283, 1264, 1302], rate: 1/3 },
	walk_left97: { frames: [1282, 1301, 1320], rate: 1/3 },
	
	stand_up103: { 	frames: [1339], loop: false },
	stand_down103: { 	frames: [1360], loop: false },
	stand_right103: { frames: [1340], loop: false },
	stand_left103: { 	frames: [1377], loop: false },
		
	walk_up103: { frames: [1341, 1339, 1397], rate: 1/3 },
	walk_down103: { frames: [1398, 1360,1379], rate: 1/3 },
	walk_right103: { frames: [1359, 1340, 1378], rate: 1/3 },
	walk_left103: { frames: [1358, 1377, 1396], rate: 1/3 },
	
	stand_up6: { 	frames: [114], loop: false },
	stand_down6: { 	frames: [135], loop: false },
	stand_right6: { frames: [115], loop: false },
	stand_left6: { 	frames: [152], loop: false },
		
	walk_up6: { frames: [116, 114, 172], rate: 1/3 },
	walk_down6: { frames: [173, 135,154], rate: 1/3 },
	walk_right6: { frames: [134, 115, 153], rate: 1/3 },
	walk_left6: { frames: [133, 152, 171], rate: 1/3 },
	
	stand_up12: { 	frames: [190], loop: false },
	stand_down12: { 	frames: [211], loop: false },
	stand_right12: { frames: [191], loop: false },
	stand_left12: { 	frames: [228], loop: false },
		
	walk_up12: { frames: [192, 190, 248], rate: 1/3 },
	walk_down12: { frames: [249, 211,230], rate: 1/3 },
	walk_right12: { frames: [210, 191, 229], rate: 1/3 },
	walk_left12: { frames: [209, 228, 247], rate: 1/3 },
	
	stand_up18: { 	frames: [266], loop: false },
	stand_down18: { 	frames: [287], loop: false },
	stand_right18: { frames: [267], loop: false },
	stand_left18: { 	frames: [304], loop: false },
		
	walk_up18: { frames: [268, 266, 324], rate: 1/3 },
	walk_down18: { frames: [325, 287,306], rate: 1/3 },
	walk_right18: { frames: [286, 267, 305], rate: 1/3 },
	walk_left18: { frames: [285, 304, 323], rate: 1/3 },
	
	stand_up24: { 	frames: [342], loop: false },
	stand_down24: { 	frames: [363], loop: false },
	stand_right24: { frames: [343], loop: false },
	stand_left24: { 	frames: [380], loop: false },
		
	walk_up24: { frames: [344, 342, 400], rate: 1/3 },
	walk_down24: { frames: [401, 363,382], rate: 1/3 },
	walk_right24: { frames: [362, 343, 381], rate: 1/3 },
	walk_left24: { frames: [361, 380, 399], rate: 1/3 },
	
	stand_up30: { 	frames: [418], loop: false },
	stand_down30: { 	frames: [439], loop: false },
	stand_right30: { frames: [419], loop: false },
	stand_left30: { 	frames: [456], loop: false },
		
	walk_up30: { frames: [420, 418, 476], rate: 1/3 },
	walk_down30: { frames: [477, 439,458], rate: 1/3 },
	walk_right30: { frames: [438, 419, 457], rate: 1/3 },
	walk_left30: { frames: [437, 456, 475], rate: 1/3 },
	
	stand_up36: { 	frames: [494], loop: false },
	stand_down36: { 	frames: [515], loop: false },
	stand_right36: { frames: [495], loop: false },
	stand_left36: { 	frames: [532], loop: false },
		
	walk_up36: { frames: [496, 494, 552], rate: 1/3 },
	walk_down36: { frames: [553, 515,534], rate: 1/3 },
	walk_right36: { frames: [514, 495, 533], rate: 1/3 },
	walk_left36: { frames: [513, 532, 551], rate: 1/3 },
	
	stand_up42: { 	frames: [570], loop: false },
	stand_down42: { 	frames: [591], loop: false },
	stand_right42: { frames: [571], loop: false },
	stand_left42: { 	frames: [608], loop: false },
		
	walk_up42: { frames: [572, 570, 628], rate: 1/3 },
	walk_down42: { frames: [629, 591,610], rate: 1/3 },
	walk_right42: { frames: [590, 571, 609], rate: 1/3 },
	walk_left42: { frames: [589, 608, 627], rate: 1/3 },
	
	stand_up48: { 	frames: [646], loop: false },
	stand_down48: { 	frames: [667], loop: false },
	stand_right48: { frames: [647], loop: false },
	stand_left48: { 	frames: [684], loop: false },
		
	walk_up48: { frames: [648, 646, 704], rate: 1/3 },
	walk_down48: { frames: [705, 667,686], rate: 1/3 },
	walk_right48: { frames: [666, 647, 685], rate: 1/3 },
	walk_left48: { frames: [665, 684, 703], rate: 1/3 },
	
	stand_up54: { 	frames: [722], loop: false },
	stand_down54: { 	frames: [743], loop: false },
	stand_right54: { frames: [723], loop: false },
	stand_left54: { 	frames: [760], loop: false },
		
	walk_up54: { frames: [724, 722, 780], rate: 1/3 },
	walk_down54: { frames: [781, 743,762], rate: 1/3 },
	walk_right54: { frames: [742, 723, 761], rate: 1/3 },
	walk_left54: { frames: [741, 760, 779], rate: 1/3 },
	
	stand_up60: { 	frames: [798], loop: false },
	stand_down60: { 	frames: [819], loop: false },
	stand_right60: { frames: [799], loop: false },
	stand_left60: { 	frames: [836], loop: false },
		
	walk_up60: { frames: [800, 798, 856], rate: 1/3 },
	walk_down60: { frames: [857, 819,838], rate: 1/3 },
	walk_right60: { frames: [818, 799, 837], rate: 1/3 },
	walk_left60: { frames: [817, 836, 855], rate: 1/3 },
	
	stand_up66: { 	frames: [874], loop: false },
	stand_down66: { 	frames: [895], loop: false },
	stand_right66: { frames: [875], loop: false },
	stand_left66: { 	frames: [912], loop: false },
		
	walk_up66: { frames: [876, 874, 932], rate: 1/3 },
	walk_down66: { frames: [933, 895,914], rate: 1/3 },
	walk_right66: { frames: [894, 875, 913], rate: 1/3 },
	walk_left66: { frames: [893, 912, 931], rate: 1/3 },
	
	stand_up72: { 	frames: [950], loop: false },
	stand_down72: { 	frames: [971], loop: false },
	stand_right72: { frames: [951], loop: false },
	stand_left72: { 	frames: [988], loop: false },
		
	walk_up72: { frames: [952, 950, 1008], rate: 1/3 },
	walk_down72: { frames: [1009, 971,990], rate: 1/3 },
	walk_right72: { frames: [970, 951, 989], rate: 1/3 },
	walk_left72: { frames: [969, 988, 1007], rate: 1/3 },
	
	stand_up78: { 	frames: [1026], loop: false },
	stand_down78: { 	frames: [1047], loop: false },
	stand_right78: { frames: [1027], loop: false },
	stand_left78: { 	frames: [1064], loop: false },
		
	walk_up78: { frames: [1028, 1026, 1084], rate: 1/3 },
	walk_down78: { frames: [1085, 1047,1066], rate: 1/3 },
	walk_right78: { frames: [1046, 1027, 1065], rate: 1/3 },
	walk_left78: { frames: [1045, 1064, 1083], rate: 1/3 },
	
	stand_up84: { 	frames: [1102], loop: false },
	stand_down84: { 	frames: [1123], loop: false },
	stand_right84: { frames: [1103], loop: false },
	stand_left84: { 	frames: [1140], loop: false },
		
	walk_up84: { frames: [1104, 1102, 1160], rate: 1/3 },
	walk_down84: { frames: [1161, 1123,1142], rate: 1/3 },
	walk_right84: { frames: [1122, 1103, 1141], rate: 1/3 },
	walk_left84: { frames: [1121, 1140, 1159], rate: 1/3 },
	
	stand_up90: { 	frames: [1178], loop: false },
	stand_down90: { 	frames: [1199], loop: false },
	stand_right90: { frames: [1179], loop: false },
	stand_left90: { 	frames: [1216], loop: false },
		
	walk_up90: { frames: [1180, 1178, 1236], rate: 1/3 },
	walk_down90: { frames: [1237, 1199,1218], rate: 1/3 },
	walk_right90: { frames: [1198, 1179, 1217], rate: 1/3 },
	walk_left90: { frames: [1197, 1216, 1235], rate: 1/3 },
	
	stand_up96: { 	frames: [1254], loop: false },
	stand_down96: { 	frames: [1275], loop: false },
	stand_right96: { frames: [1255], loop: false },
	stand_left96: { 	frames: [1292], loop: false },
		
	walk_up96: { frames: [1256, 1254, 1312], rate: 1/3 },
	walk_down96: { frames: [1313, 1275,1294], rate: 1/3 },
	walk_right96: { frames: [1274, 1255, 1293], rate: 1/3 },
	walk_left96: { frames: [1273, 1292, 1311], rate: 1/3 },
	
	stand_up102: { 	frames: [1330], loop: false },
	stand_down102: { 	frames: [1351], loop: false },
	stand_right102: { frames: [1331], loop: false },
	stand_left102: { 	frames: [1368], loop: false },
		
	walk_up102: { frames: [1332, 1330, 1388], rate: 1/3 },
	walk_down102: { frames: [1389, 1351,1370], rate: 1/3 },
	walk_right102: { frames: [1350, 1331, 1369], rate: 1/3 },
	walk_left102: { frames: [1349, 1368, 1387], rate: 1/3 },
	
	stand_up108: { 	frames: [1406], loop: false },
	stand_down108: { 	frames: [1427], loop: false },
	stand_right108: { frames: [1407], loop: false },
	stand_left108: { 	frames: [1444], loop: false },
		
	walk_up108: { frames: [1408, 1406, 1464], rate: 1/3 },
	walk_down108: { frames: [1465, 1427,1446], rate: 1/3 },
	walk_right108: { frames: [1426, 1407, 1445], rate: 1/3 },
	walk_left108: { frames: [1425, 1444, 1463], rate: 1/3 },

});