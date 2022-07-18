/* tslint:disable */
// generated by typescript-json-validator
import { inspect } from "util";
import Ajv from "ajv";
import IPlantsState from "./types";
export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  format: "fast",
  nullable: true,
  unicode: true,
  uniqueItems: true,
  useDefaults: true,
});

ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));

export const IPlantsStateSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  definitions: {
    IPlant: {
      defaultProperties: [],
      properties: {
        description: {
          type: "string",
        },
        images: {
          items: {
            $ref: "#/definitions/Image",
          },
          type: "array",
        },
        lightLevelKey: {
          $ref: "#/definitions/LightLevelKeys",
        },
        name: {
          type: "string",
        },
        reminders: {
          items: {
            $ref: "#/definitions/IReminder",
          },
          type: "array",
        },
        temperatureRange: {
          items: {
            type: "number",
          },
          type: "array",
        },
        uuid: {
          type: "string",
        },
        wateringKey: {
          $ref: "#/definitions/WateringAmountKeys",
        },
      },
      required: [
        "description",
        "images",
        "lightLevelKey",
        "name",
        "reminders",
        "temperatureRange",
        "uuid",
        "wateringKey",
      ],
      type: "object",
    },
    IReminder: {
      defaultProperties: [],
      properties: {
        description: {
          type: "string",
        },
        icon: {
          type: "string",
        },
        periodHours: {
          type: "number",
        },
        startTimestamp: {
          type: "number",
        },
        title: {
          type: "string",
        },
      },
      required: ["icon", "periodHours", "startTimestamp", "title"],
      type: "object",
    },
    Image: {
      defaultProperties: [],
      properties: {
        key: {
          type: "string",
        },
        timestamp: {
          type: "number",
        },
      },
      required: ["key", "timestamp"],
      type: "object",
    },
    LightLevelKeys: {
      enum: ["DIRECT_SUN", "INDIRECT_SUN", "SHADE"],
      type: "string",
    },
    WateringAmountKeys: {
      enum: ["LITTLE", "LOTS", "NORMAL"],
      type: "string",
    },
  },
  properties: {
    cards: {
      items: {
        type: "string",
      },
      type: "array",
    },
    plants: {
      additionalProperties: {
        $ref: "#/definitions/IPlant",
      },
      defaultProperties: [],
      type: "object",
    },
    version: {
      type: "string",
    },
  },
  required: ["cards", "plants", "version"],
  type: "object",
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<Ajv.ValidateFunction, "errors">;
export const isIPlantsState = ajv.compile(
  IPlantsStateSchema
) as ValidateFunction<IPlantsState>;
export default function validate(value: unknown): IPlantsState {
  if (isIPlantsState(value)) {
    return value;
  } else {
    throw new Error(
      ajv.errorsText(
        isIPlantsState.errors!.filter((e: any) => e.keyword !== "if"),
        { dataVar: "IPlantsState" }
      ) +
        "\n\n" +
        inspect(value)
    );
  }
}
