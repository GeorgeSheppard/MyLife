import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from "@mui/icons-material/Inventory";
import { IconButton, SxProps, Theme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../store/hooks/hooks";
import {
  deleteRecipe,
  IRecipeComponent,
  RecipeUuid,
} from "../../store/reducers/food/recipes";
import { WrappedCardMedia } from "../cards/wrapped_card_media";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBoolean } from "../hooks/use_boolean";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useDispatch } from "react-redux";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { Quantities } from "../../store/reducers/food/units";
import PersonIcon from "@mui/icons-material/Person";

export interface IRecipeCardProps {
  uuid: RecipeUuid;
  onEdit: () => void;
}

export const RecipeCard = (props: IRecipeCardProps) => {
  const dispatch = useDispatch();
  const recipe = useAppSelector((store) => store.food.recipes[props.uuid]);
  const [dialogOpen, setters] = useBoolean(false);

  const deleteRecipeOnClick = useCallback(() => {
    dispatch(deleteRecipe(props.uuid));
  }, [dispatch, props.uuid]);

  const headerChildren = useMemo(() => {
    const onEdit = props.onEdit;
    const turnOn = setters.turnOn;

    return (
      <>
        <Typography fontSize={24}>{recipe.name}</Typography>
        <div style={{ flexGrow: 1 }} />
        <IconButton
          onClick={(event) => {
            event?.stopPropagation();
            turnOn();
          }}
          size="small"
          sx={{ alignSelf: "center" }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={(event) => {
            event?.stopPropagation();
            onEdit();
          }}
          size="small"
          sx={{ alignSelf: "center" }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </>
    );
  }, [recipe.name, props.onEdit, setters.turnOn]);

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogTitle>{"Delete this recipe?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setters.turnOff}>{"No, cancel"}</Button>
          <Button onClick={deleteRecipeOnClick} autoFocus>
            {"Yes, I'm sure"}
          </Button>
        </DialogActions>
      </Dialog>
      <Card className="card">
        {recipe.images && <WrappedCardMedia images={recipe.images} />}
        <Accordion key="name">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ display: "flex" }}
          >
            {headerChildren}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{recipe.description}</Typography>
          </AccordionDetails>
        </Accordion>
        {recipe.components.length === 1 ? (
          <AccordionDetails>
            <List dense>
              <ComponentContentInstructionsMethod
                component={recipe.components[0]}
              />
            </List>
          </AccordionDetails>
        ) : (
          <>
            {recipe.components.map((component) => (
              <ComponentContent key={component.name} component={component} />
            ))}
          </>
        )}
      </Card>
    </>
  );
};

export interface IComponentContentInstructionsMethod {
  component: IRecipeComponent;
}

const ComponentContentInstructionsMethod = (
  props: IComponentContentInstructionsMethod
) => {
  const { component } = props;

  return (
    <>
      {component.ingredients.length > 0 && (
        <>
          <ListItem key="ingredients">
            <ListItemText primary="Ingredients" />
          </ListItem>
          {component.ingredients.map(({ name, quantity }) => (
            <ListItem key={name}>
              <ListItemText
                primary={
                  "- " + Quantities.toStringWithIngredient(name, quantity)
                }
              />
            </ListItem>
          ))}
        </>
      )}
      {component.instructions.length > 0 && (
        <>
          <ListItem key="method">
            <ListItemText primary="Method" />
          </ListItem>
          {component.instructions.map(({ text, optional }, index) => {
            let visibleText = `${index + 1}. `;
            if (optional) {
              visibleText += "(Optional) ";
            }
            visibleText += text;
            return (
              <ListItem key={text}>
                <ListItemText primary={visibleText} />
              </ListItem>
            );
          })}
        </>
      )}
    </>
  );
};

export interface IComponentContentProps {
  component: IRecipeComponent;
}

const ComponentContent = (props: IComponentContentProps) => {
  const { component } = props;
  return (
    <Accordion key={component.name}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ display: "flex" }}
      >
        <Typography>{component.name ?? "Optional"}</Typography>
        <div style={{ flexGrow: 1 }} />
        {component.servings && component.servings > 1 && (
          <Tooltip title={`Serves ${component.servings}`}>
            {/* div instead of fragment as tooltip doesn't work with fragment */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography>{component.servings}</Typography>
              <PersonIcon sx={{ paddingRight: 1 }} />
            </div>
          </Tooltip>
        )}
        {component.storeable && (
          <Tooltip title="Can be stored">
            <InventoryIcon sx={{ paddingRight: 1 }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          <ComponentContentInstructionsMethod component={component} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
