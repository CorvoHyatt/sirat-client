function sortTable(n,type) 
{  
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  dir = "asc";  
  switching = true;
  while (switching) 
  {
    switching = false;
    rows = table.rows;
    for (i = 3 /*las primeras dos no, por ser los th*/; i < (rows.length - 1); i++) 
    {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") 
      {
        if ((type=="str" && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) || (type=="int" && parseFloat(x.innerHTML) > parseFloat(y.innerHTML))) 
        {
          shouldSwitch= true;
          break;
        }
      } 
      else if (dir == "desc") 
      {
        if ((type=="str" && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) || (type=="int" && parseFloat(x.innerHTML) < parseFloat(y.innerHTML))) 
        {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) 
    {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else 
    {
      if (switchcount == 0 && dir == "asc") 
      {
        dir = "desc";
        switching = true;
      }
    }
  }

  th = rows[1].getElementsByTagName("th")[n];
  th.className = dir;   
//  th.className = sortOrder === 1 ? "asc" : "desc";   
}
