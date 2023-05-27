export interface SortCategory {
	id:            number | string;
	name:          string;
	pronoun:       string;
	img?:           string;
	category_type?: number | string;
	dependable?:    string | number;
    subCategories?: Category[] | null;
}

export interface Category {
	id:            number | string;
	name:          string;
	pronoun:       string;
	img?:           string;
	category_type?: number | string;
	dependable?:    string | number;
    subCategories?: Category[] | null;
}

export const sortCategorys = (categorys: Category[]): SortCategory[] => {
  
      // Filtrar categorías principales
      const mainCategories = categorys.filter(category => category.category_type == 1);
      
      // Filtrar categorías secundarias
      const subCategories = categorys.filter(category => category.category_type == 2);
      
      // Ordenar categorías principales por nombre
      mainCategories.sort((a, b) => a.name.localeCompare(b.name));
      
      // Crear mapeo de categorías por ID
      const categoryMap:any = {};
      categorys.forEach(category => {
        categoryMap[category.id] = category;
      });
      
      // Asignar categorías secundarias a sus categorías principales correspondientes
      subCategories.forEach(category => {
        const dependable = category.dependable;
        if (dependable && categoryMap[dependable]) {
          categoryMap[dependable].subCategories = categoryMap[dependable].subCategories || [];
          categoryMap[dependable].subCategories.push(category);
        }
      });
      
      // Crear arreglo final ordenado sin subcategorías como principales
      const sortedCategories: SortCategory[] = mainCategories.map((category: Category) => {
        if (category.subCategories) {
          return {
            ...category,
            subCategories: category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
          };
        }
        return category;
      });

      return sortedCategories;
}


export const showSubCategorys = (categorys: Category[]): Category[] => {

    const subCategories = categorys.filter(category => category.category_type == 2);
    return subCategories;
}