import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Container, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RecipeCard } from "../../components/recipes/content_card";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRecipeSearch } from "../../components/recipes/search_bar";
import { useRouter } from "next/router";
import { SearchChip } from "../../components/recipes/search_chip";
import Typography from "@mui/material/Typography"

const Recipes = () => {
  const router = useRouter();
  const [keys, setKeys] = useState(() => new Set(["name"]));
  const { searchInput, setSearchInput, searchResults } = useRecipeSearch(keys);

  const removeOrAddKey = useCallback((key: string) => {
    setKeys((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid item key={"Search"}>
          <div style={{justifyContent: "end", display: "flex"}}>
          <SearchChip
            label="Name"
            keys={keys}
            removeOrAddKey={removeOrAddKey}
            property="name"
          />
          <SearchChip
            label="Description"
            keys={keys}
            removeOrAddKey={removeOrAddKey}
            property="description"
            sx={{ ml: 1 }}
          />
          <SearchChip
            label="Ingredient"
            keys={keys}
            removeOrAddKey={removeOrAddKey}
            property="ingredients"
            sx={{ ml: 1 }}
          />
          </div>

          <OutlinedInput
            value={searchInput}
            onChange={setSearchInput}
            sx={{ marginBottom: 3, mt: 1 }}
            placeholder="Search"
            fullWidth
          />
        </Grid>
        <Grid container spacing={4}>
          <CreateNewRecipeCard
            onClick={() => router.push(`/food/${uuidv4()}`)}
          />
          {searchResults.map((uuid) => (
            <Grid item key={uuid} xs={12} sm={6} md={4}>
              <RecipeCard
                uuid={uuid}
                onEdit={() => router.push(`/food/${uuid}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

interface ICreateNewRecipeCard {
  onClick: (uuid: RecipeUuid) => void;
}

const CreateNewRecipeCard = (props: ICreateNewRecipeCard) => {
  const uuidOnClick = useCallback(() => {
    const onClick = props.onClick;
    onClick(uuidv4());
  }, [props.onClick]);

  return (
    <Grid item key={"CreateRecipe"} xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          minHeight: "10vw",
          display: "flex",
        }}
        className="card"
        onClick={uuidOnClick}
      >
        <Box component="div" sx={{ flexGrow: 0.5 }} />
        <Box component="div" sx={{ display: "flex", margin: "auto" }}>
          <AddIcon fontSize="large" />
        </Box>
        <Box component="div" sx={{ flexGrow: 0.5 }} />
      </Card>
    </Grid>
  );
};

export default Recipes;
