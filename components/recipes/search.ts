import Fuse from "fuse.js";
import { useMemo, useCallback } from "react";
import { IIngredientName, RecipeUuid } from "../../store/reducers/food/recipes/types";

export interface SearchableRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  ingredients: IIngredientName[];
}

const createFuseSearch = (
  data: SearchableRecipe[],
  options?: Fuse.IFuseOptions<SearchableRecipe>
) => {
  const defaultOptions = {
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true,
    threshold: 0.2,
  };
  return new Fuse(data, {
    ...defaultOptions,
    ...options,
  });
};

export const useQuerySearch = (
  queries: SearchableRecipe[],
  options?: Fuse.IFuseOptions<SearchableRecipe>
) => {
  const fuseSearch = useMemo(() => {
    return createFuseSearch(queries, options);
  }, [options, queries]);

  const query = useCallback(
    (query: string) => {
      return fuseSearch.search(query);
    },
    [fuseSearch]
  );

  return {
    search: query,
  };
};
