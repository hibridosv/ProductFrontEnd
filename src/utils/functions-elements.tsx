
export const removeElementById = (data: any, idToRemove: string) => {
    return data.filter((item: any) => item.id !== idToRemove);
  };
  

export const addElementToData = (dataArray:any, element: any) => {
    if (Array.isArray(dataArray)) {
      dataArray.push(element);
    } else {
      // Si "data" es un objeto, lo convertimos en un arreglo
      dataArray.data = [dataArray.data];
      dataArray.data.push(element);
    }
    return dataArray;
  };