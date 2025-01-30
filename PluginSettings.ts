export interface PluginSettings {
	model: string;
}

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	model: 'deepseek-r1:14b'
}
