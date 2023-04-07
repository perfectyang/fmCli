import { CommandOptions } from "../../../types/index";
import { getI18nConfig } from "../../utils/initConfig";
import transform from "../../core";

export function translate(options: CommandOptions) {
  const i18nConfig = getI18nConfig(options);
  return transform(i18nConfig);
}
