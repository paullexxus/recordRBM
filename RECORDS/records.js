document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.getElementById('filter-form');
  const tableBody = document.querySelector('.styled-table tbody');
  const originalRows = Array.from(tableBody.rows); // Save the original rows for filtering

  // Event listener for form submission
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get selected filter values
    const periodValue = document.querySelector('.period').value;
    const categoryValue = document.getElementById('filter-category').value;
    const typeValue = document.getElementById('filter-type').value;
    const sortValue = document.getElementById('filter-sort').value;

    // Filter and sort logic
    let filteredRows = originalRows;

    // Apply period filter (if applicable)
    if (periodValue !== 'All Period') {
      filteredRows = filteredRows.filter(row => {
        const date = new Date(row.cells[0].textContent); // Assumes date is in the first column
        return isDateInRange(date, periodValue);
      });
    }

    // Apply category filter
    if (categoryValue !== 'all') {
      filteredRows = filteredRows.filter(row => {
        const category = row.cells[2].textContent.toLowerCase();
        return category.includes(categoryValue.toLowerCase());
      });
    }

    // Apply sorting
    filteredRows = sortRows(filteredRows, typeValue, sortValue);

    // Clear and repopulate the table with filtered rows
    tableBody.innerHTML = '';
    filteredRows.forEach(row => tableBody.appendChild(row));
  });

  // Function to sort rows based on selected type and order
  function sortRows(rows, type, order) {
    return rows.sort((a, b) => {
      let valueA, valueB;

      switch (type) {
        case 'Item Number':
          valueA = a.cells[1].textContent.trim();  // Item number as string
          valueB = b.cells[1].textContent.trim();
          break;
        case 'Item Name':
          valueA = a.cells[3].textContent.trim().toLowerCase(); // Item name as string
          valueB = b.cells[3].textContent.trim().toLowerCase();
          break;
        case 'Price':
          valueA = parseFloat(a.cells[4].textContent.trim()) || 0;  // Convert price to number
          valueB = parseFloat(b.cells[4].textContent.trim()) || 0;
          break;
        case 'Quantity':
          valueA = parseInt(a.cells[5].textContent.trim(), 10) || 0;  // Convert quantity to integer
          valueB = parseInt(b.cells[5].textContent.trim(), 10) || 0;
          break;
        default:
          return 0;  // No sorting for unknown types
      }

      if (order === 'Highest to Lowest' || order === 'Z-A') {
        return valueB > valueA ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });
  }

  // Function to filter rows based on the selected period
  function isDateInRange(date, period) {
    const today = new Date();
    let startDate;

    switch (period) {
      case 'Last 7 Days':
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      case 'This Year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return true; // No date filter if "All Period" is selected
    }

    return date >= startDate && date <= today;
  }
});
