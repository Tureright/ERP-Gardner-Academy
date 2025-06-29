export const getFilteredData = (items, filters, filterSchema) => {
  const data = items.data;
  console.log("data items:", data)
  const filteredData = items.filter((record) => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true;

      const filterConfig = filterSchema[field];
      
      // Función para obtener el valor de una propiedad anidada
      const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
      };

      // Obtener el valor del campo, manejando propiedades anidadas
      const recordValue = getNestedValue(record, field);

      switch (filterConfig.type) {
        case "text":
          return typeof recordValue === 'string' 
            ? recordValue.toLowerCase().includes(value.toLowerCase())
            : false;
        case "select":
          return recordValue === value;
        default:
          return true;
      }
    });
  });
  console.log("filtered data: ", filteredData);
  return filteredData;
};
