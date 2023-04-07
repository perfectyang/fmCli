import type { PluginItem } from '@babel/core';
type presetsType = PluginItem[] | undefined;
type pluginsType = PluginItem[] | undefined;
export declare function initParse(babelPresets?: presetsType, babelPlugins?: pluginsType): (code: string) => any;
export {};
