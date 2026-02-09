const getNestedValue = (object, attr)=>{
if(!Array.isArray(attr)){
    return object[attr]; 
}
else{
   if(object[attr[0]]){
    return object[attr[0]][attr[1]]
   }
   else{
    return ''
   }
}
}
export default function exportCSV (columns, data, filename='Employee.csv'){
const headers = columns.map(c=>c.title).join(',')
const rows = data.map(row => {
    return columns.map(col => {
      
      let value = getNestedValue(row, col.dataIndex); 
     
     
      value = value.toString().replace(/"/g, '""'); 
      return `"${value}"`; 
    }).join(',');
  }).join('\n');
const csvContent = `\uFEFF${headers}\n${rows}`;
const blob = new Blob([csvContent], {
    type:'text/csv;charset=utf-8;'
})
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.setAttribute('href', url);
link.setAttribute('download', filename);
link.style.visibility='hidden';
document.body.appendChild(link);
link.click();
document.body.removeChild(link)
}