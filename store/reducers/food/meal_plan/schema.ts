import Ajv, { JSONSchemaType } from "ajv";
import { IDailyMealPlan, IMealPlanItem, IMealPlanState } from "./types";

const mealPlanItemSchema: JSONSchemaType<IMealPlanItem> = {
  type: "object",
  properties: {
    uuid: { type: "string" },
    servings: { type: "number" },
  },
  required: ["uuid", "servings"],
};

const dailyMealPlanSchema: JSONSchemaType<IDailyMealPlan> = {
  type: "array",
  items: mealPlanItemSchema,
};

const mealPlanStateSchema: JSONSchemaType<IMealPlanState> = {
  type: "object",
  properties: {
    version: { type: "string" },
    plan: {
      type: "object",
      patternProperties: {
        ".*": dailyMealPlanSchema,
      },
      required: [],
    },
  },
  required: ["version", "plan"],
};

const ajv = new Ajv();
export const isMealPlanValid = ajv.compile(mealPlanStateSchema);
