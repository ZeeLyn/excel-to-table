import Excel from "exceljs";
export default {
    ValueType: Excel.ValueType,
    ThemeColors: ["FFFFFF", "000000", "EEECE1", "1F497D", "4F81BD", "C0504D", "9BBB59", "8064A2", "4BACC6", "F79646", "F2F2F2", "808080", "DDD9C4", "C5D9F1", "DCE6F1", "F2DCDB", "EBF1DE", "E4DFEC", "DAEEF3", "FDE9D9", "D9D9D9", "595959", "C4BD97", "8DB4E2", "B8CCE4", "E6B8B7", "D8E4BC", "CCC0DA", "B7DEE8", "FCD5B4", "BFBFBF", "404040", "948A54", "538DD5", "95B3D7", "DA9694", "C4D79B", "B1A0C7", "92CDDC", "FABF8F", "A6A6A6", "262626", "494529", "16365C", "366092", "963634", "76933C", "60497A", "31869B", "E26B0A", "808080", "0D0D0D", "1D1B10", "0F243E", "244062", "632523", "4F6228", "403151", "215967", "974706"],
    FromUrlAsync(url, options = {}) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState != XMLHttpRequest.DONE) return;
                if (request.status >= 200 && request.status < 300) {
                    this.FromDataAsync(request.response)
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject(request.response ? request.responseText : "Load failed");
                }
            };

            request.onerror = (err) => {
                reject(err);
            };
            request.ontimeout = () => {
                reject("timeout");
            };
            request.onabort = () => {
                reject("abort");
            };

            options = Object.assign(
                {
                    method: "GET",
                    async: true,
                    responseType: "blob",
                    headers: {},
                    timeout: 30 * 1000,
                },
                options
            );
            Object.keys(options.headers).forEach((key) => {
                request.setRequestHeader(key, options.headers[key]);
            });
            request.timeout = options.timeout;
            request.responseType = options.responseType;
            request.open(options.method, url, options.async);
            request.send();
        });
    },
    FromDataAsync(data) {
        return new Promise((resolve, reject) => {
            try {
                const workbook = new Excel.Workbook();
                var sheets = [];
                var self = this;
                workbook.xlsx
                    .load(data)
                    .then(() => {
                        //遍历sheet
                        workbook.eachSheet(function (sheet, sheetId) {
                            if (sheetId == 1) return;
                            var sheetDetail = {
                                id: sheetId,
                                name: sheet.name,
                                rows: [],
                                merge: [],
                            };
                            sheets.push(sheetDetail);
                            //遍历行
                            sheet.eachRow((row, rowNumber) => {
                                var rowDetail = {
                                    number: rowNumber,
                                    height: row.height,
                                    hidden: row.hidden,
                                    cells: [],
                                };
                                // console.log(row);
                                //遍历列
                                for (var i = 1; i <= sheet.columnCount; i++) {
                                    var cell = row.getCell(i);
                                    // console.log(rowNumber, i, cell.type, row, cell);
                                    if (cell) {
                                        if (!cell.isMerged) {
                                            //不是合并单元格
                                            self._appendCell(rowDetail.cells, cell);
                                        } else {
                                            //是合并单元格
                                            var merge = sheetDetail.merge.find((x) => x.address === cell.master.address);
                                            //已经添加了第一个合并单元格则不再添加
                                            if (merge) {
                                                //更新结束标记
                                                merge.end = {
                                                    row: cell.row,
                                                    col: cell.col,
                                                };
                                            } else {
                                                sheetDetail.merge.push({
                                                    address: cell.master.address,
                                                    row: cell.row,
                                                    col: cell.col,
                                                    start: {
                                                        row: cell.row,
                                                        col: cell.col,
                                                    },
                                                    end: {
                                                        row: cell.row,
                                                        col: cell.col,
                                                    },
                                                });
                                                self._appendCell(rowDetail.cells, cell);
                                            }
                                        }
                                    } else self._appendCell(rowDetail.cells, cell);
                                }

                                sheetDetail.rows.push(rowDetail);
                            });
                        });
                        resolve(sheets);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (err) {
                reject(err);
            }
        });
    },
    _appendCell(cells, cell) {
        if (!cell)
            cells.push({
                style: {},
                text: null,
            });
        else
            cells.push({
                address: cell.address,
                row: cell.row,
                col: cell.col,
                isMerged: cell.isMerged,
                type: cell.type,
                text: cell.text,
                html: cell.html,
                value: cell.value,
                style: cell.style,
            });
    },
};
