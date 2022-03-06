import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import {
  IErrorUploadResponse,
  IValidUploadResponse,
} from "../../pages/api/filesUpload";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  addOrUpdatePlant,
  IPlant,
  LightLevel,
  LightLevelKeys,
  PlantUuid,
  WateringAmount,
  WateringAmountKeys,
} from "../../store/reducers/plants";
import { ExitSaveButtons } from "../cards/exit_save_buttons";
import { ClickToUpload } from "../core/click_to_upload";
import { useBoolean } from "../hooks/use_boolean";
import { TemperatureSlider } from "./temperature_slider";
import { stopPropagation } from "../cards/utilities";

export interface IEditUploadPlant {
  /**
   * New plant will have a uuid but no data in store
   */
  uuid: PlantUuid;
  closeBackdrop: () => void;
}

export const EditUploadPlant = (props: IEditUploadPlant) => {
  const dispatch = useAppDispatch();
  const [uuid] = useState<PlantUuid>(props.uuid);
  const [uploading, setters] = useBoolean(false);
  // Return either the existing plant data, or a default form
  // Much easier to work with fully defined properties
  const plantData: IPlant = useAppSelector((store) => {
    if (uuid in store.plants.plants) {
      return store.plants.plants[uuid];
    } else {
      return {
        uuid,
        name: "",
        description: "",
        lightLevelKey: LightLevelKeys.INDIRECT_SUN,
        wateringKey: WateringAmountKeys.NORMAL,
        temperatureRange: [12, 25],
        images: [],
        reminders: [],
      };
    }
  });
  const [name, setName] = useState(plantData.name);
  const [images, setImages] = useState(plantData.images);
  const [description, setDescription] = useState(plantData.description);
  const [temperatureRange, setTemperatureRange] = useState(
    plantData.temperatureRange
  );

  const [wateringLevel, setWateringLevel] = useState(plantData.wateringKey);
  const [lightLevel, setLightLevel] = useState(plantData.lightLevelKey);

  const dispatchPlant = useCallback(() => {
    const close = props.closeBackdrop;

    dispatch(
      addOrUpdatePlant({
        uuid,
        name,
        description,
        lightLevelKey: lightLevel,
        wateringKey: wateringLevel,
        temperatureRange,
        images,
        // TODO: No reminders UI yet
        reminders: [],
      })
    );
    close();
  }, [
    dispatch,
    uuid,
    name,
    description,
    lightLevel,
    wateringLevel,
    temperatureRange,
    images,
    props.closeBackdrop,
  ]);

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container alignItems="center" justifyContent="center">
        <Grid item key="edit_upload" xs={12} sm={6} md={4}>
          <Card sx={{ padding: 4 }} onClick={stopPropagation}>
            <TextField
              key="NameTextField"
              fullWidth
              label={"Name"}
              value={name}
              id="name"
              variant="standard"
              margin="none"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setName(event.target.value)
              }
            />
            <div
              key="UploadAndImages"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingBottom: 20,
              }}
            >
              <ClickToUpload
                folder="images"
                fileFormatsAccepted={["png", "jpg"]}
                onStartUpload={setters.turnOn}
                onUploadError={(response: IErrorUploadResponse) => {
                  // TODO: Make this a user notification
                  console.log(response.error);
                  setters.turnOff();
                }}
                onUploadFinished={(response: IValidUploadResponse) => {
                  setImages((images) =>
                    images.concat({
                      path: response.writePath,
                      timestamp: Date.now(),
                    })
                  );
                  setters.turnOff();
                }}
              >
                <div style={{ paddingTop: 15 }}>
                  <Paper
                    elevation={1}
                    sx={{ width: 100, height: 100, display: "flex" }}
                  >
                    <Box component="div" sx={{ flexGrow: 0.5 }} />
                    <Box
                      component="div"
                      sx={{ display: "flex", margin: "auto" }}
                    >
                      {uploading ? (
                        <CircularProgress />
                      ) : (
                        <UploadIcon fontSize="large" />
                      )}
                    </Box>
                    <Box component="div" sx={{ flexGrow: 0.5 }} />
                  </Paper>
                </div>
              </ClickToUpload>
              {images.map((image) => {
                return (
                  <div style={{ paddingTop: 15 }} key={image.timestamp}>
                    <Paper
                      elevation={1}
                      sx={{
                        width: 100,
                        height: 100,
                        minWidth: 100,
                        display: "flex",
                      }}
                    >
                      <Box component="div" sx={{ flexGrow: 0.5 }} />
                      <Box
                        component="div"
                        sx={{
                          display: "flex",
                          margin: "auto",
                        }}
                      >
                        <CardMedia
                          src={image.path}
                          component="img"
                          height={100}
                        />
                      </Box>
                      <Box component="div" sx={{ flexGrow: 0.5 }} />
                    </Paper>
                  </div>
                );
              })}
            </div>
            <TemperatureSlider
              temperatureRange={temperatureRange}
              setTemperatureRange={setTemperatureRange}
            />
            <div
              key="LightLevelCheckboxes"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
              }}
            >
              {Object.entries(LightLevel).map(
                ([key, data]: [string, { tooltip: string; icon: any }]) => {
                  return (
                    <FormControlLabel
                      key={data.tooltip}
                      value="top"
                      control={<Checkbox checked={key === lightLevel} />}
                      label={
                        <Tooltip title={data.tooltip}>{data.icon}</Tooltip>
                      }
                      labelPlacement="top"
                      onClick={() => setLightLevel(key as LightLevelKeys)}
                    />
                  );
                }
              )}
            </div>
            <div
              key="WateringAmountCheckboxes"
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 15,
                paddingBottom: 15,
              }}
            >
              {Object.entries(WateringAmount).map(
                ([key, data]: [string, { tooltip: string; icon: any }]) => {
                  return (
                    <FormControlLabel
                      key={data.tooltip}
                      value="top"
                      control={<Checkbox checked={key === wateringLevel} />}
                      label={
                        <Tooltip title={data.tooltip}>
                          <Icon>
                            <Image
                              src={data.icon.src}
                              width={data.icon.width}
                              height={data.icon.height}
                              alt="watering level"
                            />
                          </Icon>
                        </Tooltip>
                      }
                      labelPlacement="top"
                      onClick={() =>
                        setWateringLevel(key as WateringAmountKeys)
                      }
                    />
                  );
                }
              )}
            </div>
            <TextField
              key="DescriptionTextBox"
              fullWidth
              label={"Description"}
              value={description}
              id="description"
              variant="standard"
              multiline
              maxRows={12}
              margin="none"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(event.target.value)
              }
            />
            <ExitSaveButtons
              exitOnClick={props.closeBackdrop}
              saveOnClick={dispatchPlant}
              saveDisabled={name.length === 0}
              buttonSx={{ flexGrow: 0.4 }}
              boxSx={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
