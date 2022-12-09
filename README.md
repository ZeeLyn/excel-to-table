# excel-to-table
 
``` ps1
npm i @zeelyn/excel-to-table
```


```javascript
import ExcelToTable from "@zeelyn/excel-to-table";
 ExcelToTable.FromUrlAsync(".test.xlsx").then((sheets) => {
                                                                console.log(sheets);
                                                          });
//or
 ExcelToTable.FromDataAsync(data).then((sheets) => {
                                                        console.log(sheets);
                                                  });


```